export interface ReadingLog {
  id: string;
  timestamp: string; // ISO or YYYY-MM-DD HH:mm:ss
  grade: string; // e.g., '1학년', '2학년', '3학년'
  classNum: string; // e.g., '1반', '2반'
  studentNum: string; // e.g., '15'
  studentName: string; // e.g., '김민준'
  bookTitle: string; // 도서명
  author: string; // 지은이
  publisher: string; // 출판사
  category?: string; // 카테고리 (예: 문학/소설, 동화/청소년, 과학/지식, 인문/역사, 기타)
  coverColor?: string; // 커버 테마 색상 (emerald, indigo, amber, rose, sky, violet, teal, stone)
  readDate: string; // 읽은 날짜 YYYY-MM-DD
  rating: number; // 1 ~ 5
  summary: string; // 줄거리 / 요약
  thoughts: string; // 느낀 점 및 소감
  quote?: string; // 인상 깊은 구절 (선택)
  isRecommended: boolean; // 친구 추천 여부
  isBest?: boolean; // 교사가 선정한 베스트 독후감 여부
  teacherComment?: string; // 교사 코멘트
}

export type ActiveTab = 'write' | 'my-logs' | 'teacher' | 'hall-of-fame' | 'yes24-bestseller' | 'settings';

export interface ClassStats {
  totalLogs: number;
  avgRating: number;
  topBooks: { title: string; count: number; author: string }[];
  topStudents: { name: string; gradeClass: string; count: number }[];
  monthlyCounts: { month: string; count: number }[];
  classBreakdown: { classGroup: string; count: number }[];
}

export interface GASConfig {
  webAppUrl: string;
  isConfigured: boolean;
  lastSyncedAt?: string;
}
