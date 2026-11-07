/**
 * 상단 고정 HUD 커맨드 바 네비게이션(HeaderNav) 컴포넌트입니다.
 * 벤치마크(원격플러그인피시.kr) 표준:
 * - 데스크톱(> 900px): 브랜드, 중앙 5대 섹션 스크롤 스파이 링크, 테마 토글, 우측 "접속기 설치" 아케이드 버튼
 * - 태블릿/모바일(<= 900px): 모바일 공간 최적화를 위해 접속기 버튼과 네비 링크를 숨기고, 우측에 햄버거 메뉴 버튼(▤)만 깔끔하게 노출
 */

"use client";

import Link from "next/link";
import { Download, Menu, Monitor, Sparkles } from "lucide-react";
import { NAV_SECTIONS } from "@/constants/portalData";
import type { PortalThemeMode, SiteConfig } from "@/types/portal";

interface HeaderNavProps {
  siteConfig: SiteConfig;
  activeSectionId: string;
  themeMode: PortalThemeMode;
  onToggleTheme: () => void;
  onOpenDownload: (source: string) => void;
  onOpenMobileMenu: () => void;
}

export function HeaderNav({
  siteConfig,
  activeSectionId,
  themeMode,
  onToggleTheme,
  onOpenDownload,
  onOpenMobileMenu,
}: HeaderNavProps) {
  return (
    <header className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-24px)] sm:w-[calc(100%-32px)] max-w-[1200px]">
      <div className="relative flex items-center justify-between border border-[#00E5FF]/25 bg-[#0e0e18]/92 px-3 sm:px-4 py-2 sm:py-2.5 shadow-[0_0_0_1px_rgba(0,229,255,0.12),0_18px_45px_rgba(0,0,0,0.65)] backdrop-blur-xl chamfer-panel">
        {/* 좌측 액센트 시안 바 */}
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00E5FF] shadow-[0_0_12px_#00E5FF]"
        />

        {/* 좌측 브랜드 로고 + 실시간 가동 ONLINE 인디케이터 */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="#top"
            className="group flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center border border-[#00E5FF]/60 bg-[#00E5FF] text-[#05080F] shadow-[0_0_14px_rgba(0,229,255,0.5)] chamfer-btn">
              <Monitor className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display text-sm sm:text-base font-black tracking-wider text-[#00E5FF] text-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                  {siteConfig.brand_name}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#B4FF39]/40 bg-[#B4FF39]/10 px-1.5 sm:px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold text-[#B4FF39]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#B4FF39]" />
                  ONLINE
                </span>
              </div>
              <p className="hidden xs:block font-mono text-[9px] sm:text-[10px] tracking-widest text-[#8E95A9]">
                REMOTE PC BANG // ACCESS GRID
              </p>
            </div>
          </Link>
        </div>

        {/* 중앙 데스크톱(> 900px / lg) 5대 섹션 스크롤 스파이 네비게이션 */}
        <nav
          aria-label="주요 섹션 메뉴"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {NAV_SECTIONS.map((item) => {
            const isActive = activeSectionId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative px-3 py-1.5 text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? "text-white font-extrabold"
                    : "text-[#C4CAD9] hover:text-[#00E5FF]"
                }`}
              >
                <span
                  className={`mr-0.5 font-mono text-xs transition ${
                    isActive ? "opacity-100 text-[#00E5FF]" : "opacity-0"
                  }`}
                >
                  [
                </span>
                <span>{item.label}</span>
                <span
                  className={`ml-0.5 font-mono text-xs transition ${
                    isActive ? "opacity-100 text-[#00E5FF]" : "opacity-0"
                  }`}
                >
                  ]
                </span>
                {isActive && (
                  <span className="absolute inset-x-2 bottom-0 h-[2px] bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* 우측 영역:
            - 데스크톱: 테마 토글 + CMS 관리 + "접속기 설치" 아케이드 버튼
            - 태블릿/모바일(<= 900px): 화면 낭비 방지를 위해 햄버거 메뉴 버튼만 깔끔하게 노출
        */}
        <div className="flex items-center gap-2">
          {/* 테마 전환 버튼 (데스크톱 전용) */}
          <button
            type="button"
            onClick={onToggleTheme}
            title="사이버 HUD / 웜 다크 글래스 테마 전환"
            className="hidden xl:inline-flex items-center gap-1.5 border border-white/15 bg-white/5 px-2 py-1 font-mono text-[10px] font-medium text-[#C4CAD9] transition hover:border-[#00E5FF]/50 hover:text-white"
          >
            <Sparkles className="h-3 w-3 text-[#00E5FF]" />
            <span>{themeMode === "cyber" ? "CYBER" : "WARM"}</span>
          </button>

          {/* CMS 관리 링크 (데스크톱 전용) */}
          <Link
            href="/admin"
            className="hidden sm:inline-block border border-white/15 bg-white/5 px-2.5 py-1.5 font-mono text-[11px] text-[#8E95A9] transition hover:border-white/30 hover:text-white"
          >
            CMS 관리
          </Link>

          {/* 접속기 설치 버튼 (데스크톱 전용: 900px 이상에서만 노출, 모바일에서는 햄버거 메뉴 및 히어로에서 제공) */}
          <button
            type="button"
            onClick={() => onOpenDownload("header_nav")}
            className="hidden lg:inline-flex chamfer-btn shine-cta items-center gap-1.5 bg-gradient-to-r from-[#00E5FF] via-[#7DF9FF] to-[#00E5FF] px-4 py-2 text-xs font-black text-[#00131a] shadow-[0_0_20px_rgba(0,229,255,0.45)] transition hover:brightness-110 active:translate-y-0.5"
          >
            <Download className="h-4 w-4" />
            <span>접속기 설치</span>
          </button>

          {/* 모바일/태블릿 햄버거 메뉴 토글 버튼 (<= 900px) */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="모바일 전체 메뉴 열기"
            className="inline-flex lg:hidden h-9 w-9 items-center justify-center border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF] transition hover:bg-[#00E5FF] hover:text-[#05080F]"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
