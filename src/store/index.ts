import {DefaultRootState} from "react-redux";

export * from './CrudRestState'
export * from './CrudValueRestActions'
export * from './SocketState'

export interface AppThunkAction<TAction, TState = DefaultRootState> {
    (dispatch: (action: TAction) => void, getState: () => TState): void;
}
