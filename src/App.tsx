import React, { useState, useEffect } from 'react';
import { ReadingLog, ActiveTab, GASConfig } from './types';
import {
  getStoredLogs,
  saveStoredLogs,
  getGASConfig,
  saveGASConfig,
  getTeacherPassword,
  setTeacherPassword,
  sendLogToGAS,
  fetchLogsFromGAS
} from './utils/storage';
import { INITIAL_READING_LOGS } from './data/initialData';
import { Header } from './components/Header';
import { ReadingForm } from './components/ReadingForm';
import { MyReadingLog } from './components/MyReadingLog';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ReadingKing } from './components/ReadingKing';
import { Yes24Bestsellers } from './components/Yes24Bestsellers';
import { SettingsModal } from './components/SettingsModal';
import { LogDetailModal } from './components/LogDetailModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('write');
  const [logs, setLogs] = useState<ReadingLog[]>(() => getStoredLogs());
  const [gasConfig, setGasConfig] = useState<GASConfig>(() => getGASConfig());
  const [teacherPass, setTeacherPass] = useState<string>(() => getTeacherPassword());
  const [selectedLog, setSelectedLog] = useState<ReadingLog | null>(null);
  const [prefilledBookForLog, setPrefilledBookForLog] = useState<{ title: string; author: string; publisher: string; category?: string } | null>(null);

  // Sync state to local storage when logs change
  useEffect(() => {
    saveStoredLogs(logs);
  }, [logs]);

  // Handle new reading log submit from student
  const handleSubmitLog = async (newLog: ReadingLog) => {
    // 1. Immediately update state & LocalStorage
    setLogs((prev) => [newLog, ...prev]);

    // 2. Send to Google Apps Script if URL exists
    if (gasConfig.isConfigured && gasConfig.webAppUrl) {
      await sendLogToGAS(newLog, gasConfig.webAppUrl);
    }
  };

  // Sync with Google Sheets (doGet)
  const handleSyncGAS = async () => {
    if (!gasConfig.webAppUrl) {
      alert('설정(Settings) 메뉴에서 먼저 구글 앱스스크립트 Web App URL을 입력하세요.');
      return;
    }

    const result = await fetchLogsFromGAS(gasConfig.webAppUrl);
    if (result.success && result.logs && result.logs.length > 0) {
      // Merge with existing logs safely by ID
      setLogs((prev) => {
        const existingIds = new Set(prev.map((l) => l.id));
        const newFromGas = result.logs!.filter((l) => !existingIds.has(l.id));
        return [...newFromGas, ...prev];
      });
      alert(result.message);
    } else {
      alert(result.message || '구글 시트에서 데이터를 불러오지 못했습니다.');
    }
  };

  // Toggle Best Reading Log status (Teacher action)
  const handleToggleBest = (id: string) => {
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, isBest: !log.isBest } : log))
    );
  };

  // Update Teacher Comment (Teacher action)
  const handleUpdateTeacherComment = (id: string, comment: string) => {
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, teacherComment: comment } : log))
    );
  };

  // Delete Log
  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  // Change Teacher Password
  const handleChangePassword = (newPass: string) => {
    setTeacherPassword(newPass);
    setTeacherPass(newPass);
  };

  // Save GAS Config
  const handleSaveConfig = (newConfig: GASConfig) => {
    saveGASConfig(newConfig);
    setGasConfig(newConfig);
  };

  // Reset sample data
  const handleResetSampleData = () => {
    setLogs(INITIAL_READING_LOGS);
    saveStoredLogs(INITIAL_READING_LOGS);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Sticky Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gasConfig={gasConfig}
        totalLogsCount={logs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'write' && (
          <ReadingForm
            onSubmitLog={handleSubmitLog}
            gasConfig={gasConfig}
            onGoToMyLogs={() => setActiveTab('my-logs')}
            initialBookInfo={prefilledBookForLog}
          />
        )}

        {activeTab === 'my-logs' && (
          <MyReadingLog
            logs={logs}
            onSelectLog={(log) => setSelectedLog(log)}
            onDeleteLog={handleDeleteLog}
            onGoToWrite={() => setActiveTab('write')}
          />
        )}

        {activeTab === 'yes24-bestseller' && (
          <Yes24Bestsellers
            onSelectBookForLog={(book) => {
              setPrefilledBookForLog(book);
              setActiveTab('write');
            }}
          />
        )}

        {activeTab === 'hall-of-fame' && (
          <ReadingKing
            logs={logs}
            onSelectLog={(log) => setSelectedLog(log)}
          />
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboard
            logs={logs}
            gasConfig={gasConfig}
            teacherPass={teacherPass}
            onSyncGAS={handleSyncGAS}
            onToggleBest={handleToggleBest}
            onUpdateTeacherComment={handleUpdateTeacherComment}
            onDeleteLog={handleDeleteLog}
            onChangePassword={handleChangePassword}
            onSelectLog={(log) => setSelectedLog(log)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsModal
            gasConfig={gasConfig}
            onSaveConfig={handleSaveConfig}
            onResetSampleData={handleResetSampleData}
          />
        )}
      </main>

      {/* Detail Modal */}
      <LogDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-6 text-xs text-center border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200">우리반 전자 독서기록장</span>
            <span>· 초·중·고등학교 스마트 독서 활동 지원 시스템</span>
          </div>
          <p className="text-slate-500">
            Google Apps Script & Sheets 연동 · 안전한 브라우저 백업 보장
          </p>
        </div>
      </footer>
    </div>
  );
}
