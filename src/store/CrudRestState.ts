import {Reducer} from 'redux';
import {AppThunkAction} from './index';
import {CrudServiceType} from '../services/rest/crudService';
import Identifiable from '../models/Identifyable';
import RequestFeedback from "../models/ResponseFeedback";

// -----------------
// STATE - This defines the variant of data maintained in the Redux store.

export interface CrudRestState<S> {
    elements: S[];
    selectedElement?: S;
    loading: boolean;
    feedback?: RequestFeedback;
    error?: string;
}

export const initialRequestState = <S>(initialState: S[] = []): CrudRestState<S> => {
    return {
        elements: initialState,
        selectedElement: undefined,
        loading: false,
        feedback: undefined,
        error: '',
    };
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for variant detection that works even after serialization/deserialization.

export interface CrudActionTypes {
    readonly LOADING: 'REQUEST_LOADING';
    readonly ERROR: 'REQUEST_ERROR';
    readonly REFRESH: 'REQUEST_REFRESH';
    readonly SELECT: 'REQUEST_EDIT';
    readonly UPDATE: 'REQUEST_UPDATE';
    readonly SORT: 'REQUEST_SORT';
    readonly DELETE: 'REQUEST_DELETE';
    readonly CLEAR: 'REQUEST_CLEAR';
}

export const crudActionNames: CrudActionTypes = {
    DELETE: 'REQUEST_DELETE',
    SELECT: 'REQUEST_EDIT',
    ERROR: 'REQUEST_ERROR',
    LOADING: 'REQUEST_LOADING',
    REFRESH: 'REQUEST_REFRESH',
    SORT: 'REQUEST_SORT',
    UPDATE: 'REQUEST_UPDATE',
    CLEAR: 'REQUEST_CLEAR',
};

export interface CrudRefreshAction<S> {
    name: string;
    type: 'REQUEST_REFRESH';
    elements: S[];
}

export interface CrudLoadingAction {
    name: string;
    type: 'REQUEST_LOADING';
}

export interface CrudErrorAction {
    name: string;
    type: 'REQUEST_ERROR';
    feedback?: RequestFeedback;
}

export interface CrudEditAction<S> {
    name: string;
    type: 'REQUEST_EDIT';
    element: S | undefined;
}

export interface CrudUpdateAction<S> {
    name: string;
    type: 'REQUEST_UPDATE';
    element: S;
}

export interface CrudDeleteAction<S> {
    name: string;
    type: 'REQUEST_DELETE';
    element: S;
}

export interface CrudClearAction {
    name: string;
    type: 'REQUEST_CLEAR';
}

// Declare a 'discriminated union' variant. This guarantees that all references to 'variant' properties contain one of the
// declared variant strings (and not any other arbitrary string).

export type KnownCrudRestAction<S> =
    | CrudLoadingAction
    | CrudErrorAction
    | CrudRefreshAction<S>
    | CrudEditAction<S>
    | CrudUpdateAction<S>
    | CrudDeleteAction<S>
    | CrudClearAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export interface CrudRestActionType<T> {
    refresh(): AppThunkAction<KnownCrudRestAction<T>>;

    selectElement(element: T | undefined): AppThunkAction<KnownCrudRestAction<T>>;

    updateElement(element: T | undefined): AppThunkAction<KnownCrudRestAction<T>>;

    deleteElement(element: T | undefined): AppThunkAction<KnownCrudRestAction<T>>;

    cancelError(): AppThunkAction<KnownCrudRestAction<T>>;
}


export const crudRestActions = <T extends Partial<Identifiable>>(stateName: string, service: CrudServiceType<T>): CrudRestActionType<T> => {
    return {
        refresh: (): AppThunkAction<KnownCrudRestAction<T>> => {
            return async (dispatch) => {
                dispatch({name: stateName, type: crudActionNames.LOADING});
                const response = await service.getAll();
                if (response.success) {
                    dispatch({name: stateName, type: crudActionNames.REFRESH, elements: response.value});
                } else {
                    dispatch({name: stateName, type: crudActionNames.ERROR, feedback: response.feedback})
                }
            };
        },

        selectElement: (element: T | undefined): AppThunkAction<KnownCrudRestAction<T>> => {
            return async (dispatch) => {
                dispatch({name: stateName, type: crudActionNames.SELECT, element: element});
            };
        },

        updateElement: (element) => {
            return async (dispatch) => {
                if (element === undefined) return;
                dispatch({name: stateName, type: crudActionNames.LOADING});

                const response = element?.id ? await service.update(element) : await service.create(element);
                if (response.success) {
                    dispatch({name: stateName, type: crudActionNames.UPDATE, element: response.value});
                }
                dispatch({name: stateName, type: crudActionNames.ERROR, feedback: response.feedback});
            };
        },

        deleteElement: (element: T): AppThunkAction<KnownCrudRestAction<T>> => {
            return async (dispatch) => {
                dispatch({name: stateName, type: crudActionNames.LOADING});
                const response = await service.delete(element);
                if (response.success) {
                    dispatch({name: stateName, type: crudActionNames.DELETE, element: element});
                }
                dispatch({name: stateName, type: crudActionNames.ERROR, feedback: response.feedback});
            };
        },

        cancelError(): AppThunkAction<KnownCrudRestAction<T>> {
            return (dispatch) => {
                dispatch({name: stateName, type: crudActionNames.ERROR, feedback: undefined})
            }
        }
    };
};


export interface NamedAction {
    name: string;
    type: string;
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
// THIS IS THE ONE
//https://redux.js.org/recipes/structuring-reducers/reusing-reducer-logic/

export function crudReducer<T extends Identifiable, S extends CrudRestState<T> = CrudRestState<T>>(stateName: string, initialState: S, reducer?: (state: S, incomingAction: NamedAction) => S): Reducer<S, NamedAction> {
    return (state: S | undefined, incomingAction: NamedAction): S => {
        if (state === undefined) {
            return {...initialState};
        }
        if (incomingAction.type === crudActionNames.CLEAR) {
            return {...initialState};
        }
        if (incomingAction.name !== stateName) {
            return state;
        }

        const action = incomingAction as KnownCrudRestAction<T>;
        switch (action.type) {
            case crudActionNames.LOADING:
                return {
                    ...state,
                    loading: true,
                    error: undefined,
                };
            case crudActionNames.ERROR:
                return {
                    ...state,
                    loading: false,
                    feedback: action.feedback,
                    error: action.feedback?.severity === 'success' ? action.feedback.message : undefined,
                };
            case crudActionNames.REFRESH:
                return {
                    ...state,
                    elements: action.elements,
                    selectedElement: undefined,
                    loading: false,
                    error: undefined,
                    feedback: undefined,
                };
            case crudActionNames.SELECT:
                return {
                    ...state,
                    selectedElement: action.element,
                    loading: false,
                    error: undefined,
                    feedback: undefined,
                };
            case crudActionNames.UPDATE: {
                const elementIndex = state.elements.findIndex((e) => e.id === action.element.id);
                elementIndex === -1 ? state.elements.unshift(action.element) : (state.elements[elementIndex] = action.element);
                const selectedElement = action.element.id === state.selectedElement?.id ? action.element : state.selectedElement;
                return {
                    ...state,
                    elements: state.elements,
                    selectedElement: selectedElement,
                    loading: false,
                    error: undefined,
                    feedback: undefined,
                };
            }
            case crudActionNames.DELETE: {
                const elements = state.elements.filter((e) => e.id !== action.element.id);
                return {
                    ...state,
                    elements: elements,
                    selectedElement: undefined,
                    loading: false,
                    error: undefined,
                    feedback: undefined,
                };
            }
            default: {
                if (reducer && typeof reducer === "function") {
                    return reducer(state, action);
                }
                return state;
            }
        }
    };
}
