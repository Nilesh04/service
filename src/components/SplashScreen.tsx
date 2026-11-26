import { BrandLogo } from './BrandLogo';

export function SplashScreen() {
  return (
    <div className="h-full w-full bg-navy-900 text-white flex flex-col items-center justify-between p-8">
      <div />
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="p-5 rounded-3xl bg-white/10 border border-white/15 shadow-xl">
          <BrandLogo size="lg" light />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-blue-200 tracking-wide">
            Your Machinery. Our Support.
          </p>
          <p className="text-xs text-slate-300">
            Plastic Processing &amp; Pipe Extrusion Service
          </p>
        </div>

        {/* Loading indicator */}
        <div className="w-40 h-1.5 bg-white/15 rounded-full overflow-hidden mt-3">
          <div className="h-full bg-blue-400 rounded-full animate-[loadingBar_1.3s_ease-in-out_infinite]" />
        </div>
      </div>

      <p className="text-[11px] text-slate-400">Industrial After-Sales &amp; Field Service</p>

      <style>{`
        @keyframes loadingBar {
          0% { width: 15%; transform: translateX(-20%); }
          50% { width: 65%; transform: translateX(40%); }
          100% { width: 25%; transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
