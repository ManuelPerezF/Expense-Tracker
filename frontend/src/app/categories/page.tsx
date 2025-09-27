"use client";

import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types/types';
import { 
  Plus, 
  Search, 
  Tag, 
  TrendingUp, 
  TrendingDown,
  Trash2,
  Edit,
  Save
} from 'lucide-react';

export default function CategoriesPage() {
  const { 
    categories, 
    loading, 
    error,
    createCategory, 
    updateCategory, 
    deleteCategory, 
    getCategoriesByType 
  } = useCategories();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Category | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    emoji: '📁',
    type: 'expense' as 'income' | 'expense'
  });

  // Categorías sugeridas (solo como referencia visual)
  const allowedCategories = {
    income: ['Salario', 'Inversión'],
    expense: ['Alimento', 'Transporte', 'Servicios Básicos', 'Ropa', 'Salud']
  };

  // Emojis disponibles para las categorías
  const availableEmojis = {
    income: ['💰', '💼', '📈', '💵', '🏦'],
    expense: ['🍔', '🚗', '⚡', '👗', '💊', '🍕', '🚌', '💡', '👕', '🏥']
  };

  // Filtrar categorías
  const filteredCategories = categories.filter(category => {
    const matchesSearch = !searchTerm || 
      category.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || category.type === filterType;

    return matchesSearch && matchesType;
  });

  // Estadísticas por tipo
  const incomeCategories = getCategoriesByType('income');
  const expenseCategories = getCategoriesByType('expense');

  // Manejar creación
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createCategory(formData);
      setShowCreateModal(false);
      setFormData({ name: '', emoji: '📁', type: 'expense' });
    } catch (error) {
      console.error('Error al crear categoría:', error);
    }
  };

  // Manejar edición
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;
    
    try {
      await updateCategory(showEditModal.id, {
        name: formData.name,
        emoji: formData.emoji,
        type: formData.type
      });
      setShowEditModal(null);
      setFormData({ name: '', emoji: '📁', type: 'expense' });
    } catch (error) {
      console.error('Error al editar categoría:', error);
    }
  };

  // Manejar eliminación
  const handleDelete = async () => {
    if (!showDeleteModal) return;
    
    try {
      await deleteCategory(showDeleteModal.id);
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  // Abrir modal de edición
  const openEditModal = (category: Category) => {
    setFormData({
      name: category.name,
      emoji: category.emoji,
      type: category.type
    });
    setShowEditModal(category);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-64 mb-4"></div>
            <div className="h-4 bg-slate-700 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-24 bg-slate-800 rounded-lg"></div>
              ))}
            </div>
            <div className="mt-4 text-center text-slate-400 text-sm">
              Cargando categorías...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
            <h3 className="text-red-400 text-lg font-semibold mb-2">Error al cargar categorías</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Recargar página
            </button>
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
              Categorías
            </h1>
            <p className="text-slate-400">
              Organiza tus movimientos por categorías
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </button>
        </div>



        {/* Filters */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="income">Ingresos</option>
              <option value="expense">Gastos</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Categorías</p>
                <p className="text-2xl font-bold text-white">{filteredCategories.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Categorías de Ingreso</p>
                <p className="text-2xl font-bold text-green-400">{incomeCategories.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Categorías de Gasto</p>
                <p className="text-2xl font-bold text-red-400">{expenseCategories.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-12 text-center">
            <Tag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              No hay categorías
            </h3>
            <p className="text-slate-400 mb-6">
              {categories.length === 0 
                ? "Crea tus primeras categorías para organizar tus movimientos"
                : "No se encontraron categorías con los filtros aplicados"
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear categoría
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-slate-800 rounded-2xl border border-slate-700 p-6 hover:border-slate-600 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{category.emoji}</div>
                    <div>
                      <h3 className="text-white font-medium">{category.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        category.type === 'income' 
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-red-600/20 text-red-400'
                      }`}>
                        {category.type === 'income' ? 'Ingreso' : 'Gasto'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(category)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-white mb-6">
                {showEditModal ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              
              <form onSubmit={showEditModal ? handleEdit : handleCreate} className="space-y-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tipo
                  </label>
                  <div className="flex bg-slate-700 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'expense', name: '', emoji: '🍔' })}
                      className={`flex-1 py-2 px-4 text-center rounded-md font-medium transition-colors ${
                        formData.type === 'expense'
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'text-slate-300 hover:text-white hover:bg-slate-600'
                      }`}
                    >
                      Gasto
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'income', name: '', emoji: '💰' })}
                      className={`flex-1 py-2 px-4 text-center rounded-md font-medium transition-colors ${
                        formData.type === 'income'
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'text-slate-300 hover:text-white hover:bg-slate-600'
                      }`}
                    >
                      Ingreso
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre de la Categoría
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={formData.type === 'income' ? 'Ej: Salario, Inversión' : 'Ej: Alimento, Transporte, Servicios Básicos, Ropa, Salud'}
                    required
                    maxLength={50}
                  />
                  <p className="text-slate-500 text-xs mt-1">
                    Categorías sugeridas para {formData.type === 'income' ? 'ingresos' : 'gastos'}: {allowedCategories[formData.type].join(', ')}
                  </p>
                </div>

                {/* Preview de la categoría */}
                {formData.name && (
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-slate-400 text-xs mb-2">Vista previa:</p>
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{formData.emoji}</div>
                      <div>
                        <h4 className="text-white font-medium">{formData.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          formData.type === 'income' 
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-red-600/20 text-red-400'
                        }`}>
                          {formData.type === 'income' ? 'Ingreso' : 'Gasto'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emoji */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Emoji
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.emoji}
                      onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="📁"
                      maxLength={2}
                    />
                    
                    <div className="grid grid-cols-5 gap-2">
                      {availableEmojis[formData.type].map((emoji: string) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormData({ ...formData, emoji })}
                          className={`p-2 rounded-lg text-xl hover:bg-slate-600 transition-colors ${
                            formData.emoji === emoji ? 'bg-slate-600' : 'bg-slate-700'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(null);
                      setFormData({ name: '', emoji: '📁', type: 'expense' });
                    }}
                    className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.name.trim() || !formData.emoji.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {showEditModal ? 'Actualizar Categoría' : 'Crear Categoría'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-sm w-full">
              <h3 className="text-xl font-semibold text-white mb-2">
                Eliminar Categoría
              </h3>
              <p className="text-slate-400 mb-4">
                ¿Estás seguro de que quieres eliminar la categoría{' '}
                <span className="text-white font-medium">
                  {showDeleteModal.emoji} {showDeleteModal.name}
                </span>?
              </p>
              <p className="text-slate-500 text-sm mb-6">
                Esta acción no se puede deshacer. Los movimientos asociados a esta categoría no se eliminarán.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
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