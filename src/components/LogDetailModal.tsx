import React from 'react';
import { ReadingLog } from '../types';
import { BookCover } from './BookCover';
import { X, Star, Calendar, BookOpen, User, Quote, Printer, Award, ThumbsUp, MessageSquare } from 'lucide-react';

interface LogDetailModalProps {
  log: ReadingLog | null;
  onClose: () => void;
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-scaleUp border border-slate-200">
        {/* Top Control Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              {log.grade} {log.classNum} 서평 독서기록장
            </span>
            {log.isBest && (
              <span className="text-xs font-bold text-slate-950 bg-amber-400 px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                <span>선생님 PICK 베스트</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-modal-print"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>독서록 인쇄</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="space-y-6">
          {/* Title & Author Header with 3D Book Cover */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="shrink-0">
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

            <div className="flex-1 min-w-0 text-center sm:text-left">
              <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                {log.category || '문학/소설'}
              </span>
              <h1 className="text-2xl font-black text-white mt-1.5 leading-snug">{log.bookTitle}</h1>
              <p className="text-xs text-emerald-100/90 mt-1">
                지은이: {log.author} {log.publisher ? `| 출판사: ${log.publisher}` : ''}
              </p>

              <div className="mt-3 flex items-center justify-center sm:justify-start space-x-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < log.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-amber-300 ml-1">{log.rating}.0점 만점</span>
              </div>
            </div>
          </div>

          {/* Student & Date Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 block font-semibold">작성 학생</span>
              <span className="font-bold text-slate-900 text-sm">
                {log.studentName} ({log.studentNum ? `${log.studentNum}번` : ''})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">학년 / 반</span>
              <span className="font-bold text-slate-900 text-sm">
                {log.grade} {log.classNum}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">읽은 날짜</span>
              <span className="font-bold text-slate-900 text-sm">
                {log.readDate || log.timestamp.substring(0, 10)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">서가 추천</span>
              <span className="font-bold text-emerald-700 text-sm">
                {log.isRecommended ? '👍 친구 추천 도서' : '일반'}
              </span>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>줄거리 요약</span>
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-800 leading-relaxed font-medium">
              {log.summary}
            </div>
          </div>

          {/* Thoughts */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <Quote className="w-4 h-4 text-emerald-700" />
              <span>서평 및 독서 감상</span>
            </h3>
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-xs text-slate-900 leading-relaxed font-medium">
              {log.thoughts}
            </div>
          </div>

          {/* Quote if present */}
          {log.quote && (
            <div>
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                인상 깊은 구절
              </h3>
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-950 italic font-semibold">
                "{log.quote}"
              </div>
            </div>
          )}

          {/* Teacher Comment if present */}
          {log.teacherComment && (
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 flex items-start space-x-3">
              <MessageSquare className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-indigo-900">선생님의 칭찬 한마디</h4>
                <p className="text-xs text-indigo-800 font-medium mt-1 leading-relaxed">
                  {log.teacherComment}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

