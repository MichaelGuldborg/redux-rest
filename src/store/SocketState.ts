import {crudActionTypes, CrudActionTypes, crudReducer, CrudState, initialCrudState, KnownCrudAction} from "./CrudState";
import Identifiable from "../models/Identifyable";
import {Reducer} from "redux";
import {AppThunkAction} from "./index";
import {SocketClient} from "../services/websocket/socketClient";
import NamedAction from "../models/NamedAction";

export interface SocketState<S, C extends SocketClient = SocketClient> extends CrudState<S> {
    client?: C,
    connected: Boolean,
}

export const initialSocketState = <S, C extends SocketClient = SocketClient>(initialState: Required<S>[] = []): SocketState<S, C> => {
    return {
        ...initialCrudState<Required<S>>(initialState),
        client: undefined,
        connected: false,
    }
};

export interface SocketActionTypes extends CrudActionTypes {
    readonly CONNECT: "SOCKET_CONNECT";
    readonly DISCONNECT: 'SOCKET_DISCONNECT';
}

export const socketActionNames: SocketActionTypes = {
    ...crudActionTypes,
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
    KnownCrudAction<S>
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