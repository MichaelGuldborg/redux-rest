import {DefaultRootState} from "react-redux";


export interface AppThunkAction<TAction, TState = DefaultRootState> {
    (dispatch: (action: TAction) => void, getState: () => TState): void;
}
