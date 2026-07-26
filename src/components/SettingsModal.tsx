import React, { useState } from 'react';
import { GASConfig } from '../types';
import { GAS_CODE_STRING, GAS_INSTRUCTIONS, DEPLOYMENT_GUIDE } from '../data/gasCode';
import { Settings, Copy, Check, Link, CheckCircle2, AlertTriangle, RefreshCw, Github, Globe, HelpCircle, FileCode, ShieldAlert } from 'lucide-react';

interface SettingsModalProps {
  gasConfig: GASConfig;
  onSaveConfig: (config: GASConfig) => void;
  onResetSampleData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  gasConfig,
  onSaveConfig,
  onResetSampleData,
}) => {
  const [urlInput, setUrlInput] = useState(gasConfig.webAppUrl || '');
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: '',
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_CODE_STRING);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed && !trimmed.startsWith('https://script.google.com')) {
      alert('구글 앱스스크립트 Web App URL은 https://script.google.com 으로 시작해야 합니다.');
      return;
    }

    onSaveConfig({
      webAppUrl: trimmed,
      isConfigured: !!trimmed,
      lastSyncedAt: new Date().toISOString(),
    });

    alert(trimmed ? '구글 시트 웹 앱 URL이 정상적으로 저장되었습니다!' : '구글 시트 연동이 해제되었습니다.');
  };

  const handleTestConnection = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setTestResult({ status: 'error', message: '테스트할 Web App URL을 입력해 주세요.' });
      return;
    }

    setTestResult({ status: 'testing', message: '구글 시트 연동 상태 확인 중...' });

    try {
      const res = await fetch(trimmed, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          setTestResult({
            status: 'success',
            message: '✅ 구글 시트 및 Apps Script 연동 성공! 실시간 데이터 송수신이 가능합니다.',
          });
        } else {
          setTestResult({
            status: 'error',
            message: `⚠️ 구글 시트 응답 오류: ${data.message || '데이터 형식 불일치'}`,
          });
        }
      } else {
        setTestResult({
          status: 'error',
          message: `❌ 구글 시트 연동 실패 (상태 코드: ${res.status}). 배포 권한이 '모든 사용자(Anyone)'로 설정되었는지 확인하세요.`,
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: `❌ 네트워크 오류 또는 CORS 접근 제한. Apps Script 배포 시 [액세스할 수 있는 사용자]를 '모든 사용자(Anyone)'로 지정했는지 재확인하세요.`,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">구글 시트 연동 & 배포 설정</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              구글 드라이브의 Google Sheets와 실시간으로 독서 데이터를 주고받을 수 있도록 설정합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: GAS Web App URL Input & Test */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
          <Link className="w-5 h-5 text-amber-500" />
          <span>1. 구글 앱스스크립트 Web App URL 등록</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            배포받은 Google Apps Script Web App URL
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="input-gas-url"
              type="text"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
            <button
              id="btn-save-gas-url"
              onClick={handleSaveUrl}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-md shrink-0"
            >
              URL 저장
            </button>
            <button
              id="btn-test-gas-url"
              onClick={handleTestConnection}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shrink-0 flex items-center justify-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>연동 테스트</span>
            </button>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult.status !== 'idle' && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold ${
              testResult.status === 'testing'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : testResult.status === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {testResult.message}
          </div>
        )}

        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            URL이 설정되지 않은 상태에서도 작성한 독서 기록은 안전하게 웹 브라우저 LocalStorage에 백업 저장됩니다.
          </span>
        </div>
      </div>

      {/* Section 2: Code.gs Source Code & One-click Copy */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
            <FileCode className="w-5 h-5 text-indigo-600" />
            <span>2. 구글 앱스스크립트 전용 소스코드 (`Code.gs`)</span>
          </div>

          <button
            id="btn-copy-code-gs"
            onClick={handleCopyCode}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>코드 원클릭 복사</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-600">
          구글 시트의 [확장 프로그램] ➔ [Apps Script] 편집기에 아래 코드를 복사해서 붙여넣으세요.
        </p>

        <div className="relative bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-64 border border-slate-800">
          <pre>{GAS_CODE_STRING}</pre>
        </div>
      </div>

      {/* Section 3: Step-by-Step GAS Deployment Instructions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <span>3. 구글 시트 연동 5단계 설치 가이드</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {GAS_INSTRUCTIONS.map((inst) => (
            <div key={inst.step} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-black flex items-center justify-center mb-2">
                  {inst.step}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{inst.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{inst.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: GitHub Push & Netlify Deployment Guide */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
          <Globe className="w-5 h-5 text-sky-600" />
          <span>4. GitHub 푸시 및 Netlify 무료 배포 안내</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <Github className="w-4 h-4 text-slate-800" />
              <span>GitHub 저장소 올리기</span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-1">
              {DEPLOYMENT_GUIDE.github.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 space-y-2">
            <h4 className="text-xs font-bold text-sky-950 flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-sky-600" />
              <span>Netlify 무료 배포</span>
            </h4>
            <ul className="text-xs text-sky-900 space-y-1">
              {DEPLOYMENT_GUIDE.netlify.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section 5: Sample Data Reset */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">테스트용 초기 샘플 데이터 복원</h4>
          <p className="text-xs text-slate-500">
            앱 테스트 및 시연용 기본 독서 기록 샘플 데이터 8건을 불러옵니다.
          </p>
        </div>
        <button
          id="btn-reset-sample-data"
          onClick={() => {
            if (confirm('기존 기록에 샘플 데이터 8건을 복원하시겠습니까?')) {
              onResetSampleData();
              alert('샘플 데이터가 복원되었습니다.');
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shrink-0"
        >
          샘플 데이터 복원
        </button>
      </div>
    </div>
  );
};
