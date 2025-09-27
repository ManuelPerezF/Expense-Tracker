'use client';

import { useState, useEffect } from 'react';
import { Category, CreateCategoryRequest } from '../types/types';
import { 
  getCategoriesByUserId, 
  getCategoriesByUserIdAndType,
  createCategory as createCategoryService, 
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService 
} from '../services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener usuario actual del localStorage solo en el cliente
      if (typeof window === 'undefined') {
        throw new Error('Usuario no encontrado');
      }
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      if (!currentUser?.id) {
        // Si no hay usuario, establecer categorías vacías pero no error
        setCategories([]);
        setLoading(false);
        return;
      }

      console.log('Fetching categories for user:', currentUser.id);
      const categoriesData = await getCategoriesByUserId(currentUser.id);
      console.log('Categories received:', categoriesData);
      setCategories(categoriesData || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener las categorías';
      setError(errorMessage);
      setCategories([]); // Asegurar que categories no sea undefined
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Omit<CreateCategoryRequest, 'user_id'>) => {
    try {
      setError(null);
      
      if (typeof window === 'undefined') {
        throw new Error('Usuario no encontrado');
      }
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      if (!currentUser?.id) {
        throw new Error('Usuario no encontrado');
      }

      const newCategory = await createCategoryService(categoryData, currentUser.id);
      
      // Agregar la nueva categoría a la lista existente
      setCategories(prev => [...prev, newCategory]);
      
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la categoría';
      setError(errorMessage);
      console.error('Error creating category:', err);
      throw err;
    }
  };

  const updateCategory = async (id: number, categoryData: Partial<Category>) => {
    try {
      setError(null);
      const updatedCategory = await updateCategoryService(id, categoryData);
      
      // Actualizar la categoría en la lista local
      setCategories(prev => 
        prev.map(cat => cat.id === id ? updatedCategory : cat)
      );
      
      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la categoría';
      setError(errorMessage);
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      setError(null);
      await deleteCategoryService(id);
      
      // Remover la categoría de la lista local
      setCategories(prev => prev.filter(cat => cat.id !== id));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la categoría';
      setError(errorMessage);
      console.error('Error deleting category:', err);
      return false;
    }
  };

  const refreshCategories = () => {
    fetchCategories();
  };

  const getCategoriesByType = (type: 'income' | 'expense'): Category[] => {
    return categories.filter(category => category.type === type);
  };

  // Función para obtener categorías por defecto limitadas
  const getDefaultCategories = (): Category[] => {
    // Verificar que estemos en el cliente antes de acceder a localStorage
    let currentUser = { id: 1 };
    if (typeof window !== 'undefined') {
      try {
        currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"id": 1}');
      } catch (error) {
        console.warn('Error parsing currentUser from localStorage:', error);
      }
    }
    
    return [
      // Categorías de Ingreso
      { id: 1, name: 'Salario', emoji: '💰', type: 'income', user_id: currentUser?.id || 1 },
      { id: 2, name: 'Inversión', emoji: '📈', type: 'income', user_id: currentUser?.id || 1 },
      // Categorías de Gasto
      { id: 3, name: 'Alimento', emoji: '🍔', type: 'expense', user_id: currentUser?.id || 1 },
      { id: 4, name: 'Transporte', emoji: '🚗', type: 'expense', user_id: currentUser?.id || 1 },
      { id: 5, name: 'Servicios Básicos', emoji: '⚡', type: 'expense', user_id: currentUser?.id || 1 },
      { id: 6, name: 'Ropa', emoji: '👗', type: 'expense', user_id: currentUser?.id || 1 },
      { id: 7, name: 'Salud', emoji: '�', type: 'expense', user_id: currentUser?.id || 1 }
    ];
  };

  useEffect(() => {
    let mounted = true;
    
    // Solo fetch si estamos en el cliente
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser && currentUser !== '{}') {
        fetchCategories().finally(() => {
          if (mounted) {
            // Asegurar que loading termine incluso si hay error
            setLoading(false);
          }
        });
      } else {
        // Si no hay usuario logueado, marcar como completado sin error
        setLoading(false);
        setCategories([]);
      }
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    getCategoriesByType,
    setError
  };
}