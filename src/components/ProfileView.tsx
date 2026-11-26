import {
  Building2,
  HardHat,
  LogOut,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ProfileView() {
  const {
    session,
    customer,
    currentEngineer,
    complaints,
    logout,
  } = useApp();

  const isCustomer = session?.role === 'customer';
  const assignedCount = currentEngineer
    ? complaints.filter((c) => c.assignedEngineerId === currentEngineer.employeeId).length
    : 0;

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="text-lg font-bold text-navy-900">Profile &amp; Account</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {isCustomer ? 'Customer Account Details' : 'Service Engineer Credentials'}
        </p>
      </div>

      {/* Identity Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4.5 shadow-xs space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-navy-900 text-white flex items-center justify-center shrink-0">
            {isCustomer ? (
              <Building2 className="w-6 h-6" />
            ) : (
              <HardHat className="w-6 h-6" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-navy-900 truncate">
              {isCustomer ? customer.name : currentEngineer?.name}
            </h2>
            <p className="text-xs font-medium text-blue-700 truncate">
              {isCustomer
                ? customer.company
                : `${currentEngineer?.employeeId} · ${currentEngineer?.designation}`}
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border-t border-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between gap-4">
            <span className="text-slate-500 inline-flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>Mobile Number</span>
            </span>
            <span className="font-mono font-semibold text-navy-900 tabular-nums">
              +91 {isCustomer ? customer.mobile : currentEngineer?.mobile}
            </span>
          </div>

          {isCustomer ? (
            <>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-slate-500 inline-flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>Email</span>
                </span>
                <span className="font-semibold text-navy-900 truncate">
                  {customer.email}
                </span>
              </div>
              <div className="py-3 flex items-start justify-between gap-4">
                <span className="text-slate-500 inline-flex items-center gap-2 shrink-0">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Plant Address</span>
                </span>
                <span className="font-medium text-navy-900 text-right leading-relaxed">
                  {customer.address}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-slate-500">Specialization</span>
                <span className="font-semibold text-navy-900 text-right">
                  {currentEngineer?.specialization}
                </span>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-slate-500">Assigned Complaints</span>
                <span className="font-mono font-bold text-navy-900 tabular-nums">
                  {assignedCount}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Standalone Logout Action */}
      <button
        type="button"
        onClick={logout}
        className="w-full min-h-[48px] px-4 flex items-center justify-center gap-2 rounded-2xl bg-red-600 text-white text-sm font-semibold active:scale-[0.99] transition-all shadow-xs"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );
}
