import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, BookOpen, RefreshCw, Star, Sparkles, TrendingUp, ChevronRight, PenTool, ExternalLink, Award, Library } from 'lucide-react';
import { BookCover } from './BookCover';

export interface Yes24Book {
  rank: number;
  title: string;
  author: string;
  publisher: string;
  description: string;
  category: string;
}

export interface Yes24ApiResponse {
  status: string;
  totalCount: number;
  data: Yes24Book[];
}

export const YES24_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwrrL-qXGoZ7ZkYgR4jOSADT3Dppw8DzgGyk3JZM2k3TnAQV8TG2PPE97v1_LI_lojb/exec';

// Sample fallback data in case of network issue
const FALLBACK_BOOKS: Yes24Book[] = [
  {
    rank: 1,
    title: "모순",
    author: "양귀자",
    publisher: "쓰다",
    description: "인생은 탐구하는 것이 아니라 살아가는 것이다. 삶의 비밀을 찾아가는 스물다섯 안진진의 솔직하고 감동적인 고백.",
    category: "소설/시/희곡"
  },
  {
    rank: 2,
    title: "마흔에 읽는 쇼펜하우어",
    author: "강용수",
    publisher: "유노북스",
    description: "마음의 평정을 얻고 삶의 지혜를 배우는 쇼펜하우어의 철학 수업.",
    category: "인문"
  },
  {
    rank: 3,
    title: "불편한 편의점",
    author: "김호연",
    publisher: "나무옆의자",
    description: "청파동 골목길 작은 편의점에서 펼쳐지는 이웃들의 따뜻하고 위로가 되는 이야기.",
    category: "소설/시/희곡"
  },
  {
    rank: 4,
    title: "세이노의 가르침",
    author: "세이노",
    publisher: "데이원",
    description: "피가 되고 살이 되는 삶의 지혜와 재능을 넘어서는 노력에 대한 세이노의 진솔한 조언.",
    category: "자기계발"
  },
  {
    rank: 5,
    title: "트렌드 코리아 2026",
    author: "김난도 외",
    publisher: "미래의창",
    description: "대한민국 소비 트렌드의 흐름과 다가올 시대를 명확하게 짚어내는 필독 트렌드 전망서.",
    category: "경제경영"
  },
  {
    rank: 6,
    title: "어린 왕자",
    author: "생텍쥐페리",
    publisher: "열린책들",
    description: "어른들을 위한 아름다운 동화. 정말 중요한 것은 눈에 보이지 않는다는 소중한 지혜.",
    category: "어린이/청소년"
  },
  {
    rank: 7,
    title: "원씽 (The One Thing)",
    author: "게리 켈러",
    publisher: "비즈니스북스",
    description: "복잡한 세상을 뚫고 나가는 단 하나의 법칙, 가장 중요한 일에 집중하라.",
    category: "자기계발"
  },
  {
    rank: 8,
    title: "파과",
    author: "구병모",
    publisher: "위즈덤하우스",
    description: "바래지고 사그라드는 것들에 바치는 강렬하고 아름다운 느와르 서사.",
    category: "소설/시/희곡"
  },
  {
    rank: 9,
    title: "물고기는 존재하지 않는다",
    author: "룰루 밀러",
    publisher: "곰출판",
    description: "사랑과 혼돈, 그리고 과학적 집착에 관한 경이롭고 매혹적인 실화 서사.",
    category: "과학"
  },
  {
    rank: 10,
    title: "도파민 네이션",
    author: "애나 렘키",
    publisher: "생각의힘",
    description: "쾌락 과잉의 시대에서 균형을 잡는 뇌과학적 통찰과 중독 극복 솔루션.",
    category: "인문"
  },
  {
    rank: 11,
    title: "역사의 쓸모",
    author: "최태성",
    publisher: "다산북스",
    description: "수천 년 역사 속 인물들의 선택을 통해 오늘을 사는 우리에게 던지는 질문과 해답.",
    category: "역사"
  },
  {
    rank: 12,
    title: "데미안",
    author: "헤르만 헤세",
    publisher: "민음사",
    description: "알은 세계이다. 태어나려는 자는 하나의 세계를 파괴해야 한다. 자기 자신에게 이르는 길.",
    category: "어린이/청소년"
  }
];

interface Yes24BestsellersProps {
  onSelectBookForLog?: (book: { title: string; author: string; publisher: string; category?: string }) => void;
}

