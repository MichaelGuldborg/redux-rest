import {RestClient, RequestMethod} from "./restClient";
import AppResponse, {responseFromError} from "../../models/AppResponse";
import Identifiable from "../../models/Identifyable";


export interface RequestFunction<Request> {
    (element: Request): AppResponse<Request>;
}

export interface ListRequestFunction<T> {
    (): AppResponse<T[]>;
}

export interface IdListRequestFunction<T> {
    (id: string): AppResponse<T[]>;
}

export interface IdRequestFunction<Response> {
    (id: string): AppResponse<Response>;
}



export interface CrudServiceType<Request extends Partial<Identifiable>> {
    getAll: ListRequestFunction<Required<Request>>;
    get: IdRequestFunction<Request>;
    create: RequestFunction<Request>;
    update: RequestFunction<Request>;
    delete: RequestFunction<Request>;
}

export function crudService<Request extends Partial<Identifiable>>(
    client: RestClient,
    path: string,
    // parse: ParseFunctionType<T> = parseFunction<Required<T & Identifiable>>()
): CrudServiceType<Request> {
    const elementPath = (id: string) => '' + path + '/' + id;
    return {
        async getAll() {
            return await client.fetchJSON(RequestMethod.GET, path);
        },
        async get(id: string) {
            if (!id) return responseFromError(400);
            return client.fetchJSON(RequestMethod.GET, elementPath(id));
        },
        async create(element) {
            return client.fetchJSON(RequestMethod.POST, path, element);
        },
        async update(element) {
            if (!element.id) return responseFromError(400);
            return client.fetchJSON(RequestMethod.PUT, elementPath(element.id), element);
        },
        async delete(element) {
            if (!element.id) return responseFromError(400);
            return await client.fetchJSON(RequestMethod.DELETE, elementPath(element.id));
        },
    };
}