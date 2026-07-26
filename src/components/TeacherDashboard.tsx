import React, { useState, useMemo } from 'react';
import { ReadingLog, GASConfig } from '../types';
import {
  ShieldCheck,
  RefreshCw,
  Search,
  Award,
  Trash2,
  Lock,
  Eye,
  BookOpen,
  Users,
  TrendingUp,
  MessageSquare,
  Key,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

interface TeacherDashboardProps {
  logs: ReadingLog[];
  gasConfig: GASConfig;
  teacherPass: string;
  onSyncGAS: () => Promise<void>;
  onToggleBest: (id: string) => void;
  onUpdateTeacherComment: (id: string, comment: string) => void;
  onDeleteLog: (id: string) => void;
  onChangePassword: (newPass: string) => void;
  onSelectLog: (log: ReadingLog) => void;
}

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#6366F1'];

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  logs,
  gasConfig,
  teacherPass,
  onSyncGAS,
  onToggleBest,
  onUpdateTeacherComment,
  onDeleteLog,
  onChangePassword,
  onSelectLog,
}) => {
  // Password auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [passError, setPassError] = useState(false);

  // Table & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('전체');
  const [classFilter, setClassFilter] = useState('전체');
  const [isSyncing, setIsSyncing] = useState(false);

  // Comment edit modal
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Password change modal
  const [showPassModal, setShowPassModal] = useState(false);
  const [newPassInput, setNewPassInput] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === teacherPass) {
      setIsAuthenticated(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await onSyncGAS();
    setIsSyncing(false);
  };

  // Statistical Calculations
  const stats = useMemo(() => {
    const totalLogs = logs.length;
    
    // Class Breakdown
    const classMap: Record<string, number> = {};
    const bookMap: Record<string, { title: string; count: number; author: string }> = {};
    const studentMap: Record<string, { name: string; classGroup: string; count: number }> = {};
    const monthMap: Record<string, number> = {};

    logs.forEach((log) => {
      // Class count
      const classKey = `${log.grade} ${log.classNum}`;
      classMap[classKey] = (classMap[classKey] || 0) + 1;

      // Book popularity
      const bookKey = log.bookTitle.trim();
      if (!bookMap[bookKey]) {
        bookMap[bookKey] = { title: bookKey, count: 0, author: log.author };
      }
      bookMap[bookKey].count += 1;

      // Student count
      const studentKey = `${log.grade}_${log.classNum}_${log.studentName}`;
      if (!studentMap[studentKey]) {
        studentMap[studentKey] = { name: log.studentName, classGroup: classKey, count: 0 };
      }
      studentMap[studentKey].count += 1;

      // Monthly count
      const dateStr = log.readDate || log.timestamp;
      if (dateStr && dateStr.length >= 7) {
        const monthKey = dateStr.substring(0, 7); // YYYY-MM
        monthMap[monthKey] = (monthMap[monthKey] || 0) + 1;
      }
    });

    const topBooks = Object.values(bookMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topStudents = Object.values(studentMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const classChartData = Object.entries(classMap).map(([key, count]) => ({
      name: key,
      독서권수: count,
    }));

    const monthlyChartData = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({
        month: month.replace('-', '년 ') + '월',
        권수: count,
      }));

    const avgRating = totalLogs > 0 
      ? (logs.reduce((acc, curr) => acc + curr.rating, 0) / totalLogs).toFixed(1)
      : '0.0';

    return {
      totalLogs,
      avgRating,
      topBooks,
      topStudents,
      classChartData,
      monthlyChartData,
    };
  }, [logs]);

  // Filtered Table Data
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        !searchTerm ||
        log.studentName.includes(searchTerm) ||
        log.bookTitle.includes(searchTerm) ||
        log.author.includes(searchTerm);

      const matchGrade = gradeFilter === '전체' || log.grade === gradeFilter;
      const matchClass = classFilter === '전체' || log.classNum === classFilter;

      return matchSearch && matchGrade && matchClass;
    });
  }, [logs, searchTerm, gradeFilter, classFilter]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-slate-900/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">교사 전용 대시보드</h2>
          <p className="text-xs text-slate-500 mb-6">
            학급 독서 통계 및 관리 기능을 이용하려면 교사 비밀번호를 입력하세요.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                id="input-teacher-pass"
                type="password"
                placeholder="비밀번호 (초기: 1234)"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-center text-lg font-bold tracking-widest focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
              {passError && (
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  비밀번호가 일치하지 않습니다. (기본 비밀번호: 1234)
                </p>
              )}
            </div>

            <button
              id="btn-teacher-login"
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-sm shadow-md transition-colors"
            >
              대시보드 로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>교사 관리자 전용 모드</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">학급 독서 현황 대시보드</h1>
          <p className="text-xs text-slate-300 mt-1">
            우리 학급 학생들의 누적 독서 데이터 통계 확인 및 베스트 독후감 선정, 구글 시트 데이터 동기화를 관리합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            id="btn-teacher-sync-gas"
            onClick={handleSync}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? '시트 동기화 중...' : '구글 시트 동기화'}</span>
          </button>

          <button
            id="btn-change-pass"
            onClick={() => setShowPassModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>비밀번호 변경</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">총 작성 독서록</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalLogs}권</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">참여 학생 수</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.topStudents.length}명</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">평균 만족도 평점</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.avgRating} / 5.0</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">선정된 베스트 독후감</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">
              {logs.filter((l) => l.isBest).length}개
            </h3>
          </div>
        </div>
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Reading Distribution BarChart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span>학급별 누적 독서량 분포</span>
          </h3>
          {stats.classChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.classChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', borderColor: '#E2E8F0', fontSize: '12px' }}
                  />
                  <Bar dataKey="독서권수" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
              데이터가 없습니다.
            </div>
          )}
        </div>

        {/* Top 3 Popular Books & Authors */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5 text-indigo-500" />
            <span>우리 학급 인기 도서 Top 5</span>
          </h3>

          <div className="space-y-3 my-auto">
            {stats.topBooks.length > 0 ? (
              stats.topBooks.map((book, idx) => (
                <div
                  key={book.title}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                        idx === 0
                          ? 'bg-amber-500 text-slate-950'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-800 text-amber-100'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{book.title}</h4>
                      <p className="text-xs text-slate-500">{book.author}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {book.count}회 읽음
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs text-center py-8">등록된 책 데이터가 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      {/* Integrated Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {/* Table Filter Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <span>전체 독서기록 통합 관리 테이블</span>
            <span className="text-xs text-slate-500 font-medium">({filteredLogs.length}건)</span>
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="학생/도서명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">학생 (학년/반/이름)</th>
                <th className="py-3 px-4">도서명 / 저자</th>
                <th className="py-3 px-4">읽은 날짜</th>
                <th className="py-3 px-4">평점</th>
                <th className="py-3 px-4 text-center">베스트 지정</th>
                <th className="py-3 px-4">교사 피드백 코멘트</th>
                <th className="py-3 px-4 text-center">관리 Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {log.grade} {log.classNum} ({log.studentName})
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{log.bookTitle}</p>
                    <p className="text-[11px] text-slate-400">{log.author}</p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                    {log.readDate || log.timestamp.substring(0, 10)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-bold text-amber-600">★ {log.rating}.0</span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => onToggleBest(log.id)}
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] transition-all flex items-center justify-center space-x-1 mx-auto ${
                        log.isBest
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>{log.isBest ? '베스트 선정됨' : '일반'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    {log.teacherComment ? (
                      <div className="flex items-center justify-between text-slate-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        <span className="line-clamp-1 italic text-[11px]">{log.teacherComment}</span>
                        <button
                          onClick={() => {
                            setEditingLogId(log.id);
                            setCommentInput(log.teacherComment || '');
                          }}
                          className="text-[10px] text-emerald-700 hover:underline font-bold shrink-0 ml-1"
                        >
                          수정
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingLogId(log.id);
                          setCommentInput('');
                        }}
                        className="text-[11px] text-indigo-600 hover:underline flex items-center space-x-1 font-semibold"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>코멘트 작성</span>
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onSelectLog(log)}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                        title="상세보기"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`'${log.studentName}' 학생의 기록을 삭제하시겠습니까?`)) {
                            onDeleteLog(log.id);
                          }
                        }}
                        className="p-1.5 rounded bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Comment Modal */}
      {editingLogId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleUp">
            <h3 className="text-lg font-bold text-slate-900 mb-2">교사 칭찬 코멘트 작성</h3>
            <p className="text-xs text-slate-500 mb-4">
              학생이 자신의 독서록을 확인할 때 따뜻한 격려의 메시지로 표시됩니다.
            </p>
            <textarea
              rows={3}
              placeholder="예: 독서록을 매우 깊이 있게 잘 적었네요! 훌륭합니다."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm mb-4 outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingLogId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                취소
              </button>
              <button
                onClick={() => {
                  onUpdateTeacherComment(editingLogId, commentInput);
                  setEditingLogId(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-amber-400 text-xs font-bold"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">교사 비밀번호 변경</h3>
            <p className="text-xs text-slate-500 mb-4">새로 설정할 교사 대시보드 비밀번호를 입력하세요.</p>
            <input
              type="password"
              placeholder="새 비밀번호 입력"
              value={newPassInput}
              onChange={(e) => setNewPassInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm mb-4 outline-none focus:ring-2 focus:ring-amber-500 text-center font-bold"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPassModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                취소
              </button>
              <button
                onClick={() => {
                  if (newPassInput.trim()) {
                    onChangePassword(newPassInput.trim());
                    setShowPassModal(false);
                    alert('비밀번호가 성공적으로 변경되었습니다.');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-amber-400 text-xs font-bold"
              >
                변경 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
