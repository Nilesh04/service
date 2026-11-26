import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  ImagePlus,
  MapPin,
  Package,
  Phone,
  Play,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ImageLightbox } from '../ImageLightbox';
import { ComplaintStatusText, PriorityText } from '../StatusText';

interface EngineerComplaintDetailProps {
  complaintId: string;
  onBack: () => void;
}

export function EngineerComplaintDetail({
  complaintId,
  onBack,
}: EngineerComplaintDetailProps) {
  const {
    customer,
    machines,
    complaints,
    serviceVisits,
    quickUpdateComplaintStatus,
    submitServiceVisitAndUpdate,
  } = useApp();

  const complaint = complaints.find((c) => c.id === complaintId);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [showVisitModal, setShowVisitModal] = useState(false);

  const todayDefault = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeDefault = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const [visitDate, setVisitDate] = useState(todayDefault);
  const [visitTime, setVisitTime] = useState(timeDefault);
  const [workPerformed, setWorkPerformed] = useState('');
  const [serviceNotes, setServiceNotes] = useState('');
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [statusAfterVisit, setStatusAfterVisit] = useState<
    'In Progress' | 'Pending – Spare Parts Required' | 'Resolved'
  >('In Progress');
  const [visitImages, setVisitImages] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  if (!complaint) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-sm font-semibold text-navy-900">Complaint not found.</p>
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-4 rounded-xl bg-navy-900 text-white text-xs font-semibold"
        >
          Back
        </button>
      </div>
    );
  }

  const machine = machines.find((m) => m.id === complaint.machineId);
  const visits = serviceVisits.filter((v) => v.complaintId === complaint.id);

  const openVisitFormWithStatus = (
    targetStatus: 'In Progress' | 'Pending – Spare Parts Required' | 'Resolved'
  ) => {
    setStatusAfterVisit(targetStatus);
    setFormError(null);
    setShowVisitModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setVisitImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workPerformed.trim().length < 5) {
      setFormError('Please summarize the work performed.');
      return;
    }
    if (serviceNotes.trim().length < 5) {
      setFormError('Please enter service inspection notes.');
      return;
    }
    if (statusAfterVisit === 'Resolved' && resolutionDetails.trim().length < 5) {
      setFormError('Please provide resolution details before marking as Resolved.');
      return;
    }

    setFormError(null);
    submitServiceVisitAndUpdate({
      complaintId: complaint.id,
      visitDate,
      visitTime,
      serviceNotes,
      workPerformed,
      resolutionDetails,
      statusAfterVisit,
      images: visitImages,
    });

    setWorkPerformed('');
    setServiceNotes('');
    setResolutionDetails('');
    setVisitImages([]);
    setShowVisitModal(false);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${customer.company} ${customer.address}`
  )}`;

  return (
    <div className="space-y-4 pb-4">
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-2 -ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={() =>
            openVisitFormWithStatus(
              complaint.status === 'Resolved' ? 'Resolved' : 'In Progress'
            )
          }
          className="min-h-[40px] px-3.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          + Log Visit
        </button>
      </div>

      {/* Complaint & Machine Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold text-navy-900 tabular-nums">
            {complaint.id} · {complaint.registeredDate}
          </span>
          <ComplaintStatusText status={complaint.status} />
        </div>

        <div className="space-y-1">
          <h1 className="text-lg font-bold text-navy-900">{complaint.subject}</h1>
          <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
            <span>{complaint.category}</span>
            <span aria-hidden="true">·</span>
            <PriorityText priority={complaint.priority} />
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">{complaint.description}</p>

        <div className="rounded-2xl bg-slate-50 p-3 space-y-2 text-xs">
          <div>
            <span className="text-slate-500 text-[11px] block">Machine</span>
            <span className="font-bold text-navy-900">
              {machine?.name || complaint.machineId}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 text-[11px] block">Model</span>
              <span className="font-mono font-semibold text-navy-900">
                {machine?.model}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Serial No.</span>
              <span className="font-mono font-semibold text-navy-900 tabular-nums">
                {machine?.serialNumber}
              </span>
            </div>
          </div>
        </div>

        {complaint.images.length > 0 && (
          <div className="space-y-2 pt-1">
            <h2 className="text-xs font-bold text-navy-900">Customer Uploaded Photos</h2>
            <div className="grid grid-cols-3 gap-2">
              {complaint.images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxSrc(src)}
                  className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                >
                  <img
                    src={src}
                    alt={`Customer upload ${i + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Engineer Status Actions */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="block text-xs font-bold text-slate-600">
            Update Complaint Status
          </span>
          <button
            type="button"
            onClick={() =>
              quickUpdateComplaintStatus(
                complaint.id,
                'In Progress',
                'Engineer started on-site diagnostic inspection.'
              )
            }
            disabled={complaint.status === 'In Progress'}
            className="w-full min-h-[46px] px-3 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white text-xs font-semibold disabled:opacity-45"
          >
            <Play className="w-4 h-4 shrink-0" />
            <span>Start Service</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                openVisitFormWithStatus('Pending – Spare Parts Required')
              }
              className="min-h-[44px] px-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 text-white text-xs font-semibold"
            >
              <Package className="w-4 h-4 shrink-0" />
              <span>Spare Parts Req.</span>
            </button>

            <button
              type="button"
              onClick={() => openVisitFormWithStatus('Resolved')}
              className="min-h-[44px] px-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-green-600 text-white text-xs font-semibold"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Mark Resolved</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Contact Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3">
        <h2 className="text-sm font-bold text-navy-900">Customer Contact</h2>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-navy-900 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-navy-900">{customer.name}</div>
              <div className="text-slate-600">{customer.company}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-mono font-semibold text-navy-900 tabular-nums">
              +91 {customer.mobile}
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <span className="text-slate-600 leading-relaxed">{customer.address}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={`tel:+91${customer.mobile}`}
            className="min-h-[44px] flex items-center justify-center gap-1.5 rounded-xl bg-navy-900 text-white text-xs font-semibold"
          >
            <Phone className="w-4 h-4" />
            <span>Call Customer</span>
          </a>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-navy-900 text-xs font-semibold"
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Open Location</span>
          </a>
        </div>
      </div>

      {/* Previous Service Visits */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3">
        <h2 className="text-sm font-bold text-navy-900">
          Service Visits &amp; Updates ({visits.length})
        </h2>
        {visits.length === 0 ? (
          <div className="py-2 text-xs text-slate-500 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>No service visits logged yet.</span>
          </div>
        ) : (
          <div className="space-y-3 divide-y divide-slate-100">
            {visits.map((v) => (
              <div key={v.id} className="pt-3 first:pt-0 space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-navy-900 inline-flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-blue-600" />
                    <span>{v.visitDate}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    {v.visitTime}
                  </span>
                </div>
                <p className="text-slate-800">
                  <strong>Work:</strong> {v.workPerformed}
                </p>
                <p className="text-slate-600">
                  <strong>Notes:</strong> {v.serviceNotes}
                </p>
                {v.resolutionDetails && (
                  <p className="text-green-800">
                    <strong>Resolution:</strong> {v.resolutionDetails}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Visit Update Mobile Bottom Sheet */}
      {showVisitModal && (
        <div
          className="absolute inset-0 z-50 flex items-end justify-center bg-navy-950/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Service Visit Update"
        >
          <div className="w-full bg-white rounded-t-3xl shadow-2xl max-h-[90%] flex flex-col overflow-hidden">
            <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 shrink-0" />

            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-navy-900">
                  Log Service Visit Update
                </h2>
                <p className="text-[11px] text-slate-500 font-mono tabular-nums">
                  {complaint.id} · {machine?.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowVisitModal(false)}
                aria-label="Close form"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleVisitSubmit}
              className="p-4 overflow-y-auto space-y-3.5"
            >
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label
                    htmlFor="visit-date"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Visit Date
                  </label>
                  <input
                    id="visit-date"
                    type="text"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 text-xs font-medium tabular-nums"
                  />
                </div>
                <div>
                  <label
                    htmlFor="visit-time"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Visit Time
                  </label>
                  <input
                    id="visit-time"
                    type="text"
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 text-xs font-medium tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="visit-status"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Update Status
                </label>
                <select
                  id="visit-status"
                  value={statusAfterVisit}
                  onChange={(e) =>
                    setStatusAfterVisit(
                      e.target.value as
                        | 'In Progress'
                        | 'Pending – Spare Parts Required'
                        | 'Resolved'
                    )
                  }
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-navy-900"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Pending – Spare Parts Required">
                    Pending – Spare Parts Required
                  </option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="visit-work"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Work Performed
                </label>
                <input
                  id="visit-work"
                  type="text"
                  value={workPerformed}
                  onChange={(e) => {
                    setWorkPerformed(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="e.g. Tested SSR relay & replaced thermocouple"
                  className="w-full min-h-[44px] px-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label
                  htmlFor="visit-notes"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Service Notes
                </label>
                <textarea
                  id="visit-notes"
                  rows={3}
                  value={serviceNotes}
                  onChange={(e) => {
                    setServiceNotes(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="Observations, readings, or spare parts needed..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {statusAfterVisit === 'Resolved' && (
                <div>
                  <label
                    htmlFor="visit-resolution"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Resolution Details
                  </label>
                  <textarea
                    id="visit-resolution"
                    rows={2}
                    value={resolutionDetails}
                    onChange={(e) => {
                      setResolutionDetails(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="Confirm final test run & resolution..."
                    className="w-full p-3 rounded-xl border border-green-200 bg-green-50/40 text-xs"
                  />
                </div>
              )}

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-700">
                  Additional Images (Optional)
                </span>
                <label className="min-h-[56px] flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer text-xs font-semibold text-navy-900">
                  <ImagePlus className="w-4 h-4 text-blue-600" />
                  <span>Attach Repair Photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {visitImages.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {visitImages.map((src, i) => (
                      <div
                        key={i}
                        className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200"
                      >
                        <img
                          src={src}
                          alt="Visit preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setVisitImages((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          aria-label="Remove photo"
                          className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-navy-950/75 text-white flex items-center justify-center"
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
                className="w-full min-h-[48px] rounded-xl bg-navy-900 text-white text-sm font-semibold"
              >
                Save Service Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
