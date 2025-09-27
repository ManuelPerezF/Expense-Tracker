"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSummary } from "@/hooks/useSummary";
import { useMovements } from "@/hooks/useMovements";
import { useCategories } from "@/hooks/useCategories";
import StatCard from "@/components/dashboard/StatCard";
import { formatCurrency } from "@/utils/formatters";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Plus 
} from 'lucide-react';

export default function Dashboard() {
  const { summary, loading: summaryLoading, refreshSummary } = useSummary();
  const { movements, loading: movementsLoading, deleteMovement } = useMovements();
  const { categories } = useCategories();

  useEffect(() => {
    refreshSummary();
  }, [movements]);

  // Tomar los últimos 5 movimientos para mostrar
  const recentMovements = movements.slice(0, 5);

  return (
    <div className="flex-1 bg-slate-900 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Resumen de tus finanzas personales
            </p>
          </div>
          
          <Link
            href="/movements/new"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Movimiento</span>
          </Link>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Balance Total"
            value={formatCurrency(summary.balance)}
            icon={<DollarSign className="w-6 h-6" />}
            color={summary.balance >= 0 ? 'blue' : 'red'}
            loading={summaryLoading}
          />
          
          <StatCard
            title="Ingresos Totales"
            value={formatCurrency(summary.totalIncome)}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
            loading={summaryLoading}
          />
          
          <StatCard
            title="Gastos Totales"
            value={formatCurrency(summary.totalExpenses)}
            icon={<TrendingDown className="w-6 h-6" />}
            color="red"
            loading={summaryLoading}
          />
          
          <StatCard
            title="Mayor Gasto"
            value={formatCurrency(summary.biggestExpense)}
            icon={<CreditCard className="w-6 h-6" />}
            color="orange"
            loading={summaryLoading}
          />
        </div>

        {/* Recent Movements */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Movimientos Recientes
              </h2>
              <Link
                href="/movements"
                className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
              >
                Ver todos
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {movementsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-600 rounded-lg"></div>
                        <div>
                          <div className="h-4 bg-slate-600 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-slate-600 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-slate-600 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentMovements.length > 0 ? (
              <div className="space-y-3">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        movement.type === 'entrada' 
                          ? 'bg-green-500/20' 
                          : 'bg-red-500/20'
                      }`}>
                        {movement.type === 'entrada' ? (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      
                      <div>
                        <div className="font-medium text-white">
                          {categories.find(cat => cat.id === movement.category_id)?.name || 'parlay'}
                        </div>
                        <div className="text-sm text-slate-400">
                          {new Date(movement.date).toLocaleDateString('es-CO', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })} • {movement.type === 'entrada' ? 'Salario' : 'Gasto'}
                        </div>
                      </div>
                    </div>

                    <div className={`font-semibold ${
                      movement.type === 'entrada' 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {movement.type === 'entrada' ? '+' : '-'}{formatCurrency(Math.abs(movement.amount))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No hay movimientos aún
                </h3>
                <p className="text-slate-400 mb-6">
                  Comienza agregando tu primer ingreso o gasto
                </p>
                <Link
                  href="/movements/new"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Agregar Movimiento</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}