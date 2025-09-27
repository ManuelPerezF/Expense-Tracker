"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMovements } from '@/hooks/useMovements';
import { useCategories } from '@/hooks/useCategories';
import { useSummary } from '@/hooks/useSummary';
import { parseAmountInput, isValidAmount, formatCurrency } from '@/utils/formatters';
import { ArrowLeft, Save, X } from 'lucide-react';
import Link from 'next/link';

export default function NewMovementPage() {
  const router = useRouter();
  const { createMovement } = useMovements();
  const { getCategoriesByType } = useCategories();
  const { refreshSummary } = useSummary();

  const [formData, setFormData] = useState({
    amount: '',
    type: 'gasto' as 'gasto' | 'entrada',
    category_id: 0, // Inicializar en 0 para forzar selección
    date: new Date().toISOString().split('T')[0] // Fecha actual en formato YYYY-MM-DD
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener categorías filtradas por tipo
  const filteredCategories = getCategoriesByType(
    formData.type === 'entrada' ? 'income' : 'expense'
  );

  // Actualizar category_id cuando cambie el tipo si no hay categoría seleccionada o si la categoría actual no pertenece al nuevo tipo
  const handleTypeChange = (newType: 'gasto' | 'entrada') => {
    const newCategoryType = newType === 'entrada' ? 'income' : 'expense';
    const newFilteredCategories = getCategoriesByType(newCategoryType);
    
    setFormData(prev => ({
      ...prev,
      type: newType,
      // Solo cambiar la categoría si no existe una seleccionada o si la actual no es del tipo correcto
      category_id: prev.category_id === 0 || !newFilteredCategories.find(cat => cat.id === prev.category_id)
        ? newFilteredCategories[0]?.id || 0
        : prev.category_id
    }));
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.amount || !isValidAmount(formData.amount)) {
      setError('Por favor ingresa un monto válido mayor a 0');
      return;
    }

    if (formData.category_id === 0) {
      setError('Por favor selecciona una categoría');
      return;
    }

    if (!formData.date) {
      setError('Por favor ingresa una fecha');
      return;
    }

    setLoading(true);

    try {
      await createMovement({
        amount: parseAmountInput(formData.amount),
        type: formData.type,
        category_id: formData.category_id,
        date: formData.date
      });

      // Actualizar el resumen después de crear el movimiento
      await refreshSummary();

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el movimiento');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrencyPreview = (amount: string) => {
    const numAmount = parseAmountInput(amount);
    if (numAmount === 0) return '';
    return formatCurrency(numAmount);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/dashboard" 
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Nuevo Movimiento
            </h1>
            <p className="text-slate-400">
              Registra un nuevo ingreso o gasto
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Tipo de movimiento
              </label>
              <div className="flex bg-slate-700 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => handleTypeChange('gasto')}
                  className={`flex-1 py-2 px-4 text-center rounded-md font-medium transition-colors ${
                    formData.type === 'gasto'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  Gasto
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('entrada')}
                  className={`flex-1 py-2 px-4 text-center rounded-md font-medium transition-colors ${
                    formData.type === 'entrada'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  Ingreso
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">
                Monto {formData.amount && `(${formatCurrencyPreview(formData.amount)})`}
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="5000"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
                pattern="[0-9]*"
              />
              <p className="text-xs text-slate-400 mt-1">
                Ingresa solo números enteros (ejemplo: 5000)
              </p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-slate-300 mb-2">
                Categoría
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
                <option value={0}>Selecciona una categoría</option>
                {filteredCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.emoji} {category.name}
                  </option>
                ))}
              </select>
              {filteredCategories.length === 0 && (
                <p className="text-xs text-yellow-400 mt-1">
                  No hay categorías disponibles para {formData.type === 'entrada' ? 'ingresos' : 'gastos'}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-2">
                Fecha
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              <Link
                href="/dashboard"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </Link>
              
              <button
                type="submit"
                disabled={loading || !formData.amount || formData.category_id === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}