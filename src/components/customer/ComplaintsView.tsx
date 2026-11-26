import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Phone,
  Plus,
  Star,
  UserCheck,
  Wrench,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ComplaintFeedback, ComplaintStatus } from '../../types';
import { ImageLightbox } from '../ImageLightbox';
import { ComplaintStatusText, PriorityText } from '../StatusText';

interface ComplaintsViewProps {
  selectedComplaintId: string | null;
  onSelectComplaint: (id: string | null) => void;
  onNewComplaint: () => void;
}

const STATUS_FILTERS: Array<'All' | ComplaintStatus> = [
  'All',
  'Pending Assignment',
  'Assigned',
  'In Progress',
  'Pending – Spare Parts Required',
  'Resolved',
];

export function ComplaintsView({
  selectedComplaintId,
  onSelectComplaint,
  onNewComplaint,
}: ComplaintsViewProps) {
  const {
    complaints,
    machines,
    engineers,
    serviceVisits,
    submitComplaintFeedback,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | ComplaintStatus>('All');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const [rating, setRating] = useState<number>(5);
  const [serviceExperience, setServiceExperience] =
    useState<ComplaintFeedback['serviceExperience']>('Excellent');
  const [engineerBehaviour, setEngineerBehaviour] =
    useState<ComplaintFeedback['engineerBehaviour']>('Professional & Helpful');
  const [comments, setComments] = useState('');

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId) || null;

  if (selectedComplaint) {
    const machine = machines.find((m) => m.id === selectedComplaint.machineId);
    const engineer = engineers.find(
      (e) => e.employeeId === selectedComplaint.assignedEngineerId
    );
    const visits = serviceVisits.filter(
      (v) => v.complaintId === selectedComplaint.id
    );

    const hasSpareHold =
      selectedComplaint.status === 'Pending – Spare Parts Required' ||
      selectedComplaint.timeline.some(
        (t) => t.status === 'Pending – Spare Parts Required'
      );

    const milestones = hasSpareHold
      ? [
          'Complaint Registered',
          'Assigned',
          'In Progress',
          'Pending – Spare Parts Required',
          'Resolved',
        ]
      : ['Complaint Registered', 'Assigned', 'In Progress', 'Resolved'];

    const currentRank =
      selectedComplaint.status === 'Pending Assignment'
        ? 0
        : selectedComplaint.status === 'Assigned'
        ? 1
        : selectedComplaint.status === 'In Progress'
        ? 2
        : selectedComplaint.status === 'Pending – Spare Parts Required'
        ? 3
        : milestones.length - 1;

    const handleFeedbackSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      submitComplaintFeedback(selectedComplaint.id, {
        rating,
        serviceExperience,
        engineerBehaviour,
        comments: comments.trim() || 'Prompt diagnostics and thorough repair.',
      });
      setComments('');
    };

    return (
      <div className="space-y-4 pb-4">
        <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />

        <button
          type="button"
          onClick={() => onSelectComplaint(null)}
          className="min-h-[44px] px-2 -ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Complaints</span>
        </button>

        {/* Complaint Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3.5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold text-navy-900 tabular-nums">
              {selectedComplaint.id} · {selectedComplaint.registeredDate}
            </span>
            <ComplaintStatusText status={selectedComplaint.status} />
          </div>

          <div className="space-y-1">
            <h1 className="text-lg font-bold text-navy-900">
              {selectedComplaint.subject}
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
              <span>{selectedComplaint.category}</span>
              <span aria-hidden="true">·</span>
              <PriorityText priority={selectedComplaint.priority} />
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            {selectedComplaint.description}
          </p>

          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 space-y-0.5">
              <span className="text-slate-500 text-[11px] block">Machine Details</span>
              <div className="font-bold text-navy-900">
                {machine?.name || selectedComplaint.machineId}
              </div>
              <div className="font-mono text-slate-600 tabular-nums">
                {selectedComplaint.machineId} · Model {machine?.model}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 space-y-0.5">
              <span className="text-slate-500 text-[11px] block">Assigned Engineer</span>
              {engineer ? (
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-navy-900 inline-flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>{engineer.name}</span>
                    </div>
                    <div className="text-slate-600 font-mono text-[11px] tabular-nums">
                      {engineer.employeeId} · {engineer.designation}
                    </div>
                  </div>
                  <a
                    href={`tel:${engineer.mobile}`}
                    className="min-h-[40px] min-w-[40px] rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0"
                    aria-label={`Call ${engineer.name}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="font-semibold text-orange-700">
                  Awaiting engineer assignment
                </div>
              )}
            </div>
          </div>

          {selectedComplaint.images.length > 0 && (
            <div className="space-y-2 pt-1">
              <h2 className="text-xs font-bold text-navy-900">Uploaded Photos</h2>
              <div className="grid grid-cols-3 gap-2">
                {selectedComplaint.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxSrc(img)}
                    className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    <img
                      src={img}
                      alt={`Complaint photo ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedComplaint.resolutionDetails && (
            <div className="rounded-2xl bg-green-50 border border-green-200 p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-green-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Resolution Summary</span>
              </div>
              <p className="text-xs text-green-900 leading-relaxed">
                {selectedComplaint.resolutionDetails}
              </p>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-4">
          <h2 className="text-sm font-bold text-navy-900">Complaint Status Timeline</h2>

          <div className="space-y-2.5">
            {milestones.map((step, index) => {
              const completed = index <= currentRank;
              const isCurrent = index === currentRank;
              return (
                <div key={step} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    {completed ? (
                      <CheckCircle2
                        className={`w-5 h-5 shrink-0 ${
                          step === 'Pending – Spare Parts Required'
                            ? 'text-orange-600'
                            : step === 'Resolved'
                            ? 'text-green-600'
                            : 'text-blue-600'
                        }`}
                      />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    {index < milestones.length - 1 && (
                      <div
                        className={`w-0.5 h-5 mt-1 ${
                          index < currentRank ? 'bg-blue-500' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-1">
                    <div
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-navy-900'
                          : completed
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {step}
                    </div>
                    {isCurrent && (
                      <p className="text-[11px] text-slate-500">Current stage</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-500">Activity Log</h3>
            {selectedComplaint.timeline.map((event) => (
              <div key={event.id} className="text-xs space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-navy-900">{event.status}</span>
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {event.timestamp}
                  </span>
                </div>
                <p className="text-slate-600">{event.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Visit Notes */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3">
          <h2 className="text-sm font-bold text-navy-900">
            Service Visit Notes ({visits.length})
          </h2>
          {visits.length === 0 ? (
            <div className="py-2 text-xs text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>No field engineer visit logged yet.</span>
            </div>
          ) : (
            <div className="space-y-3 divide-y divide-slate-100">
              {visits.map((v) => (
                <div key={v.id} className="pt-3 first:pt-0 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-navy-900 inline-flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      <span>{v.engineerName}</span>
                    </span>
                    <span className="text-[11px] text-slate-500 tabular-nums">
                      {v.visitDate} · {v.visitTime}
                    </span>
                  </div>
                  <p className="text-slate-800">
                    <strong>Work:</strong> {v.workPerformed}
                  </p>
                  <p className="text-slate-600">
                    <strong>Notes:</strong> {v.serviceNotes}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Feedback */}
        {selectedComplaint.status === 'Resolved' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3.5">
            {selectedComplaint.feedback ? (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Thank You for Your Feedback!</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= selectedComplaint.feedback!.rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs font-semibold text-navy-900 tabular-nums">
                    {selectedComplaint.feedback.rating}/5
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p>
                    <strong>Experience:</strong> {selectedComplaint.feedback.serviceExperience}
                  </p>
                  <p>
                    <strong>Engineer:</strong> {selectedComplaint.feedback.engineerBehaviour}
                  </p>
                  <p>
                    <strong>Comments:</strong> {selectedComplaint.feedback.comments}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
                <div>
                  <h2 className="text-sm font-bold text-navy-900">Rate Service Experience</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Share feedback on the resolved service visit.
                  </p>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1">
                    Rating
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        aria-label={`Rate ${star} stars`}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label
                      htmlFor="fb-exp"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Experience
                    </label>
                    <select
                      id="fb-exp"
                      value={serviceExperience}
                      onChange={(e) =>
                        setServiceExperience(
                          e.target.value as ComplaintFeedback['serviceExperience']
                        )
                      }
                      className="w-full min-h-[44px] px-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-navy-900"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="fb-beh"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Engineer
                    </label>
                    <select
                      id="fb-beh"
                      value={engineerBehaviour}
                      onChange={(e) =>
                        setEngineerBehaviour(
                          e.target.value as ComplaintFeedback['engineerBehaviour']
                        )
                      }
                      className="w-full min-h-[44px] px-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-navy-900"
                    >
                      <option value="Professional & Helpful">Professional</option>
                      <option value="Polite">Polite</option>
                      <option value="Satisfactory">Satisfactory</option>
                      <option value="Needs Improvement">Needs Improvement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="fb-comments"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Comments
                  </label>
                  <textarea
                    id="fb-comments"
                    rows={2}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Share comments on repair quality..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[48px] rounded-xl bg-navy-900 text-white text-sm font-semibold"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    );
  }

  const filtered =
    statusFilter === 'All'
      ? complaints
      : complaints.filter((c) => c.status === statusFilter);

  return (
    <div className="space-y-4 pb-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-navy-900">My Complaints</h1>
          <p className="text-xs text-slate-500 tabular-nums">
            {complaints.length} service tickets
          </p>
        </div>
        <button
          type="button"
          onClick={onNewComplaint}
          className="min-h-[40px] px-3.5 inline-flex items-center gap-1 rounded-xl bg-blue-600 text-white text-xs font-semibold shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New</span>
        </button>
      </div>

      {/* Horizontal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {STATUS_FILTERS.map((status) => {
          const active = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`min-h-[38px] px-3 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-navy-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-1">
          <p className="text-sm font-semibold text-navy-900">
            No complaints under "{statusFilter}"
          </p>
          <p className="text-xs text-slate-500">Select another status filter above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const machine = machines.find((m) => m.id === c.machineId);
            const eng = engineers.find(
              (e) => e.employeeId === c.assignedEngineerId
            );
            return (
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
                    {machine?.name || c.machineId}
                    {eng ? ` · ${eng.name}` : ' · Unassigned'}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
