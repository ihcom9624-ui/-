import React, { useState, useMemo } from 'react';
import { ReadingLog } from '../types';
import { BookCover } from './BookCover';
import {
  Search,
  Star,
  Filter,
  Calendar,
  BookOpen,
  Trash2,
  Eye,
  Download,
  Printer,
  Plus,
  Award,
  ThumbsUp,
  Quote,
  LayoutGrid,
  List,
  Sparkles,
  ShoppingBag,
  Tag
} from 'lucide-react';

interface MyReadingLogProps {
  logs: ReadingLog[];
  onSelectLog: (log: ReadingLog) => void;
  onDeleteLog: (id: string) => void;
  onGoToWrite: () => void;
}

const CATEGORIES = ['전체', '문학/소설', '동화/청소년', '과학/지식', '인문/역사', '선생님 PICK 🏆'];

export const MyReadingLog: React.FC<MyReadingLogProps> = ({
  logs,
  onSelectLog,
  onDeleteLog,
  onGoToWrite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedGrade, setSelectedGrade] = useState('전체');
  const [selectedClass, setSelectedClass] = useState('전체');
  const [studentSearch, setStudentSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract unique grades & classes for filter options
  const gradeOptions = useMemo(() => {
    const set = new Set(logs.map((l) => l.grade));
    return ['전체', ...Array.from(set).sort()];
  }, [logs]);

  const classOptions = useMemo(() => {
    const set = new Set(logs.map((l) => l.classNum));
    return ['전체', ...Array.from(set).sort()];
  }, [logs]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        !searchTerm.trim() ||
        log.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.thoughts.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === '전체'
          ? true
          : selectedCategory === '선생님 PICK 🏆'
          ? log.isBest
          : log.category === selectedCategory;

      const matchGrade = selectedGrade === '전체' || log.grade === selectedGrade;
      const matchClass = selectedClass === '전체' || log.classNum === selectedClass;
      const matchStudent =
        !studentSearch.trim() ||
        log.studentName.toLowerCase().includes(studentSearch.toLowerCase());

      return matchSearch && matchCategory && matchGrade && matchClass && matchStudent;
    });
  }, [logs, searchTerm, selectedCategory, selectedGrade, selectedClass, studentSearch]);

  // CSV Export
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      alert('내보낼 독서 기록이 없습니다.');
      return;
    }

    const headers = ['작성일시', '카테고리', '학년', '반', '번호', '이름', '도서명', '저자', '출판사', '읽은날짜', '평점', '줄거리', '느낀점', '추천여부'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp || ''}"`,
      `"${l.category || '문학/소설'}"`,
      `"${l.grade}"`,
      `"${l.classNum}"`,
      `"${l.studentNum}"`,
      `"${l.studentName}"`,
      `"${l.bookTitle.replace(/"/g, '""')}"`,
      `"${l.author.replace(/"/g, '""')}"`,
      `"${l.publisher.replace(/"/g, '""')}"`,
      `"${l.readDate}"`,
      `"${l.rating}"`,
      `"${l.summary.replace(/"/g, '""')}"`,
      `"${l.thoughts.replace(/"/g, '""')}"`,
      `"${l.isRecommended ? '추천' : '일반'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `우리반_전자서점_독서록목록_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bookstore Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-xs mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>지혜의 숲 서점 카탈로그</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              우리 학급 추천 서가 & 학생 독서록
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              온라인 서점 스타일의 입체 커버로 우리반 친구들의 감상문과 추천 도서를 시각적으로 탐색해보세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-200 border border-emerald-700/50 font-bold text-xs flex items-center space-x-1.5 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>CSV 내보내기</span>
            </button>

            <button
              id="btn-print-logs"
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-all"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>인쇄하기</span>
            </button>

            <button
              id="btn-new-log"
              onClick={onGoToWrite}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>독서록 등록하기</span>
            </button>
          </div>
        </div>
      </div>

      {/* Online Bookstore Category Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/50'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{cat}</span>
            {cat === '전체' && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-extrabold">
                {logs.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filter & View Mode Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto flex-1">
            {/* Search by Book / Keyword */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="search-input-keyword"
                type="text"
                placeholder="도서명, 저자, 서평 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Grade Select Filter */}
            <div className="flex items-center space-x-2">
              <select
                id="select-filter-grade"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full py-2 px-3 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50"
              >
                <option value="전체">모든 학년</option>
                {gradeOptions.filter((g) => g !== '전체').map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Class Select Filter */}
            <div>
              <select
                id="select-filter-class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full py-2 px-3 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50"
              >
                <option value="전체">모든 반</option>
                {classOptions.filter((c) => c !== '전체').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right View Mode Toggle Buttons */}
          <div className="flex items-center space-x-2 self-end md:self-auto shrink-0">
            <span className="text-xs text-slate-500 font-semibold mr-1">
              총 <strong className="text-emerald-700 font-black">{filteredLogs.length}권</strong>의 도서
            </span>

            <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="서가 진열 진열 뷰"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">서가 진열</span>
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors ${
                  viewMode === 'list' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="상세 리스트 뷰"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">목록형</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Book Catalog Display Grid */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 my-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">검색된 도서 기록이 없습니다</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            다른 카테고리나 검색어를 선택하거나, 새로운 독서 기록을 작성해 보세요.
          </p>
          <button
            onClick={onGoToWrite}
            className="px-4 py-2 bg-slate-900 text-emerald-300 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            독서기록 작성하러 가기
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Mode - 3D Book Cover Presentation Card */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              onClick={() => onSelectLog(log)}
              className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl border border-slate-200/90 hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Best / Teacher Pick Badge */}
              {log.isBest && (
                <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-bl-xl shadow-sm flex items-center space-x-1 z-30">
                  <Award className="w-3 h-3" />
                  <span>선생님 PICK</span>
                </div>
              )}

              <div>
                {/* Book Presentation: Left 3D Book Cover + Right Info */}
                <div className="flex items-start space-x-4 mb-4">
                  {/* 3D Book Cover Component */}
                  <div className="shrink-0 pt-1">
                    <BookCover
                      title={log.bookTitle}
                      author={log.author}
                      publisher={log.publisher}
                      category={log.category}
                      coverColor={log.coverColor}
                      rating={log.rating}
                      isBest={log.isBest}
                      isRecommended={log.isRecommended}
                      size="md"
                    />
                  </div>

                  {/* Right Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 mb-1.5">
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        {log.grade} {log.classNum} {log.studentName}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {log.bookTitle}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {log.author} 지음
                    </p>

                    {log.publisher && (
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        출판사: {log.publisher}
                      </p>
                    )}

                    {/* Rating Stars */}
                    <div className="flex items-center space-x-1 mt-2.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < log.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-1">{log.rating}.0</span>
                    </div>

                    {/* Read Date */}
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{log.readDate || log.timestamp.substring(0, 10)}</span>
                    </p>
                  </div>
                </div>

                {/* Student Review Snippet Container */}
                <div className="space-y-2 mb-3">
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900 mr-1.5">[줄거리]</span>
                    <span className="line-clamp-2">{log.summary}</span>
                  </div>

                  <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/80 text-xs text-slate-800 leading-relaxed">
                    <span className="font-bold text-emerald-800 mr-1.5">[한줄 감상]</span>
                    <span className="line-clamp-2 font-medium">{log.thoughts}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  {log.isRecommended && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                      <ThumbsUp className="w-2.5 h-2.5" />
                      <span>강력 추천 도서</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLog(log);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center space-x-1 transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-300" />
                    <span>서평 보기</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`'${log.bookTitle}' 독서 기록을 삭제하시겠습니까?`)) {
                        onDeleteLog(log.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Mode View */
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              onClick={() => onSelectLog(log)}
              className="p-4 sm:p-5 hover:bg-emerald-50/40 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center space-x-4">
                <BookCover
                  title={log.bookTitle}
                  author={log.author}
                  category={log.category}
                  coverColor={log.coverColor}
                  rating={log.rating}
                  size="sm"
                />

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {log.grade} {log.classNum} {log.studentName}
                    </span>
                    {log.isBest && (
                      <span className="text-[10px] font-black text-amber-950 bg-amber-400 px-2 py-0.5 rounded">
                        베스트 독후감
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {log.bookTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    지은이: {log.author} {log.publisher ? `| 출판사: ${log.publisher}` : ''}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-1 font-medium">
                    "{log.thoughts}"
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-center shrink-0">
                <div className="text-right text-xs">
                  <div className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{log.rating}.0</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{log.readDate || log.timestamp.substring(0, 10)}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLog(log);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold text-xs transition-colors"
                >
                  상세보기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

