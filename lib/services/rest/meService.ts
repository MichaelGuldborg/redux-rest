import {RequestMethod, RestClient} from "./restClient";
import AppResponse, {responseFromError} from "../../models/AppResponse";
import UserProject from "../../models/UserProject";
import {User} from "../../models/User";


export interface MeServiceType {
    getProjects: () => AppResponse<Required<UserProject[]>>;
    updateImage: (image?: File) => AppResponse<Required<User>>;
}

export const meService = (client: RestClient): MeServiceType => {
    const basePath = '/api/v1/me';
    return {
        getProjects: async () => {
            return client.fetchForm(RequestMethod.GET, basePath + '/projects')
        },
        updateImage: async (file) => {
            if (file === undefined) return responseFromError(400);
            const requestBody = new FormData();
            requestBody.append("file", file);
            return client.fetchForm(RequestMethod.PUT, basePath + '/image', requestBody)
        }
    };
};

export default meService;


