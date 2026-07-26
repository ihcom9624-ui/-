import React from 'react';
import { ActiveTab, GASConfig } from '../types';
import { BookOpen, PenTool, Library, ShieldCheck, Trophy, Settings, CheckCircle2, AlertCircle, Sparkles, ShoppingBag, Bookmark } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  gasConfig: GASConfig;
  totalLogsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  gasConfig,
  totalLogsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-slate-100 shadow-lg border-b border-slate-800">
      {/* Bookstore Top Banner Ticker */}
      <div className="bg-emerald-950/80 text-emerald-200 border-b border-emerald-800/50 px-4 py-1 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded shrink-0">
              서점 소식
            </span>
            <span className="font-medium truncate text-emerald-300">
              📚 우리 학급 지혜의 숲 전자서점 open! 총 <strong className="text-amber-300 font-bold">{totalLogsCount}권</strong>의 독서록이 쌓였습니다.
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-[11px] text-emerald-300/80 shrink-0">
            <span>교사인증 관리자 시스템</span>
            <span>•</span>
            <span>구글 시트 실시간 연동 지원</span>
          </div>
        </div>
      </div>

      {/* Main Bookstore Brand Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Bookstore Logo & Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('my-logs')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-6 h-6 stroke-[2.5] text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  우리반 전자서점
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  BOOKSTORE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                스마트 독서기록장 & 베스트셀러 학급 플랫폼
              </p>
            </div>
          </div>

          {/* Bookstore Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            <button
              id="nav-tab-my-logs"
              onClick={() => setActiveTab('my-logs')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'my-logs'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Library className="w-4 h-4" />
              <span>전체 서가 & 독서록</span>
              {totalLogsCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  activeTab === 'my-logs' ? 'bg-slate-950 text-emerald-300' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {totalLogsCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-write"
              onClick={() => setActiveTab('write')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'write'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>독서기록 작성</span>
            </button>

            <button
              id="nav-tab-hall-of-fame"
              onClick={() => setActiveTab('hall-of-fame')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'hall-of-fame'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>베스트셀러 & 독서왕</span>
            </button>

            <button
              id="nav-tab-teacher"
              onClick={() => setActiveTab('teacher')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>교사 대시보드</span>
            </button>
          </nav>

          {/* Right Action Tools & Settings */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* GAS Sync Status Button */}
            <button
              id="btn-header-gas-status"
              onClick={() => setActiveTab('settings')}
              title={gasConfig.isConfigured ? '구글 시트 연동 완료' : '로컬 전용 모드 (클릭하여 구글 시트 연동)'}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                gasConfig.isConfigured
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/50 hover:bg-amber-900/80'
              }`}
            >
              {gasConfig.isConfigured ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">구글시트 연동</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">로컬 백업</span>
                </>
              )}
            </button>

            {/* Settings Tab Button */}
            <button
              id="btn-header-settings"
              onClick={() => setActiveTab('settings')}
              className={`p-2 rounded-xl transition-colors ${
                activeTab === 'settings'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="서점 연동 설정 및 안내"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-950 border-t border-slate-800 px-2 py-2 text-xs">
        <button
          id="mobile-tab-my-logs"
          onClick={() => setActiveTab('my-logs')}
          className={`flex flex-col items-center space-y-1 py-1 px-2 rounded-lg ${
            activeTab === 'my-logs' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Library className="w-4 h-4" />
          <span>전체서가</span>
        </button>

        <button
          id="mobile-tab-write"
          onClick={() => setActiveTab('write')}
          className={`flex flex-col items-center space-y-1 py-1 px-2 rounded-lg ${
            activeTab === 'write' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>기록작성</span>
        </button>

        <button
          id="mobile-tab-hall-of-fame"
          onClick={() => setActiveTab('hall-of-fame')}
          className={`flex flex-col items-center space-y-1 py-1 px-2 rounded-lg ${
            activeTab === 'hall-of-fame' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>베스트셀러</span>
        </button>

        <button
          id="mobile-tab-teacher"
          onClick={() => setActiveTab('teacher')}
          className={`flex flex-col items-center space-y-1 py-1 px-2 rounded-lg ${
            activeTab === 'teacher' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>대시보드</span>
        </button>

        <button
          id="mobile-tab-settings"
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center space-y-1 py-1 px-2 rounded-lg ${
            activeTab === 'settings' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>설정</span>
        </button>
      </div>
    </header>
  );
};

