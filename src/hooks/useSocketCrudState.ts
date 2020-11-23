import Identifiable from "../models/Identifyable";
import {useEffect, useState} from "react";
import {HubConnectionState} from "@microsoft/signalr";
import {SignalRClient, SignalRFunctions} from "../services/websocket/signalRConnection";


export const useSocketCrudState = <T extends Identifiable, C extends SignalRClient>(url: string, connection: (url: string, functions: SignalRFunctions<T>) => C): [T[], C] => {
    const [elements, setElements] = useState<T[]>([]);

    const [client] = useState(connection(url, {
        onRefresh: elements => setElements(elements),
        onUpdate: element => {
            const newElements = [...elements];
            const elementIndex = elements.findIndex((a) => a.id === element.id);
            elementIndex === -1 ? newElements.unshift(element) : (newElements[elementIndex] = element);
            setElements(newElements);
        },
    }));
    useEffect(() => {
        if (client.connection.state === HubConnectionState.Connected) return;
        console.log("connect", client.connection.baseUrl);
        client.connection.start().catch((error) => console.error(error));
        return () => {
            client.connection.stop();
        }
    }, [client]);

    return [elements, client]
}

export default useSocketCrudState