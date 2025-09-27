import { Category, CreateCategoryRequest } from '../types/types';

const BASE_URL = 'http://localhost:4000/api';

export async function createCategory(category: Omit<CreateCategoryRequest, 'user_id'>, userId: number): Promise<Category> {
    try {
        const response = await fetch(`${BASE_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...category, user_id: userId }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: No se pudo crear la categoría`);
        }

        const result = await response.json();
        return result.category || result;
    } catch (error) {
        console.error('Error al crear categoría:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('No se puede conectar al servidor. Comprueba tu conexión.');
        }
        throw error;
    }
}

export async function getCategoriesByUserId(userId: number): Promise<Category[]> {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: No se pudieron obtener las categorías`);
        }

        return response.json();
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('No se puede conectar al servidor. Comprueba tu conexión.');
        }
        throw error;
    }
}

export async function getCategoriesByUserIdAndType(userId: number, type: 'income' | 'expense'): Promise<Category[]> {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}/categories/type?type=${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: No se pudieron obtener las categorías`);
        }

        return response.json();
    } catch (error) {
        console.error('Error al obtener categorías por tipo:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('No se puede conectar al servidor. Comprueba tu conexión.');
        }
        throw error;
    }
}

export async function getCategoryById(id: number): Promise<Category> {
    try {
        const response = await fetch(`${BASE_URL}/categories/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: No se pudo obtener la categoría`);
        }

        return response.json();
    } catch (error) {
        console.error('Error al obtener categoría:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('No se puede conectar al servidor. Comprueba tu conexión.');
        }
        throw error;
    }
}

export async function updateCategory(id: number, category: Partial<Category>): Promise<Category> {
    try {
        const response = await fetch(`${BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: No se pudo actualizar la categoría`);
        }

        const result = await response.json();
        return result.category || result;
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('No se puede conectar al servidor. Comprueba tu conexión.');
        }
        throw error;
    }
}

export async function deleteCategory(id: number): Promise<void> {
    try {
        const response = await fetch(`${BASE_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: No se pudo eliminar la categoría`);
        }
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('No se puede conectar al servidor. Comprueba tu conexión.');
        }
        throw error;
    }
}