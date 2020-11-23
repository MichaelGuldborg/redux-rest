import {RequestMethod, RestClient} from "./restClient";
import AppResponse, {responseFromError} from "../../models/AppResponse";
import Identifiable from "../../models/Identifyable";


export interface CrudPropertyServiceType<T extends Partial<Identifiable>> {
    getAll: (id?: string) => AppResponse<T[]>;
    get: (id?: string, key?: string) => AppResponse<T>;
    create: (id?: string, element?: T) => AppResponse<T>;
    update: (id?: string, element?: T) => AppResponse<T>;
    delete: (id?: string, element?: T) => AppResponse<T>;
}

export function crudPropertyService<T extends Partial<Identifiable>>(
    client: RestClient,
    path: string,
    valueName: string,
): CrudPropertyServiceType<T> {
    const basePath = (id: string) => '' + path + '/' + id + '/' + valueName;
    const elementPath = (id: string, key: string) => basePath(id) + '/' + key;
    return {
        async getAll(id) {
            if (!id?.length) return responseFromError(404)
            return await client.fetchJSON(RequestMethod.GET, basePath(id));
        },
        async get(id?: string, key?: string) {
            if (!id?.length || !key?.length) return responseFromError(404)
            return client.fetchJSON(RequestMethod.GET, elementPath(id, key));
        },
        async create(id, element) {
            if (!id?.length) return responseFromError(404)
            return client.fetchJSON(RequestMethod.POST, basePath(id), element);
        },
        async update(id, element) {
            if (!id?.length || !element?.id?.length) return responseFromError(404)
            return client.fetchJSON(RequestMethod.PUT, elementPath(id, element.id), element);
        },
        async delete(id, element) {
            if (!id?.length || !element?.id?.length) return responseFromError(404)
            return await client.fetchJSON(RequestMethod.DELETE, elementPath(id, element.id));
        },
    };
}