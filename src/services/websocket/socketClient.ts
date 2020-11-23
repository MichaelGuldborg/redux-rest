import {HubConnection} from "@microsoft/signalr";
import signalRConnection, {SignalRFunctions} from "./signalRConnection";


export interface SocketClient {
    connection: HubConnection,
}


export const socketClient = <T>(url: string, functions: SignalRFunctions<T>): SocketClient => {
    const connection = signalRConnection(url, functions);
    return {
        connection,
    }
}

export default socketClient;