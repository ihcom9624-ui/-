import React, { useState, useEffect } from 'react';
import { ReadingLog, GASConfig } from '../types';
import { BookCover } from './BookCover';
import { Star, Send, BookMarked, User, Sparkles, CheckCircle2, CloudUpload, Info, Quote, Palette, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReadingFormProps {
  onSubmitLog: (log: ReadingLog) => Promise<void>;
  gasConfig: GASConfig;
  onGoToMyLogs: () => void;
  initialBookInfo?: { title: string; author: string; publisher: string; category?: string } | null;
}

const LAST_STUDENT_INFO_KEY = 'class_reading_last_student_info';

const COVER_COLORS = [
  { id: 'emerald', label: '에메랄드 포레스트', colorClass: 'bg-emerald-700' },
  { id: 'indigo', label: '인디고 미드나잇', colorClass: 'bg-indigo-800' },
  { id: 'amber', label: '앰버 골드', colorClass: 'bg-amber-700' },
  { id: 'rose', label: '크림슨 로즈', colorClass: 'bg-rose-800' },
  { id: 'sky', label: '새파란 사파이어', colorClass: 'bg-sky-700' },
  { id: 'violet', label: '딥 바이올렛', colorClass: 'bg-violet-800' },
  { id: 'teal', label: '다크 틸', colorClass: 'bg-teal-700' },
  { id: 'stone', label: '스톤 그레이', colorClass: 'bg-stone-800' },
];

export const ReadingForm: React.FC<ReadingFormProps> = ({
  onSubmitLog,
  gasConfig,
  onGoToMyLogs,
  initialBookInfo,
}) => {
  // Student Info State
  const [grade, setGrade] = useState('5학년');
  const [classNum, setClassNum] = useState('2반');
  const [studentNum, setStudentNum] = useState('');
  const [studentName, setStudentName] = useState('');

  // Book Info State
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [category, setCategory] = useState('문학/소설');
  const [coverColor, setCoverColor] = useState('emerald');
  const [readDate, setReadDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  // Apply initialBookInfo if provided (e.g. from Yes24 Bestseller selection)
  useEffect(() => {
    if (initialBookInfo) {
      if (initialBookInfo.title) setBookTitle(initialBookInfo.title);
      if (initialBookInfo.author) setAuthor(initialBookInfo.author);
      if (initialBookInfo.publisher) setPublisher(initialBookInfo.publisher);
      if (initialBookInfo.category) setCategory(initialBookInfo.category);
    }
  }, [initialBookInfo]);

  // Content State
  const [summary, setSummary] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [quote, setQuote] = useState('');
  const [isRecommended, setIsRecommended] = useState(true);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load last used student info
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LAST_STUDENT_INFO_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.grade) setGrade(parsed.grade);
        if (parsed.classNum) setClassNum(parsed.classNum);
        if (parsed.studentNum) setStudentNum(parsed.studentNum);
        if (parsed.studentName) setStudentName(parsed.studentName);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim() || !bookTitle.trim() || !summary.trim() || !thoughts.trim()) {
      alert('이름, 도서명, 줄거리, 소감 항목을 모두 작성해주세요!');
      return;
    }

    setIsSubmitting(true);

    // Save student info for convenience
    try {
      localStorage.setItem(
        LAST_STUDENT_INFO_KEY,
        JSON.stringify({ grade, classNum, studentNum, studentName })
      );
    } catch (e) {}

    const newLog: ReadingLog = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      grade,
      classNum,
      studentNum,
      studentName: studentName.trim(),
      bookTitle: bookTitle.trim(),
      author: author.trim() || '미상',
      publisher: publisher.trim() || '미상',
      category,
      coverColor,
      readDate,
      rating,
      summary: summary.trim(),
      thoughts: thoughts.trim(),
      quote: quote.trim(),
      isRecommended,
      isBest: false,
    };

    await onSubmitLog(newLog);

    // Trigger celebration fireworks
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899'],
      });
    } catch (err) {}

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setToastMessage(
      gasConfig.isConfigured
        ? '독서록이 서점에 등록되었으며 구글 시트로 안전하게 전송되었습니다!'
        : '독서록이 서점에 등록되었으며 브라우저(LocalStorage)에 저장되었습니다!'
    );

    // Reset Book fields but keep Student info
    setBookTitle('');
    setAuthor('');
    setPublisher('');
    setSummary('');
    setThoughts('');
    setQuote('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs mb-1">
              <Sparkles className="w-4 h-4" />
              <span>온라인 서점 도서 서평 & 독서록 등록</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              책 속 보물 같은 이야기, 내 서평 올리기 📚
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              내가 읽은 책의 커버 테마를 디자인하고 마음을 흔든 독후감을 적어 우리반 친구들과 공유해보세요.
            </p>
          </div>
          <button
            id="btn-go-to-my-logs"
            onClick={onGoToMyLogs}
            type="button"
            className="self-start md:self-center px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2 shrink-0"
          >
            <BookMarked className="w-4 h-4" />
            <span>전체 서가 보러가기</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {submitSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 flex items-start justify-between animate-fadeIn shadow-md">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-sm text-emerald-300">서평 등록 완료!</p>
              <p className="text-xs text-emerald-200/90 mt-0.5">{toastMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="text-xs text-emerald-400 hover:text-emerald-200 font-bold underline"
          >
            닫기
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Student Profile */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center space-x-2 pb-4 mb-5 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">1. 작성 학생 프로필</h2>
              <p className="text-xs text-slate-500">독서를 마친 학생의 정보를 정확하게 선택해 주세요.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">학년</label>
              <select
                id="input-grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="1학년">1학년</option>
                <option value="2학년">2학년</option>
                <option value="3학년">3학년</option>
                <option value="4학년">4학년</option>
                <option value="5학년">5학년</option>
                <option value="6학년">6학년</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">반</label>
              <select
                id="input-class-num"
                value={classNum}
                onChange={(e) => setClassNum(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {Array.from({ length: 10 }, (_, i) => `${i + 1}반`).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">번호</label>
              <input
                id="input-student-num"
                type="text"
                placeholder="예: 12"
                value={studentNum}
                onChange={(e) => setStudentNum(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                학생 이름 <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-student-name"
                type="text"
                required
                placeholder="홍길동"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Book Details & Live Cover Preview */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center space-x-2 pb-4 mb-5 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">2. 도서 정보 & 3D 입체 커버 디자인</h2>
              <p className="text-xs text-slate-500">책 정보와 카테고리, 커버 스타일을 지정하면 실시간으로 커버가 생성됩니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Form Inputs */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  도서명 (책 제목) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-book-title"
                  type="text"
                  required
                  placeholder="예: 아몬드, 어린 왕자, 긴긴밤"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">지은이 (저자)</label>
                  <input
                    id="input-author"
                    type="text"
                    placeholder="예: 손원평"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">출판사</label>
                  <input
                    id="input-publisher"
                    type="text"
                    placeholder="예: 창비"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">서점 카테고리 분류</label>
                  <select
                    id="input-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50"
                  >
                    <option value="문학/소설">문학/소설</option>
                    <option value="동화/청소년">동화/청소년</option>
                    <option value="과학/지식">과학/지식</option>
                    <option value="인문/역사">인문/역사</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">읽은 날짜</label>
                  <input
                    id="input-read-date"
                    type="date"
                    value={readDate}
                    onChange={(e) => setReadDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Cover Color Theme Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center space-x-1">
                  <Palette className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3D 도서 커버 테마 색상 선택</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {COVER_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCoverColor(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition-all ${
                        coverColor === c.id
                          ? 'ring-2 ring-emerald-500 border-emerald-500 bg-slate-900 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${c.colorClass}`} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Star Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">도서 별점 만족도</label>
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            active ? 'fill-amber-400 text-amber-500' : 'text-slate-200'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-extrabold text-amber-600 ml-2">
                    {rating}.0점 / 5.0점
                  </span>
                </div>
              </div>
            </div>

            {/* Right Live Book Cover Generator Preview */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold text-slate-400 mb-3 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>서점 서가 진열 실시간 미리보기</span>
              </span>

              <BookCover
                title={bookTitle.trim() || '책 제목 입력'}
                author={author.trim() || '지은이'}
                publisher={publisher.trim() || '출판사'}
                category={category}
                coverColor={coverColor}
                rating={rating}
                isRecommended={isRecommended}
                size="lg"
              />

              <p className="text-[11px] text-slate-500 mt-4 font-medium">
                작성 후 서점에 위 커버 모습으로 등록됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Summary & Review Content */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Quote className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">3. 서평 내용 & 감상문 작성</h2>
                <p className="text-xs text-slate-500">줄거리 요약과 나만의 인상 깊은 감상을 남겨주세요.</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                줄거리 요약 (핵심 스토리) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{summary.length}자</span>
            </div>
            <textarea
              id="input-summary"
              required
              rows={3}
              placeholder="책의 핵심 줄거리나 등장인물, 주요 사건을 간략히 요약해 적어보세요."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                독서 소감 & 내 생각 (나만의 솔직한 리뷰) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{thoughts.length}자</span>
            </div>
            <textarea
              id="input-thoughts"
              required
              rows={4}
              placeholder="책을 읽으며 느낀 점, 깨달은 가치, 나 자신의 삶과 연결된 깊은 생각을 남겨주세요."
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              기억에 남는 인상 깊은 구절 (선택)
            </label>
            <input
              id="input-quote"
              type="text"
              placeholder='예: "가장 중요한 것은 눈에 보이지 않아"'
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-amber-50/40 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none italic"
            />
          </div>

          {/* Recommendation Checkbox */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
              <input
                id="input-is-recommended"
                type="checkbox"
                checked={isRecommended}
                onChange={(e) => setIsRecommended(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-xs font-extrabold text-slate-800">
                👍 이 책을 우리반 서가 추천 도서로 강추합니다!
              </span>
            </label>

            <div className="text-[11px] text-slate-400 flex items-center space-x-1">
              <Info className="w-3.5 h-3.5" />
              <span>등록 후 언제든지 수정 가능합니다.</span>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 flex items-center space-x-1.5">
            <CloudUpload className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {gasConfig.isConfigured
                ? '구글 시트로 실시간 데이터가 자동 전송됩니다.'
                : '로컬 안전 백업 모드가 동작 중입니다.'}
            </span>
          </div>

          <button
            id="btn-submit-reading-log"
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>서점에 저장 중...</span>
            ) : (
              <>
                <Send className="w-4 h-4 text-emerald-400" />
                <span>서점에 독서록 등록하기</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

