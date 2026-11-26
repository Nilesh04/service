import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ImagePlus,
  Package,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SparePartRequest, SparePartStatus } from '../../types';
import { ImageLightbox } from '../ImageLightbox';
import { SparePartStatusText } from '../StatusText';

interface SparePartsViewProps {
  selectedRequestId: string | null;
  onSelectRequest: (id: string | null) => void;
  showForm: boolean;
  initialMachineId?: string;
  onOpenForm: (machineId?: string) => void;
  onCloseForm: () => void;
}

const SPARE_FILTERS: Array<'All' | SparePartStatus> = [
  'All',
  'Pending',
  'Approved',
  'Dispatched',
  'Completed',
];

export function SparePartsView({
  selectedRequestId,
  onSelectRequest,
  showForm,
  initialMachineId,
  onOpenForm,
  onCloseForm,
}: SparePartsViewProps) {
  const { machines, spareParts, registerSparePart, showToast } = useApp();

  const [filter, setFilter] = useState<'All' | SparePartStatus>('All');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const [machineId, setMachineId] = useState(initialMachineId || machines[0]?.id || 'PEM-001');
  const [partName, setPartName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdRequest, setCreatedRequest] = useState<SparePartRequest | null>(null);

  const selectedRequest = spareParts.find((s) => s.id === selectedRequestId) || null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (partName.trim().length < 3) {
      setFormError('Please enter the spare part name.');
      return;
    }
    if (quantity < 1) {
      setFormError('Quantity must be at least 1.');
      return;
    }
    if (description.trim().length < 8) {
      setFormError('Please enter a brief description of the required part.');
      return;
    }

    setFormError(null);
    const created = registerSparePart({
      machineId,
      partName,
      partNumber,
      quantity,
      description,
      images,
    });
    setCreatedRequest(created);
    showToast(`Spare part request ${created.id} submitted`);
  };

  const resetFormFields = () => {
    setPartName('');
    setPartNumber('');
    setQuantity(1);
    setDescription('');
    setImages([]);
    setCreatedRequest(null);
    setFormError(null);
  };

  if (showForm) {
    if (createdRequest) {
      const machine = machines.find((m) => m.id === createdRequest.machineId);
      return (
        <div className="py-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-5 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h1 className="text-lg font-bold text-navy-900">
                Spare Part Request Submitted
              </h1>
              <p className="text-xs text-slate-500">
                Our parts desk has received your requisition.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Request ID</span>
                <span className="font-mono font-bold text-navy-900 tabular-nums">
                  {createdRequest.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Machine</span>
                <span className="font-semibold text-navy-900">
                  {machine?.name} ({createdRequest.machineId})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Part Name</span>
                <span className="font-semibold text-navy-900">{createdRequest.partName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold text-orange-700">Pending</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  const id = createdRequest.id;
                  resetFormFields();
                  onCloseForm();
                  onSelectRequest(id);
                }}
                className="w-full min-h-[48px] rounded-xl bg-blue-600 text-white text-sm font-semibold"
              >
                View Request Details
              </button>
              <button
                type="button"
                onClick={() => {
                  resetFormFields();
                  onCloseForm();
                }}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white text-navy-900 text-sm font-semibold"
              >
                Back to Spare Parts
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 pb-4">
        <button
          type="button"
          onClick={() => {
            resetFormFields();
            onCloseForm();
          }}
          className="min-h-[44px] px-2 -ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Spare Parts</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div>
            <h1 className="text-lg font-bold text-navy-900">Request Spare Parts</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Order genuine OEM replacement components.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label
                htmlFor="sp-machine"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Select Machine
              </label>
              <select
                id="sp-machine"
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                className="w-full min-h-[46px] px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-navy-900"
              >
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sp-name"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Spare Part Name
              </label>
              <input
                id="sp-name"
                type="text"
                value={partName}
                onChange={(e) => {
                  setPartName(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="e.g. Ceramic Band Heater 230V 1800W"
                className="w-full min-h-[46px] px-3 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label
                  htmlFor="sp-number"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Part Number
                </label>
                <input
                  id="sp-number"
                  type="text"
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value.toUpperCase())}
                  placeholder="Optional"
                  className="w-full min-h-[46px] px-3 rounded-xl border border-slate-200 text-xs font-mono uppercase"
                />
              </div>

              <div>
                <label
                  htmlFor="sp-qty"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Quantity
                </label>
                <input
                  id="sp-qty"
                  type="number"
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full min-h-[46px] px-3 rounded-xl border border-slate-200 text-xs font-mono tabular-nums"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="sp-desc"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Detailed Description
              </label>
              <textarea
                id="sp-desc"
                rows={3}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="Specify dimensions, zone number, or urgency..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-700">
                Upload Part Images (Optional)
              </span>
              <label className="min-h-[68px] flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-3 cursor-pointer">
                <ImagePlus className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold text-navy-900">
                  Tap to attach photos
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl overflow-hidden border border-slate-200"
                    >
                      <img
                        src={src}
                        alt={`Part preview ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        aria-label="Remove image"
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-navy-950/75 text-white flex items-center justify-center"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {formError && (
              <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-xl bg-blue-600 text-white text-sm font-semibold"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (selectedRequest) {
    const machine = machines.find((m) => m.id === selectedRequest.machineId);
    return (
      <div className="space-y-4 pb-4">
        <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

        <button
          type="button"
          onClick={() => onSelectRequest(null)}
          className="min-h-[44px] px-2 -ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Spare Parts</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold text-navy-900 tabular-nums">
              {selectedRequest.id} · {selectedRequest.requestDate}
            </span>
            <SparePartStatusText status={selectedRequest.status} />
          </div>

          <h1 className="text-lg font-bold text-navy-900">{selectedRequest.partName}</h1>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl">
            <div className="col-span-2">
              <span className="text-slate-500 text-[11px] block">Machine</span>
              <span className="font-semibold text-navy-900">
                {machine?.name} ({selectedRequest.machineId})
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Part Number</span>
              <span className="font-mono font-semibold text-navy-900">
                {selectedRequest.partNumber || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Quantity</span>
              <span className="font-mono font-bold text-navy-900 tabular-nums">
                {selectedRequest.quantity} unit(s)
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">{selectedRequest.description}</p>

          {selectedRequest.images.length > 0 && (
            <div className="space-y-2 pt-1">
              <h2 className="text-xs font-bold text-navy-900">Reference Photos</h2>
              <div className="grid grid-cols-3 gap-2">
                {selectedRequest.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxSrc(img)}
                    className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200"
                  >
                    <img
                      src={img}
                      alt={`Spare part ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <h2 className="text-xs font-bold text-navy-900">Status History</h2>
            <div className="space-y-2.5">
              {selectedRequest.history.map((h) => (
                <div key={h.id} className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-navy-900">{h.status}</span>
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        {h.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-600">{h.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filtered =
    filter === 'All'
      ? spareParts
      : spareParts.filter((s) => s.status === filter);

  return (
    <div className="space-y-4 pb-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-navy-900">Spare Part Requests</h1>
          <p className="text-xs text-slate-500 tabular-nums">
            {spareParts.length} OEM requisitions
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenForm()}
          className="min-h-[40px] px-3.5 inline-flex items-center gap-1 rounded-xl bg-blue-600 text-white text-xs font-semibold shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Request</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {SPARE_FILTERS.map((st) => (
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
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-1">
          <Package className="w-7 h-7 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-navy-900">
            No requests under "{filter}"
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sp) => {
            const machine = machines.find((m) => m.id === sp.machineId);
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => onSelectRequest(sp.id)}
                className="w-full bg-white rounded-2xl border border-slate-200 p-3.5 text-left active:bg-slate-50 transition-colors flex items-start justify-between gap-2.5"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-mono font-bold text-navy-900 tabular-nums">
                      {sp.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">Qty {sp.quantity}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{sp.requestDate}</span>
                  </div>
                  <h2 className="text-sm font-bold text-navy-900 truncate">
                    {sp.partName}
                  </h2>
                  <p className="text-xs text-slate-600 truncate">
                    {machine?.name || sp.machineId}
                    {sp.partNumber ? ` · ${sp.partNumber}` : ''}
                  </p>
                  <SparePartStatusText status={sp.status} />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
