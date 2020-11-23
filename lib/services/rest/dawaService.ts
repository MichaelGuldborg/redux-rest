import {IdListRequestFunction, ListRequestFunction} from "./crudService";
import {RequestMethod, restClient, RestClient} from "./restClient";
import Municipality, {DawaMunicipality, municipalityFromDawa} from "../../models/Municipality";
import Region, {DawaRegion, regionFromDawa} from "../../models/Region";
import {DawaPostalData, PostalData, postalDataFromDawa} from "../../models/PostalData";


export interface DawaServiceType {
    client: RestClient;
    getMunicipalities: ListRequestFunction<Required<Municipality>>;
    getRegions: ListRequestFunction<Required<Region>>;
    getPostalData: IdListRequestFunction<Required<PostalData>>;
}

export function dawaService(): DawaServiceType {
    const client = restClient("https://dawa.aws.dk", {
        cache: "force-cache",
    });
    return {
        client: client,
        async getMunicipalities() {
            const response = await client.fetchJSON<DawaMunicipality[]>(RequestMethod.GET, "/kommuner");
            const value = response.success ? response.value.map(e => municipalityFromDawa(e)) : [];
            return {
                ...response,
                value: value,
            };
        },
        async getRegions() {
            const response = await client.fetchJSON<DawaRegion[]>(RequestMethod.GET, "/regioner");
            const value = response.success ? response.value.map(e => regionFromDawa(e)) : [];
            return {
                ...response,
                value: value,
            };
        },
        async getPostalData(postalcode:string) {
            const response = await client.fetchJSON<DawaPostalData[]>(RequestMethod.GET, "/postnumre?nr=" + postalcode);
            const value = response.success ? response.value.map(e => postalDataFromDawa(e)) : [];
            return {
                ...response,
                value: value,
            };
        }
    };
}

export const dawa = dawaService();