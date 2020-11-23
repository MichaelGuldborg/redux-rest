import {Identifiable} from "../models";
import {useParams} from "react-router-dom";

export const useCurrentElement = <T extends Partial<Identifiable>, >(elements: T[]) => {
    const {id} = useParams();
    return elements.find(e => e.id === id);
}

export default useCurrentElement;