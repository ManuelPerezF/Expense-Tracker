import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: 'blue' | 'green' | 'red' | 'orange';
  loading?: boolean;
}

const colorClasses = {
  blue: {
    icon: 'text-blue-400',
    bg: 'bg-slate-800',
    border: 'border-slate-700'
  },
  green: {
    icon: 'text-green-400',
    bg: 'bg-slate-800',
    border: 'border-slate-700'
  },
  red: {
    icon: 'text-red-400',
    bg: 'bg-slate-800',
    border: 'border-slate-700'
  },
  orange: {
    icon: 'text-orange-400',
    bg: 'bg-slate-800',
    border: 'border-slate-700'
  }
};

export default function StatCard({ title, value, icon, color, loading = false }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-slate-600 rounded w-24"></div>
            <div className="w-6 h-6 bg-slate-600 rounded"></div>
          </div>
          <div className="h-8 bg-slate-600 rounded w-32 mb-2"></div>
        </div>
      </div>
    );
  }

  const colorClass = colorClasses[color];

  return (
    <div className={`${colorClass.bg} rounded-2xl p-6 border ${colorClass.border}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 text-sm font-medium">
          {title}
        </span>
        <div className={colorClass.icon}>
          {icon}
        </div>
      </div>
      
      <div className="text-3xl font-bold text-white mb-1">
        {value}
      </div>
    </div>
  );
}