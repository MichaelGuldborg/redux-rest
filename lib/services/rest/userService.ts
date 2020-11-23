import AppResponse from "../../models/AppResponse";
import {User} from "../../models/User";
import {RequestMethod, RestClient} from "./restClient";
import {RegisterUserRequest} from "../../pages/auth/RegisterUserAuthForm";
import {crudService, CrudServiceType} from "./crudService";

export type UserServiceType = CrudServiceType<User> & {
    create: (request: RegisterUserRequest) => AppResponse<Required<User>>;
}

export const userService = (client: RestClient): UserServiceType => {
    const basePath = '/api/v1/users';
    return {
        ...crudService<User>(client, basePath),
        create: (request: User | RegisterUserRequest) => {
            return client.fetchJSON<Required<User>>(RequestMethod.POST, basePath, {
                ...request,
            });
        },
    };
};

export default userService;


