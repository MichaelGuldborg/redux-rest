import ChatThread, {ChatMessage} from "../../models/ChatThread";
import {HOST} from "../rest/appService";
import signalRConnection from "./signalRConnection";
import {SocketClient} from "./socketClient";
import Author from "../../models/Author";


export interface ChatMessageRequest {
    threadId: string,
    projectId: string,
    content: string,
    author: {
        id: string,
        name: string,
    }
}

export interface ChatClient extends SocketClient {
    author?: Author;
    respond: (request: ChatMessageRequest) => Promise<ChatMessage>;
    setRead: (threadId: string, read: boolean) => Promise<ChatThread>;
    setName: (threadId: string, name: string) => Promise<ChatThread>;


    sendMessage: (thread: ChatThread, text: string) => Promise<ChatMessage>;
    toggleRead: (thread: ChatThread) => Promise<ChatThread>;
}


export const chatClient = (projectId: string): ChatClient => {
    const url = HOST + "/chat?projectId=" + projectId;
    const connection = signalRConnection(url);

    const respond = (request: ChatMessageRequest) => {
        console.log("respond", url + '\n', request)
        return connection.invoke("respond", request)
            .catch((error) => console.error(error));
    };

    const setRead = (threadId: string, read: boolean) => {
        console.log("setRead", url + '\n', threadId, read)
        return connection.invoke("setRead", threadId, read)
            .catch((error) => console.error(error));
    };

    const setName = (threadId: string, name: string) => {
        console.log("setRead", url + '\n', threadId, name)
        return connection.invoke("setName", threadId, name)
            .catch((error) => console.error(error));
    };


    return {
        connection,
        respond,
        setRead,
        setName,
        sendMessage: (thread, text) => respond({
            threadId: thread.id,
            projectId: thread.projectId,
            content: text,
            author: {
                id: 'b', // TODO FIX
                name: 'b-name',
            }
        }),
        toggleRead: (thread) => setRead(thread.id, !thread.read),
    }
}

export default chatClient;