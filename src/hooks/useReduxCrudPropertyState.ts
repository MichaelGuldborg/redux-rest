import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import Identifiable from "../models/Identifyable";
import {CrudState} from "../store/CrudState";
import {CrudRestPropertyActionType} from "../store/CrudRestPropertyActions";
import {Dispatch} from "redux";


export type ReduxCrudStateFunctions<T> = {
    setSelectedElement: (element?: T) => void;
    updateElement: (element: T) => void;
};
export type ReduxCrudState<T> = [CrudState<T>, Dispatch<any>, ReduxCrudStateFunctions<T>];

export const useReduxCrudPropertyState = <TState, T extends Partial<Identifiable>>(selector: (state: TState) => CrudState<T>, actions: CrudRestPropertyActionType<T>, parentId: string): ReduxCrudState<T> => {
    const dispatch = useDispatch();
    const state = useSelector(selector);
    const elementsLength = state.elements?.length;

    useEffect(() => {
        if (elementsLength) return;
        dispatch(actions.refresh(parentId));
    }, [actions, parentId, dispatch, elementsLength])


    return [state, dispatch, {
        setSelectedElement: (element?: T) => dispatch(actions.selectElement(element)),
        updateElement: (element: T) => dispatch(actions.updateElement(parentId, element)),
    }];
}

export default useReduxCrudPropertyState;
