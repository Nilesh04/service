import {
  AlertCircle,
  CheckCircle2,
  Cog,
  Package,
  Plus,
  QrCode,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CustomerDashboardProps {
  onOpenNewComplaint: (machineId?: string) => void;
  onOpenNewSparePart: (machineId?: string) => void;
  onOpenQrScanner: () => void;
  onNavigateTab: (tab: 'machines' | 'complaints' | 'spare_parts') => void;
}

export function CustomerDashboard({
  onOpenNewComplaint,
  onOpenNewSparePart,
  onOpenQrScanner,
  onNavigateTab,
}: CustomerDashboardProps) {
  const { customer, machines, complaints, spareParts } = useApp();

  const openComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;
  const resolvedComplaintsCount = complaints.filter((c) => c.status === 'Resolved').length;
  const pendingSpareCount = spareParts.filter((s) => s.status !== 'Completed').length;

  return (
    <div className="space-y-5 pb-2">
      {/* Greeting & Quick Actions Card */}
      <section className="bg-navy-900 text-white rounded-3xl p-4.5 shadow-sm space-y-4">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-blue-200">{customer.company}</p>
          <h1 className="text-xl font-bold tracking-tight">
            Good Morning, Rajesh!
          </h1>
          <p className="text-xs text-slate-300">
            Track service tickets &amp; order genuine OEM spare parts.
          </p>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onOpenNewComplaint()}
            className="w-full min-h-[48px] px-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Register New Complaint</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onOpenNewSparePart()}
              className="min-h-[44px] px-3 flex items-center justify-center gap-1.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-semibold active:bg-white/20 transition-colors"
            >
              <Package className="w-4 h-4 shrink-0 text-blue-200" />
              <span className="truncate">Request Spare Parts</span>
            </button>
            <button
              type="button"
              onClick={onOpenQrScanner}
              className="min-h-[44px] px-3 flex items-center justify-center gap-1.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-semibold active:bg-white/20 transition-colors"
            >
              <QrCode className="w-4 h-4 shrink-0 text-blue-200" />
              <span className="truncate">Scan Machine QR</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2x2 Mobile Summary Cards */}
      <section className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onNavigateTab('machines')}
          className="bg-white rounded-2xl border border-slate-200 p-3.5 text-left active:bg-slate-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">My Machines</span>
            <Cog className="w-4 h-4 text-navy-900" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-navy-900 tabular-nums">
            {machines.length}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {machines.filter((m) => m.warrantyStatus === 'Active').length} active warranty
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('complaints')}
          className="bg-white rounded-2xl border border-slate-200 p-3.5 text-left active:bg-slate-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Open Complaints</span>
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-orange-700 tabular-nums">
            {openComplaintsCount}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">Active tickets</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('complaints')}
          className="bg-white rounded-2xl border border-slate-200 p-3.5 text-left active:bg-slate-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-green-700 tabular-nums">
            {resolvedComplaintsCount}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">Completed jobs</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('spare_parts')}
          className="bg-white rounded-2xl border border-slate-200 p-3.5 text-left active:bg-slate-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Spare Requests</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-1.5 text-2xl font-bold text-blue-700 tabular-nums">
            {pendingSpareCount}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">In fulfillment</p>
        </button>
      </section>
    </div>
  );
}