export const Yes24Bestsellers: React.FC<Yes24BestsellersProps> = ({ onSelectBookForLog }) => {
  const [books, setBooks] = useState<Yes24Book[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch function
  const fetchBestsellers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(YES24_WEB_APP_URL, {
        method: 'GET',
        redirect: 'follow',
      });

      if (!response.ok) {
        throw new Error(`HTTP 오류가 발생했습니다: ${response.status}`);
      }

      const json: Yes24ApiResponse = await response.json();

      if (json && json.data && Array.isArray(json.data) && json.data.length > 0) {
        setBooks(json.data);
        setTotalCount(json.totalCount || json.data.length);
      } else {
        // Fallback
        setBooks(FALLBACK_BOOKS);
        setTotalCount(FALLBACK_BOOKS.length);
      }
    } catch (err: any) {
      console.warn('YES24 Bestseller Fetch Error, falling back to cached books:', err);
      // Fallback
      setBooks(FALLBACK_BOOKS);
      setTotalCount(FALLBACK_BOOKS.length);
      setError('서버 응답이 원활하지 않아 준비된 베스트셀러 목록을 불러왔습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestsellers();
  }, []);

  // Unique categories list
  const categories = useMemo(() => {
    const cats = new Set<string>();
    books.forEach((b) => {
      if (b.category && b.category.trim()) {
        cats.add(b.category.trim());
      }
    });
    return ['전체', ...Array.from(cats)];
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory =
        selectedCategory === '전체' || book.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.publisher.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [books, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white p-8 md:p-10 shadow-xl overflow-hidden border border-emerald-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 font-bold text-xs mb-3">
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>실시간 예스24 베스트셀러 종합 연동</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            📚 YES24 이달의 베스트셀러 120
          </h1>
          <p className="text-emerald-100/90 text-sm mt-2 leading-relaxed">
            대한민국 대표 서점 예스24의 실시간 인기 도서 목록입니다. 읽고 싶은 도서를 선택하여 바로 나의 독서록에 등록해보세요.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 px-4 py-2 rounded-2xl text-xs flex items-center space-x-2">
            <span className="text-slate-400">총 등록도서:</span>
            <strong className="text-amber-300 font-bold text-sm">{totalCount || books.length}권</strong>
          </div>
          
          <button
            onClick={fetchBestsellers}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>실시간 다시 불러오기</span>
          </button>
        </div>
      </div>

      {/* Requirement 1: Category Filter Buttons/Dropdown & Search Input */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도서명, 저자, 출판사, 키워드로 검색..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full"
              >
                지우기
              </button>
            )}
          </div>

          {/* Category Dropdown (Mobile view or compact) */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-xs font-extrabold text-slate-700 shrink-0">관리분류:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({cat === '전체' ? books.length : books.filter(b => b.category === cat).length}권)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs (Desktop & Tablet Quick Filter) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100">
          <span className="text-xs font-extrabold text-slate-400 shrink-0 mr-1">분류 탭:</span>
          {categories.map((cat) => {
            const count = cat === '전체' ? books.length : books.filter((b) => b.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-700">
            예스24 베스트셀러 목록을 가져오는 중입니다...
          </p>
          <p className="text-xs text-slate-400">Google Apps Script 웹 앱 데이터 응답 수신 중</p>
        </div>
      )}

      {/* Requirement 2: Clean Card Grid Visualization */}
      {!loading && filteredBooks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const isTop3 = book.rank <= 3;
            return (
              <div
                key={`${book.rank}-${book.title}`}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200 hover:border-emerald-400 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Rank Ribbon */}
                <div
                  className={`absolute top-0 left-0 px-4 py-1 rounded-br-2xl text-xs font-black flex items-center space-x-1 z-10 ${
                    book.rank === 1
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                      : book.rank === 2
                      ? 'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
                      : book.rank === 3
                      ? 'bg-gradient-to-r from-amber-700 to-amber-800 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>BEST {book.rank}위</span>
                </div>

                <div>
                  {/* Category Pill */}
                  <div className="flex justify-end mb-3">
                    <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
                      {book.category || '기타'}
                    </span>
                  </div>

                  {/* Book Content layout */}
                  <div className="flex items-start space-x-4 my-2">
                    <div className="shrink-0 pt-1">
                      <BookCover
                        title={book.title}
                        author={book.author}
                        publisher={book.publisher}
                        category={book.category}
                        size="sm"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                        {book.title}
                      </h3>

                      <p className="text-xs text-slate-600 font-semibold mt-1 line-clamp-1">
                        {book.author}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        출판사: <span className="font-bold text-slate-600">{book.publisher || '정보없음'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="mt-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed min-h-[4.5rem]">
                    <p className="line-clamp-3 font-medium">
                      {book.description || '도서 상세 설명이 준비되어 있습니다.'}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-bold">
                    YES24 베스트
                  </span>

                  {onSelectBookForLog && (
                    <button
                      onClick={() =>
                        onSelectBookForLog({
                          title: book.title,
                          author: book.author,
                          publisher: book.publisher,
                          category: book.category,
                        })
                      }
                      className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-200 transition-all flex items-center space-x-1"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>이 책으로 독서록 작성 ➔</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBooks.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">검색 조건에 일치하는 도서가 없습니다.</h3>
          <p className="text-xs text-slate-500">
            검색어나 관리분류 필터를 변경해보세요.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('전체');
              setSearchQuery('');
            }}
            className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
          >
            전체 목록 보기
          </button>
        </div>
      )}
    </div>
  );
};
