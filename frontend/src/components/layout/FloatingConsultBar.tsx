/**
 * 우측 하단 고정 플로팅 실시간 상담 및 빠른 다운로드 바(FloatingConsultBar) 컴포넌트입니다.
 */

"use client";

import { ArrowUp, Download, MessageSquare, PhoneCall } from "lucide-react";
import type { SiteConfig } from "@/types/portal";
import { toTelHref } from "@/utils/formatters";

interface FloatingConsultBarProps {
  siteConfig: SiteConfig;
  onOpenDownload: (source: string) => void;
}

export function FloatingConsultBar({
  siteConfig,
  onOpenDownload,
}: FloatingConsultBarProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside
      aria-label="실시간 빠른 상담 및 다운로드 독"
      className="fixed right-4 bottom-5 z-30 flex flex-col gap-2 sm:right-6"
    >
      <a
        href={siteConfig.kakao_channel_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 border border-[#FEE500]/50 bg-[#101019]/95 px-3.5 py-2.5 text-xs font-extrabold text-[#FEE500] shadow-lg backdrop-blur-md transition hover:bg-[#FEE500] hover:text-[#05080F]"
      >
        <MessageSquare className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">카톡 24시 상담</span>
      </a>

      <a
        href={toTelHref(siteConfig.cs_phone)}
        className="flex items-center gap-2 border border-[#B4FF39]/40 bg-[#101019]/95 px-3.5 py-2.5 text-xs font-extrabold text-[#B4FF39] shadow-lg backdrop-blur-md transition hover:bg-[#B4FF39] hover:text-[#05080F]"
      >
        <PhoneCall className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">전화 상담</span>
      </a>

      <button
        type="button"
        onClick={() => onOpenDownload("floating_bar")}
        className="flex items-center gap-2 border border-[#00E5FF]/50 bg-[#00E5FF] px-3.5 py-2.5 text-xs font-extrabold text-[#05080F] shadow-[0_0_20px_rgba(0,229,255,0.4)] transition hover:bg-[#4DF0FF]"
      >
        <Download className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">접속기 설치</span>
      </button>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="맨 위로 이동"
        className="flex items-center justify-center border border-white/15 bg-[#101019]/90 p-2.5 text-[#8E95A9] transition hover:border-[#00E5FF] hover:text-white"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </aside>
  );
}
