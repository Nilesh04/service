import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  MapPin,
  Package,
  QrCode,
  Wrench,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ComplaintStatusText,
  SparePartStatusText,
  WarrantyText,
} from '../StatusText';

interface MachinesViewProps {
  selectedMachineId: string | null;
  onSelectMachine: (machineId: string | null) => void;
  onRegisterComplaint: (machineId: string) => void;
  onRequestSparePart: (machineId: string) => void;
  onSelectComplaint: (complaintId: string) => void;
  onSelectSparePart: (requestId: string) => void;
}

export function MachinesView({
  selectedMachineId,
  onSelectMachine,
  onRegisterComplaint,
  onRequestSparePart,
  onSelectComplaint,
  onSelectSparePart,
}: MachinesViewProps) {
  const { machines, complaints, spareParts, serviceVisits } = useApp();
  const [historyTab, setHistoryTab] = useState<'complaints' | 'spares' | 'service'>('complaints');

  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || null;

  if (selectedMachine) {
    const machineComplaints = complaints.filter((c) => c.machineId === selectedMachine.id);
    const machineSpares = spareParts.filter((s) => s.machineId === selectedMachine.id);
    const machineVisits = serviceVisits.filter((v) => v.machineId === selectedMachine.id);

    return (
      <div className="space-y-4 pb-4">
        <button
          type="button"
          onClick={() => onSelectMachine(null)}
          className="min-h-[44px] px-2 -ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Machines</span>
        </button>

        {/* Machine Overview Card */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
            <img
              src={selectedMachine.imageUrl}
              alt={selectedMachine.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">
                  {selectedMachine.id} · {selectedMachine.model}
                </span>
                <h1 className="text-lg font-bold text-navy-900 mt-0.5">
                  {selectedMachine.name}
                </h1>
              </div>
              <WarrantyText status={selectedMachine.warrantyStatus} />
            </div>

            <p className="text-xs text-slate-600">{selectedMachine.specs}</p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Serial Number</span>
                <span className="font-mono font-semibold text-navy-900 tabular-nums">
                  {selectedMachine.serialNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Installed</span>
                <span className="font-semibold text-navy-900 tabular-nums">
                  {selectedMachine.installationDate}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block text-[11px]">Warranty Coverage</span>
                <span className="font-semibold text-navy-900 tabular-nums">
                  {selectedMachine.warrantyStatus === 'Active'
                    ? `Active till ${selectedMachine.warrantyValidTill}`
                    : `Expired on ${selectedMachine.warrantyValidTill}`}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block text-[11px]">Location</span>
                <span className="font-semibold text-navy-900 inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedMachine.location}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => onRegisterComplaint(selectedMachine.id)}
                className="w-full min-h-[48px] px-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-semibold active:scale-[0.98] transition-all"
              >
                <Wrench className="w-4 h-4" />
                <span>Register Complaint for Machine</span>
              </button>
              <button
                type="button"
                onClick={() => onRequestSparePart(selectedMachine.id)}
                className="w-full min-h-[44px] px-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-navy-900 text-xs font-semibold"
              >
                <Package className="w-4 h-4 text-blue-600" />
                <span>Request Spare Part</span>
              </button>
            </div>
          </div>
        </div>

        {/* Machine QR Code Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shrink-0">
            <QRCodeSVG
              value={selectedMachine.id}
              size={96}
              level="M"
              fgColor="#0F2544"
              bgColor="#FFFFFF"
            />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-navy-900">
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              <span>Machine Asset QR</span>
            </div>
            <p className="text-xs font-mono font-bold text-blue-700 tabular-nums">
              {selectedMachine.id}
            </p>
            <p className="text-[11px] text-slate-500 leading-snug">
              Scan this nameplate code on the factory floor for instant service requests.
            </p>
          </div>
        </div>

        {/* History Tabs */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <div className="p-1.5 bg-slate-50 border-b border-slate-100 grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setHistoryTab('complaints')}
              className={`min-h-[40px] px-1 rounded-xl text-[11px] font-semibold transition-colors whitespace-nowrap ${
                historyTab === 'complaints'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              Complaints ({machineComplaints.length})
            </button>
            <button
              type="button"
              onClick={() => setHistoryTab('spares')}
              className={`min-h-[40px] px-1 rounded-xl text-[11px] font-semibold transition-colors whitespace-nowrap ${
                historyTab === 'spares'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              Parts ({machineSpares.length})
            </button>
            <button
              type="button"
              onClick={() => setHistoryTab('service')}
              className={`min-h-[40px] px-1 rounded-xl text-[11px] font-semibold transition-colors whitespace-nowrap ${
                historyTab === 'service'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              Service ({machineVisits.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {historyTab === 'complaints' &&
              (machineComplaints.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No complaints recorded for {selectedMachine.id}.
                </div>
              ) : (
                machineComplaints.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelectComplaint(c.id)}
                    className="w-full p-3.5 text-left active:bg-slate-50 flex items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                        {c.id} · {c.registeredDate}
                      </div>
                      <div className="text-xs font-bold text-navy-900 truncate">
                        {c.subject}
                      </div>
                      <ComplaintStatusText status={c.status} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))
              ))}

            {historyTab === 'spares' &&
              (machineSpares.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No spare part requests for {selectedMachine.id}.
                </div>
              ) : (
                machineSpares.map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => onSelectSparePart(sp.id)}
                    className="w-full p-3.5 text-left active:bg-slate-50 flex items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                        {sp.id} · Qty {sp.quantity} · {sp.requestDate}
                      </div>
                      <div className="text-xs font-bold text-navy-900 truncate">
                        {sp.partName}
                      </div>
                      <SparePartStatusText status={sp.status} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))
              ))}

            {historyTab === 'service' &&
              (machineVisits.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No service visits logged for {selectedMachine.id}.
                </div>
              ) : (
                machineVisits.map((v) => (
                  <div key={v.id} className="p-3.5 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-bold text-navy-900">{v.engineerName}</span>
                      <span className="tabular-nums">
                        {v.visitDate} · {v.visitTime}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-800">{v.workPerformed}</p>
                    <p className="text-[11px] text-slate-500">{v.serviceNotes}</p>
                  </div>
                ))
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-2">
      <div>
        <h1 className="text-lg font-bold text-navy-900">My Machines</h1>
        <p className="text-xs text-slate-500">
          {machines.length} registered machines · ABC Plastics Industries
        </p>
      </div>

      <div className="space-y-3.5">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
          >
            <button
              type="button"
              onClick={() => onSelectMachine(machine.id)}
              className="text-left w-full block"
            >
              <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                <img
                  src={machine.imageUrl}
                  alt={machine.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-bold text-blue-700 tabular-nums">
                    {machine.id}
                  </span>
                  <span className="font-mono text-slate-500 tabular-nums">
                    Model {machine.model}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-navy-900">{machine.name}</h2>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                  <WarrantyText status={machine.warrantyStatus} />
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{machine.installationDate}</span>
                  </span>
                </div>
              </div>
            </button>

            <div className="px-3.5 py-2.5 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
              <button
                type="button"
                onClick={() => onSelectMachine(machine.id)}
                className="min-h-[40px] text-xs font-semibold text-navy-900"
              >
                Details &amp; QR Code
              </button>
              <button
                type="button"
                onClick={() => onRegisterComplaint(machine.id)}
                className="min-h-[40px] px-3.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Report Issue
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
