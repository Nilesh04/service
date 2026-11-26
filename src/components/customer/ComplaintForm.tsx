import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ImagePlus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Complaint, ComplaintCategory, PriorityLevel } from '../../types';

interface ComplaintFormProps {
  initialMachineId?: string;
  onBack: () => void;
  onViewComplaint: (complaintId: string) => void;
  onDoneToDashboard: () => void;
}

const CATEGORIES: ComplaintCategory[] = [
  'Mechanical Issue',
  'Electrical Issue',
  'Hydraulic Issue',
  'Production Issue',
  'Software/Control Issue',
  'Other',
];

const PRIORITIES: PriorityLevel[] = ['Low', 'Medium', 'High', 'Critical'];

export function ComplaintForm({
  initialMachineId,
  onBack,
  onViewComplaint,
  onDoneToDashboard,
}: ComplaintFormProps) {
  const { machines, registerComplaint, showToast } = useApp();

  const [machineId, setMachineId] = useState(initialMachineId || machines[0]?.id || 'PEM-001');
  const [category, setCategory] = useState<ComplaintCategory>('Mechanical Issue');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

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

  const handleAddSamplePhoto = () => {
    const sample = '/src/assets/images/complaint_motor_overheat_1795676017674.jpg';
    if (!images.includes(sample)) {
      setImages((prev) => [...prev, sample]);
      showToast('Attached sample machine inspection photo');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineId) {
      setError('Please select a machine.');
      return;
    }
    if (subject.trim().length < 5) {
      setError('Please enter a concise complaint subject (at least 5 characters).');
      return;
    }
    if (description.trim().length < 10) {
      setError('Please describe the issue in detail (at least 10 characters).');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const created = registerComplaint({
        machineId,
        category,
        subject,
        description,
        priority,
        images,
      });
      setIsSubmitting(false);
      setSubmittedComplaint(created);
      showToast(`Complaint ${created.id} registered successfully`);
    }, 350);
  };

  if (submittedComplaint) {
    const machine = machines.find((m) => m.id === submittedComplaint.machineId);
    return (
      <div className="max-w-lg mx-auto py-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-navy-900">
              Complaint Registered Successfully
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Your service request has been logged and queued for engineer assignment.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Complaint ID</span>
              <span className="font-mono font-bold text-sm text-navy-900 tabular-nums">
                {submittedComplaint.id}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Machine</span>
              <span className="font-semibold text-navy-900">
                {machine?.name} ({submittedComplaint.machineId})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Initial Status</span>
              <span className="font-semibold text-orange-700">Pending Assignment</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Priority</span>
              <span className="font-semibold text-navy-900">{submittedComplaint.priority}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => onViewComplaint(submittedComplaint.id)}
              className="w-full min-h-[48px] rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              View Complaint Details
            </button>
            <button
              type="button"
              onClick={onDoneToDashboard}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white text-navy-900 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3 -ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        <div>
          <h1 className="text-xl font-bold text-navy-900">Register New Complaint</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Provide machine details and fault symptoms for rapid engineer dispatch.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Machine */}
          <div>
            <label
              htmlFor="complaint-machine"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Select Machine
            </label>
            <select
              id="complaint-machine"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              className="w-full min-h-[48px] px-3.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.id} · {m.model})
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="complaint-category"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Complaint Category
            </label>
            <select
              id="complaint-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              className="w-full min-h-[48px] px-3.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="complaint-subject"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Complaint Subject
            </label>
            <input
              id="complaint-subject"
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Extruder feed hopper vibration & abnormal sound"
              className="w-full min-h-[48px] px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label
              htmlFor="complaint-description"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Detailed Complaint Description
            </label>
            <textarea
              id="complaint-description"
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Describe operating temperature, fault codes, production speed, and when the issue began..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Priority */}
          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">
              Priority Level
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRIORITIES.map((lvl) => {
                const isActive = priority === lvl;
                const activeStyle =
                  lvl === 'Critical'
                    ? 'bg-red-600 text-white border-red-600'
                    : lvl === 'High'
                    ? 'bg-orange-600 text-white border-orange-600'
                    : lvl === 'Medium'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-navy-900 text-white border-navy-900';

                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`min-h-[44px] rounded-xl border text-xs font-semibold transition-colors ${
                      isActive
                        ? activeStyle
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Images */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Upload Machine / Fault Images
              </span>
              <button
                type="button"
                onClick={handleAddSamplePhoto}
                className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Use Sample Photo</span>
              </button>
            </div>

            <label className="min-h-[84px] flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/70 p-4 cursor-pointer transition-colors">
              <ImagePlus className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-semibold text-navy-900">
                Tap to attach multiple photos
              </span>
              <span className="text-[11px] text-slate-500">JPG, PNG from camera or gallery</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {images.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    <img
                      src={src}
                      alt={`Attachment ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      aria-label="Remove image"
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-navy-950/75 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[48px] rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? 'Submitting Complaint...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
}
