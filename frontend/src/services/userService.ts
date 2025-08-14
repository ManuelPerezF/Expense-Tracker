import { User } from '../types/types';

const USER_URL = 'https://localhost:5000/api/users'

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await fetch(USER_URL, {
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