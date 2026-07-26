import React from 'react';
import { BookOpen, Star, Award, Sparkles, Bookmark } from 'lucide-react';

interface BookCoverProps {
  title: string;
  author: string;
  publisher?: string;
  category?: string;
  coverColor?: string;
  rating?: number;
  isBest?: boolean;
  isRecommended?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const COLOR_MAP: Record<string, { bg: string; text: string; accent: string; spine: string }> = {
  emerald: {
    bg: 'from-emerald-800 via-emerald-900 to-slate-950',
    text: 'text-emerald-100',
    accent: 'border-emerald-400/40 bg-emerald-500/20 text-emerald-200',
    spine: 'bg-emerald-950/60',
  },
  indigo: {
    bg: 'from-indigo-900 via-slate-900 to-blue-950',
    text: 'text-indigo-100',
    accent: 'border-indigo-400/40 bg-indigo-500/20 text-indigo-200',
    spine: 'bg-indigo-950/60',
  },
  amber: {
    bg: 'from-amber-700 via-amber-900 to-amber-950',
    text: 'text-amber-100',
    accent: 'border-amber-400/40 bg-amber-500/20 text-amber-200',
    spine: 'bg-amber-950/60',
  },
  rose: {
    bg: 'from-rose-800 via-rose-950 to-slate-950',
    text: 'text-rose-100',
    accent: 'border-rose-400/40 bg-rose-500/20 text-rose-200',
    spine: 'bg-rose-950/60',
  },
  sky: {
    bg: 'from-sky-800 via-slate-900 to-blue-950',
    text: 'text-sky-100',
    accent: 'border-sky-400/40 bg-sky-500/20 text-sky-200',
    spine: 'bg-sky-950/60',
  },
  violet: {
    bg: 'from-violet-900 via-purple-950 to-slate-950',
    text: 'text-violet-100',
    accent: 'border-violet-400/40 bg-violet-500/20 text-violet-200',
    spine: 'bg-violet-950/60',
  },
  teal: {
    bg: 'from-teal-800 via-teal-950 to-slate-950',
    text: 'text-teal-100',
    accent: 'border-teal-400/40 bg-teal-500/20 text-teal-200',
    spine: 'bg-teal-950/60',
  },
  stone: {
    bg: 'from-stone-800 via-neutral-900 to-stone-950',
    text: 'text-stone-100',
    accent: 'border-stone-400/40 bg-stone-500/20 text-stone-200',
    spine: 'bg-stone-950/60',
  },
};

export const BookCover: React.FC<BookCoverProps> = ({
  title,
  author,
  publisher,
  category = '문학/소설',
  coverColor,
  rating,
  isBest,
  isRecommended,
  size = 'md',
  className = '',
}) => {
  // Determine color theme based on provided color or book title hash
  const getThemeColorKey = () => {
    if (coverColor && COLOR_MAP[coverColor]) return coverColor;
    const keys = Object.keys(COLOR_MAP);
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return keys[Math.abs(hash) % keys.length];
  };

  const themeKey = getThemeColorKey();
  const theme = COLOR_MAP[themeKey] || COLOR_MAP.emerald;

  const sizeClasses = {
    sm: 'w-24 h-36 p-2 text-xs',
    md: 'w-36 h-52 sm:w-40 sm:h-56 p-3 text-xs',
    lg: 'w-48 h-72 p-4 text-sm',
  }[size];

  return (
    <div
      className={`relative rounded-r-xl rounded-l-sm bg-gradient-to-br ${theme.bg} text-white shadow-xl flex flex-col justify-between overflow-hidden group select-none transition-all duration-300 transform group-hover:scale-[1.02] ${sizeClasses} ${className}`}
      style={{
        boxShadow: '3px 6px 16px rgba(0, 0, 0, 0.28), -1px 0px 3px rgba(0,0,0,0.2) inset',
      }}
    >
      {/* 3D Spine Simulation Overlay */}
      <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-20 border-r border-white/10" />
      <div className="absolute top-0 bottom-0 left-3 w-1 bg-white/10 z-20" />

      {/* Background Decorative Book Frame */}
      <div className="absolute inset-1.5 border border-white/15 rounded-r-lg rounded-l-xs pointer-events-none z-10" />

      {/* Top Badge Section */}
      <div className="relative z-20 pl-2">
        <div className="flex items-center justify-between gap-1">
          <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded border ${theme.accent} tracking-tight`}>
            {category}
          </span>

          {isBest && (
            <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded flex items-center space-x-0.5 shadow-sm">
              <Award className="w-2.5 h-2.5" />
              <span>BEST</span>
            </span>
          )}
        </div>
      </div>

      {/* Middle Book Title Section */}
      <div className="relative z-20 my-auto pl-2 pr-1 py-1">
        <h4 className={`font-black tracking-tight leading-snug drop-shadow-md text-white line-clamp-2 ${
          size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
        }`}>
          {title}
        </h4>
        <p className={`mt-1 font-medium text-white/80 line-clamp-1 ${size === 'sm' ? 'text-[9px]' : 'text-[11px]'}`}>
          {author}
        </p>
        {publisher && size !== 'sm' && (
          <p className="text-[10px] text-white/50 line-clamp-1">{publisher}</p>
        )}
      </div>

      {/* Bottom Rating / Stamp Section */}
      <div className="relative z-20 pl-2 flex items-center justify-between text-[10px]">
        {rating !== undefined ? (
          <div className="flex items-center space-x-0.5 bg-black/40 px-1.5 py-0.5 rounded text-amber-300 font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{rating}.0</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-white/60 text-[9px]">
            <BookOpen className="w-3 h-3" />
            <span>전자독서록</span>
          </div>
        )}

        {isRecommended && (
          <span className="text-[9px] font-bold text-amber-300 bg-amber-400/20 px-1 rounded border border-amber-400/30">
            추천
          </span>
        )}
      </div>

      {/* Bookmark Graphic Accent */}
      <div className="absolute top-0 right-3 w-3 h-6 bg-amber-500/80 shadow-md transform -translate-y-1 group-hover:translate-y-0 transition-transform z-10 clip-bookmark" />
    </div>
  );
};
