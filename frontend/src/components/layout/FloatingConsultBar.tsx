/**
 * 우측 하단 고정 플로팅 실시간 상담 및 빠른 다운로드 바(FloatingConsultBar) 컴포넌트입니다.
 * 데스크톱, 태블릿, 모바일 전 해상도에서 "카톡 24시 상담", "우측하단 연락처", "접속기 설치" 클릭 시
 * 각각 다른 당근마켓(당근양파님) 요약 브리핑 모달을 오픈합니다.
 */

"use client";

import { ArrowUp, Download, MessageSquare, PhoneCall } from "lucide-react";
import type { ActionModalCategory } from "@/constants/daangnChatStory";
import type { SiteConfig } from "@/types/portal";

interface FloatingConsultBarProps {
  siteConfig: SiteConfig;
  onOpenAction: (category: ActionModalCategory, source: string) => void;
}

export function FloatingConsultBar({
  siteConfig,
  onOpenAction,
}: FloatingConsultBarProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside
      aria-label="실시간 빠른 상담 및 다운로드 독"
      className="fixed right-3 bottom-4 z-30 flex flex-col items-end gap-2 sm:right-6 sm:bottom-6"
    >
      <button
        type="button"
        onClick={() => onOpenAction("kakao_consult", "floating_kakao")}
        className="group flex items-center gap-2 border border-[#FEE500]/60 bg-[#101019]/95 px-3 py-2 text-[11px] font-extrabold text-[#FEE500] shadow-lg backdrop-blur-md transition hover:bg-[#FEE500] hover:text-[#05080F] sm:px-3.5 sm:py-2.5 sm:text-xs"
      >
        <MessageSquare className="h-4 w-4 shrink-0" />
        <span>카톡 24시 상담</span>
      </button>

      <button
        type="button"
        onClick={() => onOpenAction("phone_contact", "floating_phone")}
        title={`24시 고객센터 ${siteConfig.cs_phone}`}
        className="flex items-center gap-2 border border-[#B4FF39]/50 bg-[#101019]/95 px-3 py-2 text-[11px] font-extrabold text-[#B4FF39] shadow-lg backdrop-blur-md transition hover:bg-[#B4FF39] hover:text-[#05080F] sm:px-3.5 sm:py-2.5 sm:text-xs"
      >
        <PhoneCall className="h-4 w-4 shrink-0" />
        <span>연락처 {siteConfig.cs_phone}</span>
      </button>

      <button
        type="button"
        onClick={() => onOpenAction("client_download", "floating_download")}
        className="flex items-center gap-2 border border-[#00E5FF]/60 bg-[#00E5FF] px-3 py-2 text-[11px] font-extrabold text-[#05080F] shadow-[0_0_20px_rgba(0,229,255,0.4)] transition hover:bg-[#4DF0FF] sm:px-3.5 sm:py-2.5 sm:text-xs"
      >
        <Download className="h-4 w-4 shrink-0" />
        <span>접속기 설치</span>
      </button>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="맨 위로 이동"
        className="flex items-center justify-center border border-white/15 bg-[#101019]/90 p-2 text-[#8E95A9] transition hover:border-[#00E5FF] hover:text-white sm:p-2.5"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </aside>
  );
}
