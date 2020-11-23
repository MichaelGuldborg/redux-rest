import {HOST} from "../rest/appService";
import {HttpTransportType, HubConnection, HubConnectionBuilder, JsonHubProtocol, LogLevel} from "@microsoft/signalr";
import {loadAuthState} from "../localStorage";

export const startSignalRConnection = (hubPath: string, connection: HubConnection) => connection.start()
    .then(() => console.info(hubPath + ' Connected'))
    .catch(err => {
        console.error('Connection Error: ', err)
    });

export const appSignalRClient = (hubPath: string, params: string, anonymous: boolean): HubConnection => {

    const connectionHub = `${HOST}/${hubPath}?${params}`;
    const protocol = new JsonHubProtocol();
    const transport = HttpTransportType.WebSockets | HttpTransportType.LongPolling;

    const options = {
        transport,
        logMessageContent: false,
        logger: LogLevel.Error,
        accessTokenFactory: () => anonymous ? '' : loadAuthState().authorization?.accessToken ?? ''
    };

    return new HubConnectionBuilder()
        .withUrl(connectionHub, options)
        .withHubProtocol(protocol)
        .withAutomaticReconnect()
        .build();
};


