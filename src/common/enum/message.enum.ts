import { HttpStatus } from "@nestjs/common";

export interface IHttpError {
    message: string,
    code: number,
    error?: string
}

export enum HttpErrorMessage {
    ALREADY_USER = "User Input Data already exists",
    INVALID_USER = "Please check your username/password",
    BAD_REQUEST = "User Input Data is invalid"
}

export enum HttpError {
    CONFLICT = 'Conflict',
    UNAUTHORIZED = 'Invalid credentials',
    BAD_REQUEST = 'Bad Request'
}

export class HttpMessages {
    static Failed_message(message: string, code: number = HttpStatus.BAD_REQUEST, error: string = ''): IHttpError {
        return {
            message: message,
            code: code,
            error: error
        };
    }

    static Failed_AlreadyUser: IHttpError = {
        message: HttpErrorMessage.ALREADY_USER,
        code: HttpStatus.CONFLICT,
        error: HttpError.CONFLICT
    };

    static Failed_CreateUser: IHttpError = {
        message: HttpErrorMessage.BAD_REQUEST,
        code: HttpStatus.BAD_REQUEST,
        error: HttpError.BAD_REQUEST
    };

    static Failed_UserPassword: IHttpError = {
        message: HttpErrorMessage.INVALID_USER,
        code: HttpStatus.UNAUTHORIZED,
        error: HttpError.UNAUTHORIZED
    };

    static Failed_Token: IHttpError = {
        message: HttpErrorMessage.INVALID_USER,
        code: HttpStatus.UNAUTHORIZED,
        error: HttpError.UNAUTHORIZED
    };
}