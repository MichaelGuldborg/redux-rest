import AppResponse, {responseFromError} from "../../models/AppResponse";
import Authorization, {emptyAuthorization} from "../../models/Authorization";
import {loadRemember} from "../localStorage";

const AUTHORIZATION_KEY = 'AUTHORIZATION_KEY';
const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY';

export enum RequestMethod {
    'GET',
    'POST',
    'PUT',
    'DELETE',
}


export interface RestClient {
    host: string;
    fetch: <T>(method: RequestMethod, path: string, body?: BodyInit, headers?: { [p: string]: string }) => AppResponse<T>;
// TODO: FIND TYPE NOT any!
    fetchJSON: <T>(method: RequestMethod, path: string, body?: { [p: string]: string | unknown } | any, headers?: { [p: string]: string }) => AppResponse<T>;
    fetchForm: <T>(method: RequestMethod, path: string, body?: FormData, headers?: { [p: string]: string }) => AppResponse<T>;

    getAuthorization: () => Authorization;
    setAuthorization: (authorization: Authorization) => void;
    getAccessToken: () => string | undefined;
    setAccessToken: (accessToken: string) => void;
    refreshAuthorization: (refreshToken: string | undefined) => AppResponse<Required<Authorization>>;
}

export function restClient(host: string, options?: { cache: RequestCache }): RestClient {
    const authorizationKey = [host, AUTHORIZATION_KEY].join('.');
    const accessTokenKey = [host, ACCESS_TOKEN_KEY].join('.');
    return {
        host,
        getAuthorization() {
            const serializedState = localStorage.getItem(authorizationKey) ?? sessionStorage.getItem(authorizationKey);
            return serializedState === null ? emptyAuthorization : JSON.parse(serializedState);
        },
        setAuthorization(authorization: Authorization) {
            const serializedState = JSON.stringify(authorization);
            const storage = loadRemember() ? localStorage : sessionStorage;
            storage.setItem(authorizationKey, serializedState)
            storage.setItem(accessTokenKey, authorization?.accessToken)
        },
        getAccessToken() {
            return localStorage.getItem(accessTokenKey) ?? sessionStorage.getItem(accessTokenKey) ?? undefined;
        },
        setAccessToken(accessToken: string) {
            const storage = loadRemember() ? localStorage : sessionStorage;
            storage.setItem(accessTokenKey, accessToken)
        },
        async refreshAuthorization(refreshToken) {
            if (!refreshToken?.length) return responseFromError(400)
            const response = await this.fetchJSON<Required<Authorization>>(RequestMethod.POST, '/api/v1/auth/refresh', {
                refreshToken: refreshToken,
            });
            if (response.success) {
                this.setAuthorization(response.value)
            }
            return response;
        },
        async fetchForm<T>(method: RequestMethod, path: string, body?: FormData, headers: { [p: string]: string } = {}) {
            return this.fetch(method, path, body, headers)
        },
        async fetchJSON<T>(method: RequestMethod, path: string, body?: { [p: string]: string | unknown } | any, headers: { [p: string]: string } = {}) {
            return this.fetch(method, path, JSON.stringify(body), {
                'Content-Type': 'application/json',
                ...headers,
            })
        },
        async fetch<T>(method: RequestMethod, path: string, body?: BodyInit, headers: { [p: string]: string } = {}) {
            const url = this.host + path;
            const methodName = RequestMethod[method];

            const authorization = await this.getAuthorization();
            const authorizationHeader = authorization?.tokenType + ' ' + authorization?.accessToken;
            const response: Response | undefined = await fetch(url, {
                method: methodName,
                mode: 'cors',
                cache: options?.cache ?? 'no-cache',
                credentials: 'same-origin',
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                headers: {
                    'Authorization': authorizationHeader,
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    ...headers,
                },
                body,
            }).catch((error) => {
                console.error('AppClient.fetch', error);
                return undefined;
            });
            if (response === undefined) {
                console.log(methodName, url, '\nheaders:', headers, '\nbody:', body, '\nstatus:', 408);
                return responseFromError(408);
            }

            if (response.status === 401 && !headers["No-Refresh"]) {
                const refreshResponse = await this.refreshAuthorization(authorization.refreshToken)
                if (refreshResponse.success) {
                    return this.fetch(method, path, body, {
                        ...headers,
                        "No-Refresh": 'true',
                    });
                }
            }

            const responseBody = await response.json().catch((error) => {
                console.log('ERROR parsing json body\n' +
                    'url:', url, '\nerror:', error
                );
            });

            console.log(methodName, url, '\n', headers, '\n', body, '\n', response.status, response.statusText, '\n', responseBody);

            if (!response.ok) {
                return responseFromError(response.status, responseBody);
            }

            return {
                success: true,
                status: response.status,
                statusText: response.statusText,
                feedback: {severity: 'success', message: ''},
                value: responseBody as T,
            }
        },
    }
}
