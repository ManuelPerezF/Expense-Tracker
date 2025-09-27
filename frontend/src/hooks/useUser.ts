'use client';

import { useState, useEffect } from 'react';
import { User } from '../types/types';
import { createUser, loginUser } from '../services/userService';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Cargar usuario desde localStorage al iniciar
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (err) {
                console.error('Error parsing saved user:', err);
                localStorage.removeItem('currentUser');
            }
        }
    }, []);

    async function createNewUser(newUser: Omit<User, 'id'>) {
        setLoading(true);
        setError(null);
        try {
            const createdUser = await createUser(newUser);
            setUser(createdUser);
            localStorage.setItem('currentUser', JSON.stringify(createdUser));
            return createdUser;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear el usuario';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function login(credentials: { username: string; password: string }) {
        setLoading(true);
        setError(null);
        try {
            const loggedUser = await loginUser(credentials.username, credentials.password);
            setUser(loggedUser);
            localStorage.setItem('currentUser', JSON.stringify(loggedUser));
            return loggedUser;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        setUser(null);
        localStorage.removeItem('currentUser');
    }

    function clearError() {
        setError(null);
    }

    return { 
        user, 
        error, 
        loading, 
        createNewUser, 
        login, 
        logout, 
        clearError,
        isLoggedIn: !!user 
    };
}