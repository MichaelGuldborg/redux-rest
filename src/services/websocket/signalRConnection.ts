import {HttpTransportType, HubConnection, HubConnectionBuilder, JsonHubProtocol, LogLevel} from "@microsoft/signalr";

export class SignalRMethods {
    static readonly refresh = "refresh";
    static readonly update = "update";
}

export interface SignalRFunctions<T> {
    onRefresh?: (elements: T[]) => void;
    onUpdate?: (element: T) => void;
}

export interface SignalRClient {
    connection: HubConnection,
}

export const startSignalRConnection = (hubPath: string, connection: HubConnection) => connection.start()
    .then(() => console.info(hubPath + ' Connected'))
    .catch(err => {
        console.error('Connection Error: ', err)
    });

export const signalRConnection = <T>(url: string, functions?: SignalRFunctions<T>): HubConnection => {
    const connection = new HubConnectionBuilder()
        .withUrl(url, {
            transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
            logMessageContent: false,
            logger: LogLevel.Error,
            accessTokenFactory: () => '',
        })
        .withHubProtocol(new JsonHubProtocol())
        .withAutomaticReconnect()
        .build();


    connection.on(SignalRMethods.refresh, (args) => {
        if (functions?.onRefresh === undefined) return;
        console.log(SignalRMethods.refresh, url + '\n', args);
        return functions?.onRefresh(args);
    });

    connection.on(SignalRMethods.update, (args) => {
        if (functions?.onUpdate === undefined) return;
        console.log(SignalRMethods.update, url + '\n', args);
        return functions?.onUpdate(args);
    });

    return connection;
};

export default signalRConnection;