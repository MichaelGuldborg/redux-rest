import Identifiable from "../models/Identifyable";

export const toIdList = (valueList?: Partial<Identifiable>[]): string[] => {
    return valueList?.map(val => val.id)?.filter((id: string | undefined): id is string => id !== undefined) ?? [];
};

export default toIdList;