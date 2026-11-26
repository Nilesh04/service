import { Cog, Wrench } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
  showTagline?: boolean;
}

export function BrandLogo({ size = 'md', light = false, showTagline = false }: BrandLogoProps) {
  const iconBox =
    size === 'lg'
      ? 'w-14 h-14 rounded-2xl'
      : size === 'sm'
      ? 'w-8 h-8 rounded-lg'
      : 'w-10 h-10 rounded-xl';

  const cogSize = size === 'lg' ? 'w-7 h-7' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const wrenchSize = size === 'lg' ? 'w-4 h-4' : size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3';

  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className={`relative flex items-center justify-center shrink-0 ${iconBox} ${
          light
            ? 'bg-white/15 border border-white/25 text-white'
            : 'bg-navy-900 text-white shadow-sm'
        }`}
      >
        <Cog className={cogSize} strokeWidth={2} />
        <Wrench
          className={`${wrenchSize} absolute -bottom-0.5 -right-0.5 bg-blue-600 text-white rounded-full p-0.5`}
          strokeWidth={2.5}
        />
      </div>
      <div className="min-w-0">
        <div
          className={`font-display font-bold tracking-tight whitespace-nowrap ${
            size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg'
          } ${light ? 'text-white' : 'text-navy-900'}`}
        >
          MachineCare
        </div>
        {showTagline && (
          <p className={`text-xs ${light ? 'text-blue-200' : 'text-slate-500'}`}>
            Support for your Machine
          </p>
        )}
      </div>
    </div>
  );
}
