import React, { useState, useMemo } from 'react';
import { ReadingLog } from '../types';
import { FAMOUS_READING_QUOTES } from '../data/initialData';
import { BookCover } from './BookCover';
import { Trophy, Crown, Award, Heart, BookOpen, Quote, Sparkles, Star, ChevronLeft, ChevronRight, MessageSquare, Flame, TrendingUp } from 'lucide-react';

interface ReadingKingProps {
  logs: ReadingLog[];
  onSelectLog: (log: ReadingLog) => void;
}

export const ReadingKing: React.FC<ReadingKingProps> = ({ logs, onSelectLog }) => {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [likedLogIds, setLikedLogIds] = useState<Record<string, boolean>>({});

  // Leaderboard Calculation
  const leaderboard = useMemo(() => {
    const map: Record<string, { studentName: string; gradeClass: string; count: number; sampleLog?: ReadingLog }> = {};

    logs.forEach((log) => {
      const key = `${log.grade}_${log.classNum}_${log.studentName}`;
      if (!map[key]) {
        map[key] = {
          studentName: log.studentName,
          gradeClass: `${log.grade} ${log.classNum}`,
          count: 0,
          sampleLog: log,
        };
      }
      map[key].count += 1;
      if (log.isBest) {
        map[key].sampleLog = log;
      }
    });

    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [logs]);

  // Classroom Bestseller Books
  const bestsellerBooks = useMemo(() => {
    const map = new Map<string, { bookTitle: string; author: string; publisher?: string; category?: string; coverColor?: string; count: number; totalRating: number; sampleLog: ReadingLog }>();

    logs.forEach((log) => {
      const key = log.bookTitle.trim().toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        existing.totalRating += log.rating;
      } else {
        map.set(key, {
          bookTitle: log.bookTitle,
          author: log.author,
          publisher: log.publisher,
          category: log.category,
          coverColor: log.coverColor,
          count: 1,
          totalRating: log.rating,
          sampleLog: log,
        });
      }
    });

    return Array.from(map.values())
      .map((item) => ({
        ...item,
        avgRating: Math.round((item.totalRating / item.count) * 10) / 10,
      }))
      .sort((a, b) => b.count - a.count || b.avgRating - a.avgRating)
      .slice(0, 6);
  }, [logs]);

  // Best Selected Logs
  const bestLogs = useMemo(() => {
    return logs.filter((log) => log.isBest);
  }, [logs]);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedLogIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentQuote = FAMOUS_READING_QUOTES[quoteIdx];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Banner: Gold Theme Hall of Fame Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950 text-white p-8 md:p-10 shadow-2xl overflow-hidden border border-amber-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs mb-3">
            <Crown className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>우리 학급 명예의 전당 & 베스트셀러</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            👑 이달의 베스트셀러 & 학급 다독왕
          </h1>
          <p className="text-emerald-100/90 text-sm mt-2 leading-relaxed">
            우리 학급 친구들에게 가장 인기가 높았던 서점 베스트셀러 도서와 최다 독서록 기록 다독왕을 축하합니다!
          </p>
        </div>
      </div>

      {/* Quote Carousel */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-200/80 bg-gradient-to-r from-emerald-50/50 to-amber-50/30 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold">
            <Quote className="w-4 h-4 fill-emerald-600 text-emerald-700" />
            <span>오늘의 서점 추천 독서 명언</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setQuoteIdx((prev) => (prev > 0 ? prev - 1 : FAMOUS_READING_QUOTES.length - 1))}
              className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-emerald-800">
              {quoteIdx + 1} / {FAMOUS_READING_QUOTES.length}
            </span>
            <button
              onClick={() => setQuoteIdx((prev) => (prev < FAMOUS_READING_QUOTES.length - 1 ? prev + 1 : 0))}
              className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <blockquote className="text-base sm:text-lg font-bold text-slate-800 italic leading-relaxed">
          "{currentQuote.quote}"
        </blockquote>
        <p className="text-xs text-emerald-800 font-bold text-right mt-2">— {currentQuote.author}</p>
      </div>

      {/* Section 1: Classroom Bestsellers */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-extrabold text-slate-900">학급 베스트셀러 TOP 6</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestsellerBooks.map((item, idx) => (
            <div
              key={item.bookTitle}
              onClick={() => onSelectLog(item.sampleLog)}
              className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl border border-slate-200 hover:border-amber-400 transition-all cursor-pointer flex items-center space-x-4 group relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-8 h-8 rounded-br-2xl flex items-center justify-center font-black text-xs text-white z-20 ${
                idx === 0 ? 'bg-amber-500 shadow-md' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-amber-700' : 'bg-slate-800'
              }`}>
                {idx + 1}
              </div>

              <div className="shrink-0 pt-2">
                <BookCover
                  title={item.bookTitle}
                  author={item.author}
                  publisher={item.publisher}
                  category={item.category}
                  coverColor={item.coverColor}
                  rating={item.avgRating}
                  size="sm"
                />
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {item.count}명의 학생이 읽음
                </span>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mt-1.5 leading-snug">
                  {item.bookTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.author}</p>

                <div className="flex items-center space-x-1 mt-2 text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>평점 {item.avgRating}점</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Top 3 Reading Kings Leaderboard */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Trophy className="w-6 h-6 text-amber-500" />
          <h2 className="text-xl font-extrabold text-slate-900">이달의 다독왕 Top 3</h2>
        </div>

        {leaderboard.length === 0 ? (
          <p className="text-center py-8 text-slate-400 text-sm">등록된 독서기록이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaderboard.map((item, idx) => {
              const isGold = idx === 0;
              const isSilver = idx === 1;

              return (
                <div
                  key={item.studentName + item.gradeClass}
                  className={`relative rounded-3xl p-6 transition-all duration-300 border shadow-lg flex flex-col justify-between ${
                    isGold
                      ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950 text-white border-amber-400/80 scale-105 z-10'
                      : isSilver
                      ? 'bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 border-slate-300'
                      : 'bg-gradient-to-b from-emerald-50 to-emerald-100 text-slate-900 border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full flex items-center space-x-1 ${
                        isGold
                          ? 'bg-amber-400 text-slate-950'
                          : isSilver
                          ? 'bg-slate-800 text-white'
                          : 'bg-emerald-800 text-white'
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>{idx + 1}위 {isGold ? '금메달' : isSilver ? '은메달' : '동메달'}</span>
                    </span>

                    <span className="text-2xl font-black">{item.count}권 기록</span>
                  </div>

                  <div className="text-center py-4">
                    <div
                      className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center font-black text-2xl shadow-md mb-3 ${
                        isGold ? 'bg-amber-400 text-slate-950' : 'bg-white text-slate-900'
                      }`}
                    >
                      {item.studentName.substring(0, 1)}
                    </div>
                    <h3 className="text-xl font-black">{item.studentName}</h3>
                    <p className={`text-xs font-bold mt-0.5 ${isGold ? 'text-emerald-300' : 'text-slate-600'}`}>
                      {item.gradeClass}
                    </p>
                  </div>

                  {item.sampleLog && (
                    <div
                      onClick={() => onSelectLog(item.sampleLog!)}
                      className={`p-3 rounded-2xl cursor-pointer text-xs transition-opacity hover:opacity-90 ${
                        isGold ? 'bg-white/10 text-emerald-100 border border-white/20' : 'bg-white/80 text-slate-800 border border-slate-200'
                      }`}
                    >
                      <p className="font-bold line-clamp-1">📖 대표도서: {item.sampleLog.bookTitle}</p>
                      <p className="line-clamp-2 mt-1 opacity-90 italic text-[11px]">
                        "{item.sampleLog.thoughts}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 3: Teacher Selected Best Reading Logs Feed */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Award className="w-6 h-6 text-emerald-700" />
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">선생님이 뽑은 명품 서평 독후감</h2>
            <p className="text-xs text-slate-500">깊이 있는 생각과 감동이 담긴 우수 독서록입니다.</p>
          </div>
        </div>

        {bestLogs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">아직 선생님이 지정한 베스트 독후감이 없습니다.</p>
            <p className="text-xs text-slate-500 mt-1">교사 대시보드에서 독후감을 베스트로 선정해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bestLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => onSelectLog(log)}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-emerald-200/80 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-indigo-600"></div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
                      <span>
                        {log.grade} {log.classNum} {log.studentName}
                      </span>
                    </span>

                    <button
                      onClick={(e) => toggleLike(log.id, e)}
                      className="p-2 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          likedLogIds[log.id] ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-start space-x-4 my-2">
                    <BookCover
                      title={log.bookTitle}
                      author={log.author}
                      publisher={log.publisher}
                      category={log.category}
                      coverColor={log.coverColor}
                      rating={log.rating}
                      isBest={true}
                      size="sm"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {log.bookTitle}
                      </h3>
                      <p className="text-xs text-slate-500 mb-2">{log.author} 지음</p>

                      <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100/80 text-xs text-slate-800 leading-relaxed">
                        <p className="line-clamp-3 font-medium">"{log.thoughts}"</p>
                      </div>
                    </div>
                  </div>

                  {log.teacherComment && (
                    <div className="bg-indigo-50/70 p-3 rounded-2xl border border-indigo-100 text-xs text-indigo-900 flex items-start space-x-2 mt-3">
                      <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-indigo-700">선생님 칭찬 한마디:</span>
                        <p className="text-indigo-800 mt-0.5">{log.teacherComment}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-4">
                  <div className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{log.rating}.0 만점</span>
                  </div>
                  <span className="font-semibold text-emerald-700 group-hover:underline">
                    서평 전체 보기 ➔
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

