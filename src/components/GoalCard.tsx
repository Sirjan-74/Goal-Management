import React from 'react';
import { Lock, Share2, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Goal } from '../data/mockData';
import { useApp } from '../context/AppContext';

interface GoalCardProps {
  goal: Goal;
  showActions?: boolean;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onApprove?: (goalId: string) => void;
  onReject?: (goalId: string) => void;
  employeeName?: string;
}

const statusConfig = {
  Draft: { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', icon: Clock, dot: 'bg-gray-400' },
  Pending: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: Clock, dot: 'bg-amber-400' },
  Approved: { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: CheckCircle, dot: 'bg-emerald-400' },
  Rejected: { color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: XCircle, dot: 'bg-red-400' },
  Locked: { color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: Lock, dot: 'bg-purple-400' },
};

const thrustAreaColors: Record<string, string> = {
  Innovation: 'text-cyan-400 bg-cyan-500/10',
  'Learning & Development': 'text-blue-400 bg-blue-500/10',
  Research: 'text-violet-400 bg-violet-500/10',
  'Process Improvement': 'text-orange-400 bg-orange-500/10',
  'Customer Success': 'text-pink-400 bg-pink-500/10',
  Operations: 'text-teal-400 bg-teal-500/10',
  'Cost Reduction': 'text-yellow-400 bg-yellow-500/10',
  Leadership: 'text-rose-400 bg-rose-500/10',
  Sales: 'text-green-400 bg-green-500/10',
};

const GoalCard: React.FC<GoalCardProps> = ({ goal, showActions = true, onEdit, onDelete, onApprove, onReject, employeeName }) => {
  const { currentUser } = useApp();
  const status = statusConfig[goal.status];
  const thrustColor = thrustAreaColors[goal.thrustArea] || 'text-gray-400 bg-gray-500/10';
  const canEdit = currentUser?.role === 'employee' && goal.status === 'Draft' && !goal.locked;
  const canDelete = currentUser?.role === 'employee' && (goal.status === 'Draft' || goal.status === 'Rejected') && !goal.locked;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${thrustColor}`}>
              {goal.thrustArea}
            </span>
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-lg">{goal.quarter}</span>
            {goal.isShared && (
              <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg">
                <Share2 size={10} /> Shared
              </span>
            )}
            {goal.locked && (
              <span className="flex items-center gap-1 text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg">
                <Lock size={10} /> Locked
              </span>
            )}
          </div>
          <h3 className="text-white font-semibold text-sm leading-snug truncate">{goal.title}</h3>
          {employeeName && (
            <p className="text-gray-500 text-xs mt-0.5">👤 {employeeName}</p>
          )}
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.color} flex-shrink-0`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {goal.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">{goal.description}</p>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/5 rounded-xl p-2.5 text-center">
          <p className="text-white font-bold text-base">{goal.targetValue}{goal.uom}</p>
          <p className="text-gray-500 text-xs mt-0.5">Target</p>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 text-center">
          <p className="text-white font-bold text-base">{goal.weightage}%</p>
          <p className="text-gray-500 text-xs mt-0.5">Weightage</p>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 text-center">
          <p className="text-white font-bold text-base">{goal.quarter}</p>
          <p className="text-gray-500 text-xs mt-0.5">Quarter</p>
        </div>
      </div>

      {/* Weightage bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Weightage</span>
          <span>{goal.weightage}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${goal.weightage}%` }}
          />
        </div>
      </div>

      {/* Manager Comment */}
      {goal.managerComment && (
        <div className={`p-2.5 rounded-xl mb-3 text-xs ${goal.status === 'Rejected' ? 'bg-red-500/10 border border-red-500/20 text-red-300' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'}`}>
          <span className="font-semibold">Manager: </span>{goal.managerComment}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(goal)}
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Edit size={12} /> Edit
            </button>
          )}
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Trash2 size={12} /> Delete
            </button>
          )}
          {currentUser?.role === 'manager' && goal.status === 'Pending' && onApprove && onReject && (
            <>
              <button
                onClick={() => onApprove(goal.id)}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <CheckCircle size={12} /> Approve
              </button>
              <button
                onClick={() => onReject(goal.id)}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <XCircle size={12} /> Reject
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalCard;
