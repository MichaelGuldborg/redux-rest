import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import Identifiable from "../models/Identifyable";
import {CrudState} from "../store/CrudState";
import {CrudRestPropertyActionType} from "../store/CrudRestPropertyActions";


export const useReduxCrudState = <TState, T extends Partial<Identifiable>>(selector: (state: TState) => CrudState<T>, actions: CrudRestPropertyActionType<T>, parentId: string) => {
    const dispatch = useDispatch();
    const state = useSelector(selector);
    const elementsLength = state.elements?.length;

    useEffect(() => {
        if (elementsLength) return;
        dispatch(actions.refresh(parentId));
    }, [actions, parentId, dispatch, elementsLength])

    return state;
}

export default useReduxCrudState;