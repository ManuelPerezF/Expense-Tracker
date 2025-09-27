import { Movement, CreateMovementRequest } from '../types/types';

const BASE_URL = 'http://localhost:4000/api';

export async function createMovement(movement: Omit<CreateMovementRequest, 'user_id'>, userId: number): Promise<Movement> {
    try {
        const response = await fetch(`${BASE_URL}/movements`, { // Cambiado a /movements
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...movement, user_id: userId }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: No se pudo crear el movimiento`);
        }

        return response.json();
    } catch (error) {
        console.error('Error al crear movimiento:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('No se puede conectar al servidor. Comprueba tu conexión.');
        }
        throw error;
    }
}

export async function deleteMovement(id: number): Promise<void> {
    try {
        const response = await fetch(`${BASE_URL}/movements/${id}`, { // Cambiado a /movements
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: No se pudo eliminar el movimiento`);
        }
    } catch (error) {
        console.error('Error al eliminar movimiento:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('No se puede conectar al servidor. Comprueba tu conexión.');
        }
        throw error;
    }
}

export async function getMovementsByUserId(userId: number): Promise<Movement[]> {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}/movements`, { // Cambiado a /movements
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: No se pudieron obtener los movimientos`);
        }

        return response.json();
    } catch (error) {
        console.error('Error al obtener movimientos:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('No se puede conectar al servidor. Comprueba tu conexión.');
        }
        throw error;
    }
}

export async function getFinancialSummary(userId: number): Promise<{ totalIncome: number; totalExpenses: number; balance: number }> {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}/summary`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: No se pudo obtener el resumen financiero`);
        }

        return response.json();
    } catch (error) {
        console.error('Error al obtener resumen financiero:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('No se puede conectar al servidor. Comprueba tu conexión.');
        }
        throw error;
    }
}

// Helper functions para obtener datos específicos del resumen
export async function getBalance(userId: number): Promise<number> {
    try {
        const summary = await getFinancialSummary(userId);
        return summary.balance;
    } catch (error) {
        console.error('Error al obtener balance:', error);
        throw error;
    }
}

export async function getTotalIncome(userId: number): Promise<number> {
    try {
        const summary = await getFinancialSummary(userId);
        return summary.totalIncome;
    } catch (error) {
        console.error('Error al obtener ingresos totales:', error);
        throw error;
    }
}

export async function getTotalExpenses(userId: number): Promise<number> {
    try {
        const summary = await getFinancialSummary(userId);
        return summary.totalExpenses;
    } catch (error) {
        console.error('Error al obtener gastos totales:', error);
        throw error;
    }
}