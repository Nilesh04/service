import { useState } from 'react';
import { ChevronRight, Clock, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ComplaintStatus } from '../../types';
import { ComplaintStatusText, PriorityText } from '../StatusText';

interface EngineerTasksViewProps {
  mode: 'tasks' | 'history';
  onSelectComplaint: (complaintId: string) => void;
}

const ENGINEER_FILTERS: Array<'All' | Exclude<ComplaintStatus, 'Pending Assignment'>> = [
  'All',
  'Assigned',
  'In Progress',
  'Pending – Spare Parts Required',
  'Resolved',
];

export function EngineerTasksView({
  mode,
  onSelectComplaint,
}: EngineerTasksViewProps) {
  const { currentEngineer, customer, machines, complaints, serviceVisits } = useApp();
  const [filter, setFilter] = useState<
    'All' | Exclude<ComplaintStatus, 'Pending Assignment'>
  >('All');

  const engId = currentEngineer?.employeeId || 'ENG001';
  const assigned = complaints.filter((c) => c.assignedEngineerId === engId);

  const getMachineName = (id: string) =>
    machines.find((m) => m.id === id)?.name || id;

  if (mode === 'history') {
    const myVisits = serviceVisits.filter((v) => v.engineerId === engId);
    const resolvedJobs = assigned.filter((c) => c.status === 'Resolved');

    return (
      <div className="space-y-5 pb-2">
        <div>
          <h1 className="text-lg font-bold text-navy-900">Service History</h1>
          <p className="text-xs text-slate-500">
            Visits and completed jobs by {currentEngineer?.name}
          </p>
        </div>

        <section className="space-y-2.5">
          <h2 className="text-xs font-bold text-navy-900">
            Logged Service Visits ({myVisits.length})
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {myVisits.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectComplaint(v.complaintId)}
                className="w-full p-3.5 text-left active:bg-slate-50 space-y-1"
              >
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono font-bold text-navy-900 tabular-nums inline-flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-blue-600" />
                    <span>{v.complaintId}</span>
                  </span>
                  <span className="text-slate-500 inline-flex items-center gap-1 tabular-nums">
                    <Clock className="w-3 h-3" />
                    <span>{v.visitDate}</span>
                  </span>
                </div>
                <p className="text-xs font-bold text-navy-900 truncate">
                  {getMachineName(v.machineId)}
                </p>
                <p className="text-xs text-slate-700 line-clamp-2">{v.workPerformed}</p>
                <p className="text-[11px] font-semibold text-blue-700">
                  {v.statusAfterVisit}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-xs font-bold text-navy-900">
            Resolved Complaints ({resolvedJobs.length})
          </h2>
          <div className="space-y-3">
            {resolvedJobs.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectComplaint(c.id)}
                className="w-full bg-white rounded-2xl border border-slate-200 p-3.5 text-left active:bg-slate-50 flex items-start justify-between gap-2.5"
              >
                <div className="min-w-0 space-y-1">
                  <div className="text-[11px] font-mono font-bold text-navy-900 tabular-nums">
                    {c.id} · {c.registeredDate}
                  </div>
                  <div className="text-sm font-bold text-navy-900 truncate">
                    {c.subject}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {getMachineName(c.machineId)}
                  </div>
                  <ComplaintStatusText status={c.status} />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const filtered =
    filter === 'All' ? assigned : assigned.filter((c) => c.status === filter);

  return (
    <div className="space-y-4 pb-2">
      <div>
        <h1 className="text-lg font-bold text-navy-900">My Tasks</h1>
        <p className="text-xs text-slate-500 tabular-nums">
          {assigned.length} complaints assigned to {currentEngineer?.name}
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {ENGINEER_FILTERS.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilter(st)}
            className={`min-h-[38px] px-3 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              filter === st
                ? 'bg-navy-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
          <p className="text-sm font-semibold text-navy-900">
            No tasks under "{filter}"
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectComplaint(c.id)}
              className="w-full bg-white rounded-2xl border border-slate-200 p-3.5 text-left active:bg-slate-50 transition-colors flex items-start justify-between gap-2.5"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-mono font-bold text-navy-900 tabular-nums">
                    {c.id}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{c.registeredDate}</span>
                </div>
                <h2 className="text-sm font-bold text-navy-900 truncate">
                  {c.subject}
                </h2>
                <p className="text-xs text-slate-600 truncate">
                  {customer.company} · {getMachineName(c.machineId)}
                </p>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-0.5">
                  <ComplaintStatusText status={c.status} />
                  <span className="text-slate-300" aria-hidden="true">
                    |
                  </span>
                  <PriorityText priority={c.priority} />
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
