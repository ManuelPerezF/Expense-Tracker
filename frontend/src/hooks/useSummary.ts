'use client';

import { useState, useEffect } from 'react';
import { FinancialSummary } from '../types/types';
import { getFinancialSummary } from '../services/movementService';

interface ExtendedSummary extends FinancialSummary {
  biggestExpense: number;
}

export function useSummary() {
  const [summary, setSummary] = useState<ExtendedSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    totalMovements: 0,
    biggestExpense: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSummary = async () => {
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

      const summaryData = await getFinancialSummary(currentUser.id);
      
      // Calcular el mayor gasto (puedes implementar esto en el backend más tarde)
      const biggestExpense = summaryData.totalExpenses; // Simplificado por ahora
      
      setSummary({
        totalIncome: summaryData.totalIncome,
        totalExpenses: summaryData.totalExpenses,
        balance: summaryData.balance,
        totalMovements: 0, // Puedes implementar esto más tarde
        biggestExpense
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener el resumen';
      setError(errorMessage);
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Solo fetch si estamos en el cliente y hay un usuario
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser && currentUser !== '{}') {
        refreshSummary();
      } else {
        setLoading(false); // No hay usuario, no cargamos datos
      }
    }
  }, []);

  return {
    summary,
    loading,
    error,
    refreshSummary
  };
}