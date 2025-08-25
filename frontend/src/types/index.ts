// This file defines TypeScript types and interfaces used in the application.

export interface User {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
}

export interface Process {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Decision {
    id: number;
    caseId: number;
    content: string;
    date: Date;
}

export interface Crime {
    id: number;
    type: string;
    description: string;
    date: Date;
    location: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}