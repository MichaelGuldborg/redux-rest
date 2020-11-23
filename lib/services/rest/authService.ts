import AppResponse from "../../models/AppResponse";
import {User} from "../../models/User";
import {RequestMethod, RestClient} from "./restClient";
import SignInResponse from "../../models/SignInRespose";
import {RegisterUserRequest} from "../../pages/auth/RegisterUserAuthForm";

export interface AuthServiceType {
    register: (request: RegisterUserRequest, token: string) => AppResponse<Required<User>>;
    signInWithEmail: (email: string, password: string) => AppResponse<SignInResponse>;
    forgotPassword: (email: string) => AppResponse<undefined>;
    resetPassword: (password: string, token: string) => AppResponse<undefined>;
    fetchAuthorization: () => AppResponse<Required<SignInResponse>>;
    updateToken: (projectId: string) => AppResponse<SignInResponse>;

}

export const authService = (client: RestClient): AuthServiceType => {
    const basePath = '/api/v1/auth';
    return {
        register: (request, token) => {
            return client.fetchJSON(RequestMethod.POST, basePath + '/email/register', request, {
                'Authorization': 'Bearer ' + token,
            });
        },
        fetchAuthorization: () => {
            return client.fetchJSON(RequestMethod.GET, basePath);
        },
        signInWithEmail: async (email, password) => {
            const response = await client.fetchJSON<SignInResponse>(RequestMethod.POST, basePath + '/email', {
                email: email,
                password: password,
            });
            if (response.success) {
                client.setAuthorization(response.value.authorization)
            }
            return response;
        },
        forgotPassword: async (email: string) => {
            return await client.fetchJSON(RequestMethod.POST, basePath + '/forgot-password', {
                email: email,
            });
        },
        resetPassword: async (password: string, token: string) => {
            const authorization = 'Bearer ' + token;
            return await client.fetchJSON(RequestMethod.POST, basePath + '/reset-password', {
                password: password,
            }, {
                Authorization: authorization,
            });
        },
        updateToken: async (projectId: string) => {
            const response = await client.fetchJSON<SignInResponse>(RequestMethod.GET, basePath + '?projectId=' + projectId);
            if (response.success) {
                client.setAuthorization(response.value.authorization)
            }
            return response;
        }
    }
};

export default authService;