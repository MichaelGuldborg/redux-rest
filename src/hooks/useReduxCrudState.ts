import {CrudRestState, CrudValueRestActionType} from "../store";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import Identifiable from "../models/Identifyable";


export const useReduxCrudState = <TState, T extends Partial<Identifiable>>(selector: (state: TState) => CrudRestState<T>, actions: CrudValueRestActionType<T>, parentId: string) => {
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