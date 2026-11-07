/**
 * 서비스 게임 카탈로그 섹션(#games — GamesCatalogSection) 컴포넌트입니다.
 * 50종 게임 고밀도 그리드(데스크톱 6열 / 태블릿 4열 / 모바일 2열), 장르 탭 필터, 한글 초성 검색, 바로접속/제한 게임 정책 배너를 제공합니다.
 */

"use client";

import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { GAME_GENRE_TABS, useGamesFilter } from "@/hooks/useGamesFilter";
import type { ServiceGame } from "@/types/portal";

interface GamesCatalogSectionProps {
  games: ServiceGame[];
}

export function GamesCatalogSection({ games }: GamesCatalogSectionProps) {
  const {
    selectedGenre,
    setSelectedGenre,
    searchQuery,
    setSearchQuery,
    showAllGames,
    setShowAllGames,
    totalFilteredCount,
    visibleGames,
  } = useGamesFilter(games);

  return (
    <section
      id="games"
      aria-labelledby="games-section-title"
      className="relative z-10 scroll-mt-20 border-t border-white/10 bg-[#0D0D16]/75 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* 섹션 상단 헤더 */}
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-[#00E5FF]">
              <span>SEC // 02</span>
              <span className="h-[1px] w-8 bg-[#00E5FF]/50" />
              <span>SUPPORTED GAMES ARCHIVE</span>
            </div>
            <h2
              id="games-section-title"
              className="mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl"
            >
              PC방 프리미엄 혜택 지원 게임
            </h2>
            <p className="mt-2 text-sm text-[#C4CAD9] sm:text-base">
              리니지, FC온라인, 메이플스토리, 로스트아크 등 50여 종 인기 게임의
              PC방 혜택을 집에서 그대로 누리세요.
            </p>
          </div>

          {/* 한글 초성 실시간 검색창 */}
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#00E5FF]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="게임명 또는 초성 검색 (예: ㄹㄴㅈ, ㅁㅇㅍ)"
              aria-label="게임명 또는 한글 초성 검색"
              className="w-full border border-white/20 bg-[#0A0A0F] py-2.5 pr-9 pl-10 text-xs text-white placeholder-[#8E95A9] focus:border-[#00E5FF] focus:outline-none sm:text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="검색어 지우기"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 p-1 text-[#8E95A9] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* 장르 탭 필터 + 검색 결과 카운트 */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div role="tablist" aria-label="게임 장르 필터" className="flex flex-wrap gap-2">
            {GAME_GENRE_TABS.map((genre) => {
              const active = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 text-xs font-extrabold transition sm:text-sm ${
                    active
                      ? "border border-[#00E5FF] bg-[#00E5FF] text-[#05080F] shadow-[0_0_15px_rgba(0,229,255,0.35)]"
                      : "border border-white/15 bg-[#101019] text-[#C4CAD9] hover:border-[#00E5FF]/50 hover:text-white"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          <span className="font-mono text-xs text-[#8E95A9]">
            DISPLAYING{" "}
            <strong className="text-[#00E5FF]">{visibleGames.length}</strong> /{" "}
            {totalFilteredCount} GAMES
          </span>
        </div>

        {/* 고밀도 게임 카드 그리드 (데스크톱 6열 / 태블릿 4열 / 모바일 2열) */}
        {visibleGames.length === 0 ? (
          <div className="border border-white/10 bg-[#101019] p-12 text-center">
            <p className="text-base font-bold text-white">
              검색 조건과 일치하는 게임이 없습니다.
            </p>
            <p className="mt-1 text-xs text-[#8E95A9]">
              리스트에 없는 게임도 24시간 고객센터로 요청하시면 즉시 설치 및 세팅해
              드립니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {visibleGames.map((game) => {
              const isRestricted = game.support_status === "restricted";
              const isDirect = game.support_status === "direct";
              return (
                <article
                  key={game.game_code}
                  className={`group relative flex flex-col overflow-hidden border bg-[#101019] transition duration-300 ${
                    isRestricted
                      ? "border-[#FF3B5C]/35 opacity-80"
                      : "border-white/10 hover:-translate-y-1 hover:border-[#00E5FF]/70 hover:shadow-[0_10px_25px_rgba(0,229,255,0.16)]"
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0A0F]">
                    <Image
                      src={game.thumbnail_url}
                      alt={game.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101019] via-transparent to-transparent" />

                    {/* 좌상단 인덱스 코드 */}
                    <span className="absolute top-2 left-2 bg-[#0A0A0F]/85 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#8E95A9]">
                      {game.game_code}
                    </span>

                    {/* 우상단 상태 배지 */}
                    <span
                      className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-extrabold ${
                        isRestricted
                          ? "bg-[#FF3B5C] text-white"
                          : isDirect
                          ? "bg-[#B4FF39] text-[#05080F]"
                          : "border border-[#00E5FF]/50 bg-[#0A0A0F]/90 text-[#00E5FF]"
                      }`}
                    >
                      {game.badge_label}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-3.5">
                    <div>
                      <span className="font-mono text-[10px] text-[#8E95A9]">
                        {game.genre}
                      </span>
                      <h3 className="mt-0.5 line-clamp-1 text-sm font-extrabold text-white group-hover:text-[#00E5FF]">
                        {game.title}
                      </h3>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-[#C4CAD9]">
                      {game.benefit_summary}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* 전체 50종 게임 토글 버튼 */}
        {selectedGenre === "전체" && !searchQuery.trim() && games.length > 12 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllGames((prev) => !prev)}
              className="chamfer-btn inline-flex items-center gap-2 border border-[#00E5FF]/50 bg-[#101019] px-7 py-3 text-xs font-extrabold text-[#00E5FF] transition hover:bg-[#00E5FF] hover:text-[#05080F] sm:text-sm"
            >
              {showAllGames ? (
                <>
                  <span>대표 인기 게임 12종만 접기</span>
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>전체 {games.length}종 서비스 게임 모두 펼치기</span>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* 하단 바로접속 지원 & 보안 정책 이용 제한 게임 명확 고지 배너 */}
        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex items-start gap-3.5 border border-[#B4FF39]/35 bg-[#B4FF39]/[0.05] p-4 sm:p-5">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#B4FF39]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white">
                  로스트아크 · 메이플스토리 · FC온라인 원격PC방 바로접속 지원!
                </span>
                <Sparkles className="h-3.5 w-3.5 text-[#B4FF39]" />
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#C4CAD9]">
                사전 패치가 완료된 전용 좌석으로 즉시 배정되며, 리스트에 없는 스팀·배틀넷·온라인
                게임도 고객센터로 문의하시면 즉시 세팅해 드립니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 border border-[#FF3B5C]/40 bg-[#FF3B5C]/[0.06] p-4 sm:p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#FF3B5C]" />
            <div>
              <span className="text-sm font-extrabold text-white">
                보안 정책상 원격 이용 불가 게임 안내 (던파 · 롤 · 발로란트)
              </span>
              <p className="mt-1 text-xs leading-relaxed text-[#C4CAD9]">
                게임사 자체 원격 차단 및 Riot Vanguard 커널 보안 정책으로 인해{" "}
                <strong className="text-[#FF3B5C]">
                  던전앤파이터, 리그 오브 레전드(LoL), 발로란트
                </strong>
                는 원격PC방 환경에서 이용이 불가합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

