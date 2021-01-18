import {AppThunkAction} from './index';
import {crudActionTypes, KnownCrudAction} from "./CrudState";
import Identifiable from "../models/Identifyable";
import {CrudPropertyServiceType} from "../services/rest/crudPropertyService";


export interface CrudRestPropertyActionType<T> {
    refresh(id?: string): AppThunkAction<KnownCrudAction<T>>;

    selectElement(element: T | undefined): AppThunkAction<KnownCrudAction<T>>;

    updateElement(id?: string, element?: T): AppThunkAction<KnownCrudAction<T>>;

    deleteElement(id?: string, element?: T | undefined): AppThunkAction<KnownCrudAction<T>>;

    cancelError(): AppThunkAction<KnownCrudAction<T>>;
}


export const crudRestPropertyActions = <T extends Partial<Identifiable>>(stateName: string, service: CrudPropertyServiceType<T>): CrudRestPropertyActionType<T> => {
    return {
        refresh: (id): AppThunkAction<KnownCrudAction<T>> => {
            return async (dispatch) => {
                dispatch({name: stateName, type: crudActionTypes.LOADING});
                const response = await service.getAll(id);
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

        updateElement: (id, element) => {
            return async (dispatch) => {
                if (element === undefined) return;
                dispatch({name: stateName, type: crudActionTypes.LOADING});

                const response = element?.id ? await service.update(id, element) : await service.create(id, element);
                if (response.success) {
                    dispatch({name: stateName, type: crudActionTypes.UPDATE, element: response.value});
                } else {
                    dispatch({name: stateName, type: crudActionTypes.ERROR, feedback: response.feedback});
                }
            };
        },


        deleteElement: (id, element: T): AppThunkAction<KnownCrudAction<T>> => {
            return async (dispatch) => {
                dispatch({name: stateName, type: crudActionTypes.LOADING});
                const response = await service.delete(id, element);
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
