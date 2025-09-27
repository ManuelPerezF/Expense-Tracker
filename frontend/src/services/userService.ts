import { User } from '../types/types';

const USER_URL = 'http://localhost:4000/api'

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await fetch(`${USER_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error('Failed to create user');
    }

    return response.json();
}

export async function loginUser(username: string, password: string): Promise<User> {
    const response = await fetch(`${USER_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Failed to login');
    }

    return response.json();
}