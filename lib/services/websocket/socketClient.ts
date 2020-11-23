import {HubConnection} from "@microsoft/signalr";
import {HOST} from "../rest/appService";
import signalRConnection, {SignalRFunctions} from "./signalRConnection";


export interface SocketClient {
    connection: HubConnection,
}


export const socketClient = <T>(urlPath: string, functions: SignalRFunctions<T>): SocketClient => {
    const url = HOST + urlPath;
    const connection = signalRConnection(url, functions);
    return {
        connection,
    }
}

export default socketClient;