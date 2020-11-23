import {RequestMethod, restClient, RestClient} from "./restClient";
import AppResponse, {AppErrorResponse, AppSuccessResponse} from "../../models/AppResponse";


interface Call {
    id: string;
    used: boolean;
    startedAt: Date | undefined;
    endedAt: Date | undefined;
    durationInMilliSeconds: number | undefined;
    redirects: { [p: string]: string };
    createdAt: Date;
    updatedAt: Date;
}

export type VideoService = {
    createCall: (arg: { [p in string]: string }) => AppResponse<Call>;
}

export function videoService(client: RestClient): VideoService {
    return {
        async createCall(redirects): Promise<AppSuccessResponse<Call> | AppErrorResponse> {
            return await client.fetchJSON(RequestMethod.POST, '/api/v1/video', redirects);
        }
    }
}

export const video = videoService(restClient('https://dev.api.danmark.ai'));
export default video;