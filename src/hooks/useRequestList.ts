import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import RestResponse from "../models/RestResponse";


export const useRequestList = <T>(fetch: () => RestResponse<Required<T>[]>): T[] => {
    const [valueList] = useRequestListState<T>(fetch);
    return valueList
}


export const useRequestListState = <T>(fetch: () => RestResponse<Required<T>[]>): [T[], Dispatch<SetStateAction<T[] | undefined>>] => {
    const [value, setValue] = useRequestState<T[]>(fetch);
    const list: T[] = value ?? [];
    return [list, setValue];
};

export const useRequestState = <T>(fetch: () => RestResponse<T>): [T | undefined, Dispatch<SetStateAction<T | undefined>>] => {
    const [value, setValue] = useState<T | undefined>(undefined);

    useEffect(() => {
        if (value) return;
        fetch().then(response => {
            if (response.success) {
                setValue(response.value);
            }
        })
    }, [fetch, value]);

    return [value, setValue];
};


export default useRequestList;