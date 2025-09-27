"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useMovements } from '@/hooks/useMovements';
import { useCategories } from '@/hooks/useCategories';
import { formatCurrency } from '@/utils/formatters';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Trash2,
  Edit,
  X
} from 'lucide-react';

export default function MovementsPage() {
  const { movements, loading, deleteMovement } = useMovements();
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'gasto' | 'entrada'>('all');
  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

  // Filtrar movimientos
  const filteredMovements = movements.filter(movement => {
    const matchesSearch = !searchTerm || 
      getCategoryName(movement.category_id).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || movement.type === filterType;
    
    const matchesCategory = !filterCategory || movement.category_id === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Obtener nombre de categoría por ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? `${category.emoji} ${category.name}` : 'Sin categoría';
  };

  // Manejar eliminación
  const handleDelete = async (id: number) => {
    try {
      await deleteMovement(id);
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterCategory(null);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-64 mb-4"></div>
            <div className="h-4 bg-slate-700 rounded w-96 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-slate-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-900 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Movimientos
            </h1>
            <p className="text-slate-400">
              Gestiona todos tus ingresos y gastos
            </p>
          </div>
          
          <Link
            href="/movements/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Movimiento
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'gasto' | 'entrada')}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="entrada">Ingresos</option>
              <option value="gasto">Gastos</option>
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory || ''}
              onChange={(e) => setFilterCategory(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.emoji} {category.name}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Movimientos</p>
                <p className="text-2xl font-bold text-white">{filteredMovements.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Ingresos</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(
                    filteredMovements
                      .filter(m => m.type === 'entrada')
                      .reduce((sum, m) => sum + m.amount, 0)
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Gastos</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(
                    filteredMovements
                      .filter(m => m.type === 'gasto')
                      .reduce((sum, m) => sum + m.amount, 0)
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Movements List */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700">
          {filteredMovements.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No hay movimientos
              </h3>
              <p className="text-slate-400 mb-6">
                {movements.length === 0 
                  ? "Aún no has registrado ningún movimiento"
                  : "No se encontraron movimientos con los filtros aplicados"
                }
              </p>
              <Link
                href="/movements/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Crear primer movimiento
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {filteredMovements.map((movement) => (
                <div key={movement.id} className="p-6 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        movement.type === 'entrada' 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-red-600/20 text-red-400'
                      }`}>
                        {movement.type === 'entrada' ? (
                          <TrendingUp className="w-6 h-6" />
                        ) : (
                          <TrendingDown className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div>
                        <p className="text-white font-medium">
                          {getCategoryName(movement.category_id)}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {new Date(movement.date).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${
                          movement.type === 'entrada' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {movement.type === 'entrada' ? '+' : '-'}{formatCurrency(movement.amount)}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {movement.type === 'entrada' ? 'Ingreso' : 'Gasto'}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowDeleteModal(movement.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-sm w-full">
              <h3 className="text-xl font-semibold text-white mb-2">
                Eliminar Movimiento
              </h3>
              <p className="text-slate-400 mb-6">
                ¿Estás seguro de que quieres eliminar este movimiento? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}