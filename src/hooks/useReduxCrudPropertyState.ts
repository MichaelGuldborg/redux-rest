import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import Identifiable from "../models/Identifyable";
import {CrudState} from "../store/CrudState";
import {CrudRestPropertyActionType} from "../store/CrudRestPropertyActions";
import {Dispatch} from "redux";

export type ReduxCrudStateFunctions<T> = {
    dispatch: Dispatch<any>;
    refresh: () => void;
    updateElement: (element: T) => void;
    deleteElement: (element: T) => void;
    setSelectedElement: (element?: T) => void;
    cancelError: () => void;
};
export type ReduxCrudState<T> = [CrudState<T>, ReduxCrudStateFunctions<T>];

export const useReduxCrudPropertyState = <TState, T extends Partial<Identifiable>>(selector: (state: TState) => CrudState<T>, actions: CrudRestPropertyActionType<T>, parentId: string): ReduxCrudState<T> => {
    const dispatch = useDispatch();
    const state = useSelector(selector);
    const elementsLength = state.elements?.length;

    useEffect(() => {
        if (elementsLength) return;
        dispatch(actions.refresh(parentId));
    }, [actions, parentId, dispatch, elementsLength])


    return [state, {
        dispatch,
        refresh: () => dispatch(actions.refresh(parentId)),
        updateElement: (element) => dispatch(actions.updateElement(parentId, element)),
        deleteElement: (element => dispatch(actions.deleteElement(parentId, element))),
        setSelectedElement: (element) => dispatch(actions.selectElement(element)),
        cancelError: () => dispatch(actions.cancelError()),
    }];
}

export default useReduxCrudPropertyState;
