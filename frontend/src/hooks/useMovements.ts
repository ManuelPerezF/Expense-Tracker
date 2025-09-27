'use client';

import { useState, useEffect } from 'react';
import { Movement, CreateMovementRequest } from '../types/types';
import { getMovementsByUserId, deleteMovement as deleteMovementService, createMovement as createMovementService } from '../services/movementService';

export function useMovements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener usuario actual del localStorage solo en el cliente
      if (typeof window === 'undefined') {
        throw new Error('Usuario no encontrado');
      }
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      if (!currentUser?.id) {
        throw new Error('Usuario no encontrado');
      }

      const movementsData = await getMovementsByUserId(currentUser.id);
      
      // Ordenar por fecha más reciente primero
      const sortedMovements = movementsData.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setMovements(sortedMovements);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener los movimientos';
      setError(errorMessage);
      console.error('Error fetching movements:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMovement = async (id: number) => {
    try {
      await deleteMovementService(id);
      
      // Actualizar la lista local removiendo el movimiento eliminado
      setMovements(prev => prev.filter(movement => movement.id !== id));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el movimiento';
      setError(errorMessage);
      console.error('Error deleting movement:', err);
      return false;
    }
  };

  const createMovement = async (movementData: Omit<CreateMovementRequest, 'user_id'>) => {
    try {
      setError(null);
      
      if (typeof window === 'undefined') {
        throw new Error('Usuario no encontrado');
      }
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      if (!currentUser?.id) {
        throw new Error('Usuario no encontrado');
      }

      const newMovement = await createMovementService(movementData, currentUser.id);
      
      // Agregar el nuevo movimiento al inicio de la lista
      setMovements(prev => [newMovement, ...prev]);
      
      return newMovement;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el movimiento';
      setError(errorMessage);
      console.error('Error creating movement:', err);
      throw err;
    }
  };

  const addMovement = (newMovement: Movement) => {
    // Agregar al inicio de la lista para que aparezca primero
    setMovements(prev => [newMovement, ...prev]);
  };

  const refreshMovements = () => {
    fetchMovements();
  };

  useEffect(() => {
    // Solo fetch si estamos en el cliente y hay un usuario
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser && currentUser !== '{}') {
        fetchMovements();
      } else {
        setLoading(false); // No hay usuario, no cargamos datos
      }
    }
  }, []);

  return {
    movements,
    loading,
    error,
    createMovement,
    deleteMovement,
    addMovement,
    refreshMovements,
    setError
  };
}