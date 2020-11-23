import {AppThunkAction} from './index';
import {crudActionNames, KnownCrudRestAction} from "./CrudRestState";
import Identifiable from "../models/Identifyable";
import {CrudPropertyServiceType} from "../services/rest/crudPropertyService";


export interface CrudValueRestActionType<T> {
    refresh(id?: string): AppThunkAction<KnownCrudRestAction<T>>;

    // setEditElement(element: T | undefined): AppThunkAction<KnownCrudRestAction<T>>;

    updateElement(id?: string, element?: T): AppThunkAction<KnownCrudRestAction<T>>;

    deleteElement(id?: string, element?: T | undefined): AppThunkAction<KnownCrudRestAction<T>>;

    cancelError(): AppThunkAction<KnownCrudRestAction<T>>;
}


export const crudValueRestActions = <T extends Partial<Identifiable>>(stateName: string, service: CrudPropertyServiceType<T>): CrudValueRestActionType<T> => {
    return {
        refresh: (id): AppThunkAction<KnownCrudRestAction<T>> => {
            return async (dispatch) => {
                dispatch({name: stateName, type: crudActionNames.LOADING});
                const response = await service.getAll(id);
                if (response.success) {
                    dispatch({name: stateName, type: crudActionNames.REFRESH, elements: response.value});
                } else {
                    dispatch({name: stateName, type: crudActionNames.ERROR, feedback: response.feedback})
                }
            };
        },

        updateElement: (id, element) => {
            return async (dispatch) => {
                if (element === undefined) return;
                dispatch({name: stateName, type: crudActionNames.LOADING});

                const response = element?.id ? await service.update(id, element) : await service.create(id, element);
                if (response.success) {
                    dispatch({name: stateName, type: crudActionNames.UPDATE, element: response.value});
                } else {
                    dispatch({name: stateName, type: crudActionNames.ERROR, feedback: response.feedback});
                }
            };
        },


        deleteElement: (id, element: T): AppThunkAction<KnownCrudRestAction<T>> => {
            return async (dispatch) => {
                dispatch({name: stateName, type: crudActionNames.LOADING});
                const response = await service.delete(id, element);
                if (response.success) {
                    dispatch({name: stateName, type: crudActionNames.DELETE, element: element});
                } else {
                    dispatch({name: stateName, type: crudActionNames.ERROR, feedback: response.feedback});
                }
            };
        },

        cancelError(): AppThunkAction<KnownCrudRestAction<T>> {
            return (dispatch) => {
                dispatch({name: stateName, type: crudActionNames.ERROR, feedback: undefined})
            }
        }
    };
};
