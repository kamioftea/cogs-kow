import {ErrorResponse} from "./error-response";

export interface HttpStatusError extends ErrorResponse {
    status: number
}

export function isHttpStatusError(error: any): error is HttpStatusError {
    return typeof error?.status === 'number' && typeof error?.error === 'string';
}

export const Unauthenticated = (error: string): HttpStatusError => ({
    status: 401,
    error,
});

export const Forbidden = (error: string): HttpStatusError => ({
    status: 403,
    error,
});
