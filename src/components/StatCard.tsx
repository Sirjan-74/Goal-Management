import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  trend?: { value: number; label: string };
  glow?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, gradient, trend, glow }) => {
  return (
    <div className={`relative bg-gray-800/50 backdrop-blur-sm border border-white/8 rounded-2xl p-5 overflow-hidden hover:border-white/15 transition-all duration-300 hover:shadow-xl ${glow || ''}`}>
      {/* Background gradient */}
      <div className={`absolute inset-0 opacity-5 ${gradient}`} />
      
      {/* Content */}
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{title}</p>
          <p className="text-white font-bold text-3xl leading-none mb-1">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
