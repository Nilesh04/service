import {
  CheckCircle2,
  ClipboardList,
  Cog,
  HardHat,
  Package,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EngineerDashboardProps {
  onNavigateTab: (tab: 'tasks' | 'history') => void;
}

export function EngineerDashboard({ onNavigateTab }: EngineerDashboardProps) {
  const { currentEngineer, complaints } = useApp();

  const engId = currentEngineer?.employeeId || 'ENG001';
  const assignedComplaints = complaints.filter(
    (c) => c.assignedEngineerId === engId
  );

  const inProgressCount = assignedComplaints.filter(
    (c) => c.status === 'In Progress'
  ).length;
  const spareRequiredCount = assignedComplaints.filter(
    (c) => c.status === 'Pending – Spare Parts Required'
  ).length;
  const resolvedCount = assignedComplaints.filter(
    (c) => c.status === 'Resolved'
  ).length;

  return (
    <div className="space-y-5 pb-2">
      {/* Engineer Header Card */}
      <section className="bg-navy-900 text-white rounded-3xl p-4.5 shadow-sm space-y-3.5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-200 font-medium">
            <HardHat className="w-4 h-4" />
            <span>
              {currentEngineer?.employeeId} · {currentEngineer?.designation}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Hello, {currentEngineer?.name}
          </h1>
          <p className="text-xs text-slate-300">
            {currentEngineer?.specialization}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('tasks')}
          className="w-full min-h-[46px] rounded-xl bg-blue-600 text-white text-sm font-semibold active:scale-[0.98] transition-all"
        >
          Open My Tasks ({assignedComplaints.length})
        </button>
      </section>

      {/* 2x2 Summary Cards */}
      <section className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onNavigateTab('tasks')}
          className="bg-white rounded-2xl border border-slate-200 p-3.5 text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Total Assigned</span>
            <ClipboardList className="w-4 h-4 text-navy-900" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-navy-900 tabular-nums">
            {assignedComplaints.length}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">Assigned tickets</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('tasks')}
          className="bg-white rounded-2xl border border-slate-200 p-3.5 text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">In Progress</span>
            <Cog className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-blue-700 tabular-nums">
            {inProgressCount}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">Active jobs</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('tasks')}
          className="bg-white rounded-2xl border border-slate-200 p-3.5 text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Spare Parts Req.</span>
            <Package className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-orange-700 tabular-nums">
            {spareRequiredCount}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">On parts hold</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('history')}
          className="bg-white rounded-2xl border border-slate-200 p-3.5 text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-green-700 tabular-nums">
            {resolvedCount}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">Completed repairs</p>
        </button>
      </section>
    </div>
  );
}
