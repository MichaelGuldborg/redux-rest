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

    return [state, {
        dispatch,
        refresh: () => dispatch(actions.refresh()),
        updateElement: (element) => dispatch(actions.updateElement(element)),
        deleteElement: (element => dispatch(actions.deleteElement(element))),
        setSelectedElement: (element) => dispatch(actions.selectElement(element)),
        cancelError: () => dispatch(actions.cancelError()),
    }];
}

export default useReduxCrudState;