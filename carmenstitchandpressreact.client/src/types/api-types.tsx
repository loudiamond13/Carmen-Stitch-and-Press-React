
export interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}; 

export interface LoginResponse {
    email: string;
    rememberMe:boolean;
}

export interface VerificationRequest {
    email: string;
    code: string;
    rememberMe: boolean;
}

export interface User {
    firstName: string;
    roles: string[];
    id:string;
}

