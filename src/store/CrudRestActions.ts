import {AppThunkAction} from './index';
import Identifiable from '../models/Identifyable';
import {CrudServiceType} from "../services/rest/crudService";
import {crudActionTypes, KnownCrudAction} from "./CrudState";


// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export interface CrudRestActionType<T> {
    refresh(): AppThunkAction<KnownCrudAction<T>>;

    selectElement(element: T | undefined): AppThunkAction<KnownCrudAction<T>>;

    updateElement(element: T | undefined): AppThunkAction<KnownCrudAction<T>>;

    deleteElement(element: T | undefined): AppThunkAction<KnownCrudAction<T>>;

    cancelError(): AppThunkAction<KnownCrudAction<T>>;
}


export const crudRestActions = <T extends Partial<Identifiable>>(stateName: string, service: CrudServiceType<T>): CrudRestActionType<T> => {
    return {
        refresh: (): AppThunkAction<KnownCrudAction<T>> => {
            return async (dispatch) => {
                dispatch({name: stateName, type: crudActionTypes.LOADING});
                const response = await service.getAll();
                if (response.success) {
                    dispatch({name: stateName, type: crudActionTypes.REFRESH, elements: response.value});
                } else {
                    dispatch({name: stateName, type: crudActionTypes.ERROR, feedback: response.feedback})
                }
            };
        },

        selectElement: (element: T | undefined): AppThunkAction<KnownCrudAction<T>> => {
            return async (dispatch) => {
                dispatch({name: stateName, type: crudActionTypes.SELECT, element: element});
            };
        },

        updateElement: (element) => {
            return async (dispatch) => {
                if (element === undefined) return;
                dispatch({name: stateName, type: crudActionTypes.LOADING});
                const response = element?.id ? await service.update(element) : await service.create(element);
                if (response.success) {
                    dispatch({name: stateName, type: crudActionTypes.UPDATE, element: response.value});
                } else {
                    dispatch({name: stateName, type: crudActionTypes.ERROR, feedback: response.feedback});
                }
            };
        },

        deleteElement: (element: T): AppThunkAction<KnownCrudAction<T>> => {
            return async (dispatch) => {
                dispatch({name: stateName, type: crudActionTypes.LOADING});
                const response = await service.delete(element);
                if (response.success) {
                    dispatch({name: stateName, type: crudActionTypes.DELETE, element: element});
                } else {
                    dispatch({name: stateName, type: crudActionTypes.ERROR, feedback: response.feedback});
                }
            };
        },

        cancelError(): AppThunkAction<KnownCrudAction<T>> {
            return (dispatch) => {
                dispatch({name: stateName, type: crudActionTypes.ERROR, feedback: undefined})
            }
        }
    };
};

