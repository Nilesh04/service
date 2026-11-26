import { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  HardHat,
  KeyRound,
  Phone,
  QrCode,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { BrandLogo } from './BrandLogo';

interface LoginScreenProps {
  pendingQrMachineId: string | null;
  onOpenQrScanner: () => void;
  onLoginSuccess: () => void;
}

export function LoginScreen({
  pendingQrMachineId,
  onOpenQrScanner,
  onLoginSuccess,
}: LoginScreenProps) {
  const { loginAsCustomer, loginAsEngineer, showToast } = useApp();
  const [roleTab, setRoleTab] = useState<UserRole>('customer');

  // Customer OTP flow state
  const [mobile, setMobile] = useState('9876543210');
  const [otpStep, setOtpStep] = useState<'mobile' | 'otp'>('mobile');
  const [otp, setOtp] = useState('');
  const [customerError, setCustomerError] = useState<string | null>(null);

  // Engineer credential flow state
  const [employeeId, setEmployeeId] = useState('ENG001');
  const [password, setPassword] = useState('123456');
  const [engineerError, setEngineerError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomerContinue = () => {
    const cleaned = mobile.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setCustomerError('Enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }
    setCustomerError(null);
    setOtpStep('otp');
    showToast('Demo OTP 123456 sent to +91 ' + cleaned);
  };

  const handleVerifyOtp = () => {
    if (otp.trim() !== '123456') {
      setCustomerError('Invalid OTP. Please enter demo OTP 123456.');
      return;
    }
    setCustomerError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      loginAsCustomer();
      setIsSubmitting(false);
      onLoginSuccess();
    }, 250);
  };

  const handleEngineerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const idClean = employeeId.trim().toUpperCase();
    if (!idClean || !password.trim()) {
      setEngineerError('Employee ID and password are required.');
      return;
    }
    if ((idClean !== 'ENG001' && idClean !== 'ENG002') || password !== '123456') {
      setEngineerError('Invalid credentials. Use Employee ID ENG001 and Password 123456.');
      return;
    }
    setEngineerError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      loginAsEngineer(idClean);
      setIsSubmitting(false);
      onLoginSuccess();
    }, 250);
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col overflow-y-auto">
      {/* Mobile Navy Header Banner */}
      <div className="bg-navy-900 text-white px-5 pt-7 pb-6 rounded-b-3xl shadow-sm space-y-4 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <BrandLogo size="md" light showTagline />
        </div>

        {pendingQrMachineId && (
          <div className="rounded-xl bg-blue-500/20 border border-blue-400/30 p-3 text-xs text-blue-100 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-blue-300 shrink-0" />
            <span>
              Scanned <strong className="font-mono text-white">{pendingQrMachineId}</strong>. Sign in as Customer to continue.
            </span>
          </div>
        )}
      </div>

      {/* Mobile Auth Form Body */}
      <div className="flex-1 p-4 space-y-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-5">
          {/* Role Segmented Control */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setRoleTab('customer');
                setCustomerError(null);
              }}
              className={`min-h-[44px] flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                roleTab === 'customer'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRoleTab('engineer');
                setEngineerError(null);
              }}
              className={`min-h-[44px] flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                roleTab === 'engineer'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>Engineer</span>
            </button>
          </div>

          {roleTab === 'customer' ? (
            <div className="space-y-4">
              <div>
                <h1 className="text-lg font-bold text-navy-900">Customer Sign In</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify your registered mobile number with OTP.
                </p>
              </div>

              {otpStep === 'mobile' ? (
                <div className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="customer-mobile"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Mobile Number
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-sm font-semibold text-slate-500 border-r border-slate-200 pr-2.5">
                        +91
                      </span>
                      <input
                        id="customer-mobile"
                        type="tel"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value.replace(/\D/g, ''));
                          setCustomerError(null);
                        }}
                        placeholder="9876543210"
                        className="w-full min-h-[48px] pl-16 pr-10 rounded-xl border border-slate-200 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3.5" />
                    </div>
                  </div>

                  {customerError && (
                    <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{customerError}</span>
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleCustomerContinue}
                    className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-semibold active:scale-[0.99] transition-all"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 flex items-center justify-between text-xs">
                    <span className="text-slate-700">
                      OTP sent to <strong className="font-mono">+91 {mobile}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep('mobile');
                        setOtp('');
                        setCustomerError(null);
                      }}
                      className="text-blue-600 font-semibold"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="customer-otp"
                        className="block text-xs font-semibold text-slate-700"
                      >
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtp('123456')}
                        className="text-xs font-semibold text-blue-600"
                      >
                        Fill 123456
                      </button>
                    </div>
                    <input
                      id="customer-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ''));
                        setCustomerError(null);
                      }}
                      placeholder="123456"
                      className="w-full min-h-[48px] px-4 rounded-xl border border-slate-200 text-base tracking-[0.35em] text-center font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <p className="text-[11px] text-slate-500 mt-1.5">Demo OTP: 123456</p>
                  </div>

                  {customerError && (
                    <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{customerError}</span>
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleVerifyOtp}
                    className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-60 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isSubmitting ? 'Verifying...' : 'Verify & Login'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleEngineerLogin} className="space-y-3.5">
              <div>
                <h1 className="text-lg font-bold text-navy-900">Service Engineer Login</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign in to manage assigned field jobs.
                </p>
              </div>

              <div>
                <label
                  htmlFor="eng-id"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Employee ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="eng-id"
                    type="text"
                    value={employeeId}
                    onChange={(e) => {
                      setEmployeeId(e.target.value.toUpperCase());
                      setEngineerError(null);
                    }}
                    placeholder="ENG001"
                    className="w-full min-h-[48px] pl-10 pr-4 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="eng-password"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="eng-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setEngineerError(null);
                    }}
                    placeholder="••••••"
                    className="w-full min-h-[48px] pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Demo: ENG001 / 123456
                </p>
              </div>

              {engineerError && (
                <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{engineerError}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-navy-900 text-white text-sm font-semibold disabled:opacity-60 transition-all"
              >
                <span>{isSubmitting ? 'Signing in...' : 'Login'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
