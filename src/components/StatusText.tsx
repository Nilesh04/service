import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cog,
  Package,
  ShieldAlert,
  ShieldCheck,
  Truck,
  UserCheck,
} from 'lucide-react';
import { ComplaintStatus, PriorityLevel, SparePartStatus, WarrantyStatus } from '../types';

export function ComplaintStatusText({ status }: { status: ComplaintStatus }) {
  switch (status) {
    case 'Pending Assignment':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Pending Assignment</span>
        </span>
      );
    case 'Assigned':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 whitespace-nowrap">
          <UserCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Assigned</span>
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 whitespace-nowrap">
          <Cog className="w-3.5 h-3.5 shrink-0" />
          <span>In Progress</span>
        </span>
      );
    case 'Pending – Spare Parts Required':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 whitespace-nowrap">
          <Package className="w-3.5 h-3.5 shrink-0" />
          <span>Pending – Spare Parts Required</span>
        </span>
      );
    case 'Resolved':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Resolved</span>
        </span>
      );
  }
}

export function PriorityText({ priority }: { priority: PriorityLevel }) {
  switch (priority) {
    case 'Critical':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Critical Priority</span>
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>High Priority</span>
        </span>
      );
    case 'Medium':
      return (
        <span className="text-xs font-medium text-blue-700 whitespace-nowrap">
          Medium Priority
        </span>
      );
    case 'Low':
      return (
        <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
          Low Priority
        </span>
      );
  }
}

export function SparePartStatusText({ status }: { status: SparePartStatus }) {
  switch (status) {
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Pending</span>
        </span>
      );
    case 'Approved':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Approved</span>
        </span>
      );
    case 'Dispatched':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 whitespace-nowrap">
          <Truck className="w-3.5 h-3.5 shrink-0" />
          <span>Dispatched</span>
        </span>
      );
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Completed</span>
        </span>
      );
  }
}

export function WarrantyText({ status }: { status: WarrantyStatus }) {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 whitespace-nowrap">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        <span>Warranty Active</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 whitespace-nowrap">
      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
      <span>Warranty Expired</span>
    </span>
  );
}
