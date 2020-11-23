import {
    initialRequestState,
    KnownCrudRestAction,
    NamedAction,
    crudActionNames,
    CrudActionTypes,
    crudReducer,
    CrudRestState
} from "./CrudRestState";
import Identifiable from "../models/Identifyable";
import {Reducer} from "redux";
import {AppThunkAction} from "./index";
import {SocketClient} from "../services/websocket/socketClient";

export interface SocketState<S, C extends SocketClient = SocketClient> extends CrudRestState<S> {
    client?: C,
    connected: Boolean,
}

export const initialSocketState = <S, C extends SocketClient = SocketClient>(initialState: Required<S>[] = []): SocketState<S, C> => {
    return {
        ...initialRequestState<Required<S>>(initialState),
        client: undefined,
        connected: false,
    }
};

export interface SocketActionTypes extends CrudActionTypes {
    readonly CONNECT: "SOCKET_CONNECT";
    readonly DISCONNECT: 'SOCKET_DISCONNECT';
}

export const socketActionNames: SocketActionTypes = {
    ...crudActionNames,
    CONNECT: 'SOCKET_CONNECT',
    DISCONNECT: 'SOCKET_DISCONNECT',
};

export interface SocketConnectAction {
    name: string;
    type: 'SOCKET_CONNECT';
    client: SocketClient;
}

export interface SocketDisconnectAction {
    name: string;
    type: 'SOCKET_DISCONNECT';
}

export type KnownSocketAction<S> =
    KnownCrudRestAction<S>
    | SocketConnectAction
    | SocketDisconnectAction


export interface SocketActionType<T> {
    connect(param?: string): AppThunkAction<T>;

    disconnect(): AppThunkAction<T>
}

export function socketReducer<T extends Identifiable, S extends SocketState<T> = SocketState<T>>(stateName: string, initialState: S, reducer?: (state: S, incomingAction: NamedAction) => S): Reducer<S, NamedAction> {
    return crudReducer<T, S>(stateName, initialState, (state, incomingAction): S => {
        const action = incomingAction as KnownSocketAction<T>;
        switch (action.type) {
            case socketActionNames.CONNECT: {
                return {
                    ...state,
                    client: action.client,
                    connected: true,
                    loading: false,
                };
            }
            case socketActionNames.DISCONNECT:
                return {
                    ...state,
                    connected: false
                };
            case socketActionNames.REFRESH:
                return {
                    ...state,
                    elements: state.elements,
                    selectedElement: undefined,
                    loading: false,
                    error: undefined,
                    feedback: undefined,
                };
            case socketActionNames.UPDATE:
                return {
                    ...state,
                    elements: state.elements,
                    selectedElement: undefined,
                    loading: false,
                    error: undefined,
                    feedback: undefined,
                };
            default: {
                if (reducer && typeof reducer === "function") {
                    return reducer(state, action);
                }
                return state;
            }
        }
    });
}