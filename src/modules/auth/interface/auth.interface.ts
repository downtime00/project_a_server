export interface IAccessPayload {
    instance_id: string;
    username: string;
    role: number;
}

export interface IRefreshPayload {
    instance_id: string;
    useragent: string;
}

export interface ICSRFPayload {
    useragent: string;
}


export interface ISignUp {
    username: string;
    password: string;
    email: string;
}

export interface ISignIn {
    email: string;
    password: string;
}

export interface IReturnSignIn {
    instance_id: string;
    username: string;
    password: string;
}

export interface IReturnCreateUser {
    token: string;
}

export interface IReturnFindOneRefresh {
    instance_id: string;
    username: string;
}