import {crudService, CrudServiceType} from "./crudService";
import {restClient, RestClient} from "./restClient";
import Tag from "../../models/Tag";
import authService, {AuthServiceType} from "./authService";
import userService, {UserServiceType} from "./userService";
import projectService, {ProjectServiceType} from "./projectService";
import {crudPropertyService, CrudPropertyServiceType} from "./crudPropertyService";
import ProjectUser from "../../models/ProjectUser";
import Journal from "../../models/Journal";
import meService, {MeServiceType} from "./meService";
import {SurveyCollection} from "../../models/SurveyCollection";
import {Survey} from "../../models/Survey";


export const API_ENV: string | undefined = process.env.REACT_APP_API_ENV || 'development';

// export const isProductionMode = API_ENV === 'production';
export const isDevelopmentMode = API_ENV === 'development' || API_ENV === 'staging';
export const isLocalhostMode = API_ENV === 'localhost';


const PROD_HOST = 'https://api.diti.dk';
const STAGING_HOST = 'https://dev.api.diti.dk';
const LOCAL_HOST = 'http://localhost:5000';
export const HOST = isLocalhostMode ? LOCAL_HOST : isDevelopmentMode ? STAGING_HOST : PROD_HOST;

export interface AppService {
    readonly client: RestClient;
    readonly auth: AuthServiceType;
    readonly me: MeServiceType;
    readonly users: UserServiceType;
    readonly projects: ProjectServiceType;
    readonly journals: CrudPropertyServiceType<Journal>;
    readonly projectUsers: CrudPropertyServiceType<ProjectUser>;
    readonly surveyCollection: CrudPropertyServiceType<SurveyCollection>;
    readonly survey: CrudPropertyServiceType<Survey>;
    readonly tags: CrudServiceType<Tag>;
}

export const appService = (): AppService => {
    const client = restClient(HOST);
    return {
        client,
        auth: authService(client),
        me: meService(client),
        users: userService(client),
        projects: projectService(client),
        projectUsers: crudPropertyService(client, '/api/v1/projects', 'users'),
        journals: crudPropertyService(client, '/api/v1/projects', "journals"),
        surveyCollection: crudPropertyService(client, '/api/v1/projects', 'survey-collections'),
        survey: crudPropertyService(client, '/api/v1/survey-collections', 'surveys'),
        tags: crudService<Tag>(client, '/api/v1/tags'),
    }
};

export const services = appService();

export default services;