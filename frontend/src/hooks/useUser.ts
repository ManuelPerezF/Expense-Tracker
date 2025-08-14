'use client'

import { useState, useEffect } from 'react';
import { User } from '../types/types';
import { createUser } from '../services/userService';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function createNewUser(newUser: Omit<User, 'id'>) {
        setLoading(true);
        setError(null);
        try {
            const createdUser = await createUser(newUser);
            setUser(createdUser);
            return createdUser;
        } catch (err) {
            setError('Error al crear el usuario');
            throw err;
        } finally {
            setLoading(false);
        }
    }

    function clearError() {
        setError(null);
    }

    return { user, error, loading, createNewUser, clearError };
}