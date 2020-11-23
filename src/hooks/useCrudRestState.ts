import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {CrudServiceType} from "../services";
import Identifiable from "../models/Identifyable";

interface CompareFunction<S> {
    (a: S, b: S): boolean;
}

interface CompareIdFunction {
    (a: Identifiable, b: Identifiable): boolean;
}

// interface ElementFunction<S> {
//     (element: S | undefined): void;
// }

interface AsyncElementFunction<S> {
    (element: S | undefined): Promise<void>;
}


const compareWithId = (a: Identifiable, b: Identifiable) => a.id === b.id;

export default function useCrudRestState<S extends Identifiable>(
    service: CrudServiceType<S>,
    initialState: S[] | (() => S[]) = [],
    compare: CompareFunction<S> | CompareIdFunction = compareWithId
): [S[], S | undefined, Dispatch<SetStateAction<S | undefined>>, AsyncElementFunction<S>, AsyncElementFunction<S>] {

    const [elements, setElements] = useState<S[]>(initialState);
    const [editElement, setEditElement] = useState<S | undefined>(undefined);
    const elementsLength = elements.length;

    useEffect(() => {
        if (elementsLength) return;
        service.getAll().then((response) => {
            const value = response.success ? response.value : [];
            setElements(value);
        });
    }, [elementsLength, service]);


    const updateElement = async (element: S | undefined) => {
        if (element === undefined) return;
        const elementIndex = elements.findIndex((a) => compare(a, element));
        const isCreate = elementIndex === -1;
        const response = isCreate ? await service.create(element) : await service.update(element);
        if (response.success) {
            const newElements = [...elements];
            isCreate ? newElements.unshift(element) : (newElements[elementIndex] = element);
            setElements(newElements);
            setEditElement(undefined);
        }
    };

    const deleteElement = async (element: S | undefined) => {
        if (element === undefined) return;
        const response = await service.delete(element);
        if (response.success) {
            const newElements = [...elements];
            const elementIndex = elements.findIndex((a) => compare(a, element));
            newElements.splice(elementIndex, 1);
            setElements(newElements);
            setEditElement(undefined);
        }
    };


    return [elements, editElement, setEditElement, updateElement, deleteElement];
}
