import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Package,
  QrCode,
  Search,
  Wrench,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Machine } from '../types';
import { WarrantyText } from './StatusText';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onRequireLogin: (machineId: string) => void;
  onSelectComplaint: (machineId: string) => void;
  onSelectSparePart: (machineId: string) => void;
  onViewMachineDetail: (machineId: string) => void;
}

export function QRScannerModal({
  isOpen,
  onClose,
  isAuthenticated,
  onRequireLogin,
  onSelectComplaint,
  onSelectSparePart,
  onViewMachineDetail,
}: QRScannerModalProps) {
  const { machines } = useApp();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<'starting' | 'active' | 'unavailable'>('starting');
  const [manualId, setManualId] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [scannedMachine, setScannedMachine] = useState<Machine | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScannedMachine(null);
      setManualId('');
      setLookupError(null);
      return;
    }

    let cancelled = false;
    let rafId: number | null = null;

    const startCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (!cancelled) setCameraState('unavailable');
        return;
      }

      setCameraState('starting');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraState('active');

        const BarcodeDetectorCtor = (window as unknown as {
          BarcodeDetector?: new (opts: { formats: string[] }) => {
            detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
          };
        }).BarcodeDetector;

        if (BarcodeDetectorCtor && videoRef.current) {
          const detector = new BarcodeDetectorCtor({ formats: ['qr_code'] });
          const scanLoop = async () => {
            if (cancelled || !videoRef.current) return;
            try {
              const results = await detector.detect(videoRef.current);
              if (results.length > 0 && results[0].rawValue) {
                const rawCode = results[0].rawValue.trim().toUpperCase();
                const found = machines.find((m) => m.id.toUpperCase() === rawCode);
                if (found) {
                  setScannedMachine(found);
                  stopCamera();
                  return;
                }
              }
            } catch {
              // Keep polling
            }
            rafId = requestAnimationFrame(scanLoop);
          };
          rafId = requestAnimationFrame(scanLoop);
        }
      } catch {
        if (!cancelled) setCameraState('unavailable');
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      stopCamera();
    };
  }, [isOpen, machines]);

  if (!isOpen) return null;

  const handleLookup = (idValue: string) => {
    const clean = idValue.trim().toUpperCase();
    if (!clean) {
      setLookupError('Please enter a Machine ID such as PEM-001.');
      return;
    }
    const found = machines.find((m) => m.id.toUpperCase() === clean);
    if (!found) {
      setLookupError(`No registered machine found matching "${clean}". Try PEM-001, PIM-002, or PVC-003.`);
      return;
    }
    setLookupError(null);
    stopCamera();
    setScannedMachine(found);
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-navy-950/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Scan Machine QR Code"
    >
      <div className="w-full bg-white rounded-t-3xl shadow-2xl overflow-hidden max-h-[90%] flex flex-col">
        {/* Grab handle */}
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 shrink-0" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-navy-900 text-white flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-navy-900">Scan Machine QR</h2>
              <p className="text-xs text-slate-500">Identify equipment &amp; start service</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close scanner"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          {!scannedMachine ? (
            <>
              {/* Camera Viewfinder */}
              <div className="relative rounded-2xl overflow-hidden bg-navy-950 aspect-[16/10] flex items-center justify-center border border-slate-200">
                {cameraState === 'active' ? (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-44 h-44 border-2 border-blue-400 rounded-2xl relative shadow-[0_0_0_9999px_rgba(9,23,43,0.45)]">
                        <div className="absolute inset-x-2 top-1/2 h-0.5 bg-blue-400/90" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center px-6 py-6 text-white space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center">
                      <Camera className="w-6 h-6 text-blue-300" />
                    </div>
                    <p className="text-sm font-semibold">
                      {cameraState === 'starting'
                        ? 'Initializing camera scanner...'
                        : 'Camera access unavailable in this browser'}
                    </p>
                    <p className="text-xs text-slate-300 max-w-xs mx-auto">
                      Use a quick demo scan below or enter the Machine ID printed on the machine nameplate.
                    </p>
                  </div>
                )}
              </div>

              {/* Manual Machine ID Entry */}
              <div className="space-y-2">
                <label
                  htmlFor="manual-qr-input"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Enter Machine ID Manually
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="manual-qr-input"
                      type="text"
                      value={manualId}
                      onChange={(e) => {
                        setManualId(e.target.value);
                        if (lookupError) setLookupError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleLookup(manualId);
                      }}
                      placeholder="e.g. PEM-001"
                      className="w-full min-h-[44px] pl-10 pr-3 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLookup(manualId)}
                    className="min-h-[44px] px-4 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
                  >
                    Identify
                  </button>
                </div>
                {lookupError && (
                  <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{lookupError}</span>
                  </p>
                )}
              </div>

              {/* Simulated QR Demo Buttons */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-600">
                  Simulate QR Scan (Demo Machines)
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {machines.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleLookup(m.id)}
                      className="min-h-[48px] flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-navy-900 truncate">
                          {m.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono tabular-nums">
                          {m.id} · Model {m.model}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 whitespace-nowrap shrink-0">
                        Scan QR
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Identified Machine Card */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Machine Identified via QR Code</span>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                <div className="aspect-[16/9] bg-slate-200 overflow-hidden">
                  <img
                    src={scannedMachine.imageUrl}
                    alt={scannedMachine.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-2 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-navy-900">{scannedMachine.name}</h3>
                    <span className="text-xs font-mono font-semibold text-navy-900 tabular-nums shrink-0">
                      {scannedMachine.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                    <span>Model {scannedMachine.model}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{scannedMachine.serialNumber}</span>
                    <span aria-hidden="true">·</span>
                    <WarrantyText status={scannedMachine.warrantyStatus} />
                  </div>
                  <p className="text-xs text-slate-500">{scannedMachine.location}</p>
                </div>
              </div>

              {!isAuthenticated ? (
                <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4 space-y-3">
                  <div className="text-sm font-semibold text-navy-900">
                    Customer Sign-In Required
                  </div>
                  <p className="text-xs text-slate-600">
                    Please sign in to your MachineCare customer account to register a complaint or request spare parts for{' '}
                    <span className="font-mono font-semibold">{scannedMachine.id}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => onRequireLogin(scannedMachine.id)}
                    className="w-full min-h-[44px] rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-colors"
                  >
                    Sign In to Continue
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectComplaint(scannedMachine.id)}
                    className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Register Complaint for {scannedMachine.id}</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => onSelectSparePart(scannedMachine.id)}
                      className="min-h-[44px] flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-navy-900 text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <Package className="w-4 h-4 text-blue-600" />
                      <span>Request Spare Part</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onViewMachineDetail(scannedMachine.id)}
                      className="min-h-[44px] flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-navy-900 text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <span>View Machine Info</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setScannedMachine(null);
                  setManualId('');
                }}
                className="w-full min-h-[40px] text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
              >
                Scan Another Machine
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
