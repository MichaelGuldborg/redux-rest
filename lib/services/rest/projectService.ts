import {RequestMethod, RestClient} from "./restClient";
import {crudService, CrudServiceType} from "./crudService";
import Project from "../../models/Project";
import AppResponse, {responseFromError} from "../../models/AppResponse";


export type ProjectServiceType = CrudServiceType<Project> & {
    updateImage: (id?: string, logo?: File) => AppResponse<Required<Project>>;
};

export const projectService = (client: RestClient): ProjectServiceType => {
    const basePath = '/api/v1/projects';
    return {
        ...crudService<Project>(client, basePath),
        updateImage: async (id, file) => {
            if (!id?.length || file === undefined) return responseFromError(400);
            const requestBody = new FormData();
            requestBody.append("file", file);
            return client.fetchForm(RequestMethod.PUT, basePath + '/' + id + '/image', requestBody)
        }
    };
};

export default projectService;


