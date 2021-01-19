import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import Identifiable from "../models/Identifyable";
import {CrudState} from "../store/CrudState";
import {CrudRestActionType} from "../store/CrudRestActions";
import {ReduxCrudState} from "./useReduxCrudPropertyState";


export const useReduxCrudState = <TState, T extends Partial<Identifiable>>(selector: (state: TState) => CrudState<T>, actions: CrudRestActionType<T>): ReduxCrudState<T> => {
    const dispatch = useDispatch();
    const state: CrudState<T> = useSelector(selector);
    const elementsLength = state.elements?.length;

    useEffect(() => {
        if (elementsLength) return;
        dispatch(actions.refresh());
    }, [actions, dispatch, elementsLength])

    return [state, dispatch, {
        setSelectedElement: (element?: T) => dispatch(actions.selectElement(element)),
        updateElement: (element: T) => dispatch(actions.updateElement(element)),
    }];
}

export default useReduxCrudState;