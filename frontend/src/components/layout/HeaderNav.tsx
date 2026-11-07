/**
 * 상단 고정 HUD 커맨드 바 네비게이션(HeaderNav) 컴포넌트입니다.
 * 브랜드 아이덴티티(실시간 가동 도트), 5대 섹션 스크롤 스파이 브래킷 링크, 테마 토글, 접속기 설치 CTA 및 모바일 햄버거 버튼을 포함합니다.
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
    <header className="fixed inset-x-0 top-0 z-40 h-[72px] border-b border-[#00E5FF]/20 bg-[#0A0A0F]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1360px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 좌측 브랜드 로고 + 실시간 가동 인디케이터 */}
        <div className="flex items-center gap-3">
          <a
            href="#top"
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center border border-[#00E5FF]/50 bg-[#00E5FF]/10 text-[#00E5FF] transition group-hover:bg-[#00E5FF] group-hover:text-[#05080F]">
              <Monitor className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                  {siteConfig.brand_name}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B4FF39]/40 bg-[#B4FF39]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#B4FF39]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#B4FF39]" />
                  실시간 가동
                </span>
              </div>
              <p className="font-mono text-[10px] tracking-widest text-[#8E95A9]">
                REMOTE PC BANG // ACCESS GRID
              </p>
            </div>
          </a>
        </div>

        {/* 중앙 데스크톱 5대 핵심 섹션 스크롤 스파이 네비게이션 */}
        <nav
          aria-label="주요 섹션 메뉴"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_SECTIONS.map((item) => {
            const isActive = activeSectionId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative px-3.5 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "text-[#00E5FF]"
                    : "text-[#C4CAD9] hover:text-white"
                }`}
              >
                <span
                  className={`mr-1 font-mono text-xs transition ${
                    isActive ? "opacity-100 text-[#00E5FF]" : "opacity-0"
                  }`}
                >
                  [
                </span>
                <span>{item.label}</span>
                <span
                  className={`ml-1 font-mono text-xs transition ${
                    isActive ? "opacity-100 text-[#00E5FF]" : "opacity-0"
                  }`}
                >
                  ]
                </span>
                {isActive && (
                  <span className="absolute inset-x-3 bottom-0 h-[2px] bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* 우측 테마 전환 + 관리자 링크 + 접속기 설치 CTA + 모바일 메뉴 버튼 */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleTheme}
            title="사이버 HUD / 웜 다크 글래스 테마 전환"
            className="hidden items-center gap-1.5 border border-white/15 bg-white/5 px-2.5 py-1.5 font-mono text-[11px] font-medium text-[#C4CAD9] transition hover:border-[#00E5FF]/50 hover:text-white xl:inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#00E5FF]" />
            <span>{themeMode === "cyber" ? "CYBER HUD" : "WARM GLASS"}</span>
          </button>

          <Link
            href="/admin"
            className="hidden border border-white/15 bg-white/5 px-2.5 py-1.5 font-mono text-[11px] text-[#8E95A9] transition hover:border-white/30 hover:text-white sm:inline-block"
          >
            CMS 관리
          </Link>

          <button
            type="button"
            onClick={() => onOpenDownload("header_nav")}
            className="chamfer-btn shine-cta inline-flex items-center gap-1.5 bg-[#00E5FF] px-4 py-2 text-xs font-extrabold text-[#05080F] shadow-[0_0_18px_rgba(0,229,255,0.35)] transition hover:bg-[#4DF0FF] sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <Download className="h-4 w-4" />
            <span>접속기 설치</span>
          </button>

          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="모바일 전체 메뉴 열기"
            className="inline-flex h-10 w-10 items-center justify-center border border-white/15 bg-white/5 text-white transition hover:border-[#00E5FF] lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
