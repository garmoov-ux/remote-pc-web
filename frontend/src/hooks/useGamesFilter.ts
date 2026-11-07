/**
 * 서비스 게임 카탈로그의 장르 탭 필터링, 한글 초성 실시간 검색, 대표 12종/전체 50종 토글을 제어하는 커스텀 훅입니다.
 */

"use client";

import { useMemo, useState } from "react";
import type { GameGenreType, ServiceGame } from "@/types/portal";
import { matchesKoreanSearch } from "@/utils/choseongSearch";

export const GAME_GENRE_TABS: readonly GameGenreType[] = [
  "전체",
  "MMORPG",
  "스포츠/FPS",
  "액션/기타",
] as const;

export function useGamesFilter(games: ServiceGame[]) {
  const [selectedGenre, setSelectedGenre] = useState<GameGenreType>("전체");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAllGames, setShowAllGames] = useState<boolean>(false);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const genreMatches =
        selectedGenre === "전체" || game.genre === selectedGenre;
      const queryMatches =
        matchesKoreanSearch(game.title, searchQuery) ||
        matchesKoreanSearch(game.badge_label, searchQuery) ||
        matchesKoreanSearch(game.benefit_summary, searchQuery);
      return genreMatches && queryMatches;
    });
  }, [games, selectedGenre, searchQuery]);

  const visibleGames = useMemo(() => {
    const isFiltering =
      selectedGenre !== "전체" || searchQuery.trim().length > 0;
    if (showAllGames || isFiltering) {
      return filteredGames;
    }
    return filteredGames.slice(0, 12);
  }, [filteredGames, showAllGames, selectedGenre, searchQuery]);

  return {
    selectedGenre,
    setSelectedGenre,
    searchQuery,
    setSearchQuery,
    showAllGames,
    setShowAllGames,
    totalFilteredCount: filteredGames.length,
    visibleGames,
  };
}
