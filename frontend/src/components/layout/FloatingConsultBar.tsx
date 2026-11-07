/**
 * 우측 하단 고정 플로팅 실시간 상담 및 빠른 다운로드 바(FloatingConsultBar) 컴포넌트입니다.
 * 벤치마크(.csfix) 표준:
 * - 데스크톱/태블릿: 텍스트가 포함된 챔퍼 버튼 바
 * - 모바일(<= 640px): 화면 가림을 방지하기 위해 텍스트(span)를 숨기고 콤팩트한 사각 챔퍼 아이콘 버튼으로 자동 전환
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
      className="fixed right-3 bottom-4 sm:right-5 sm:bottom-5 z-40 flex flex-col items-end gap-2"
    >
      {/* 1. 카카오톡 24시 상담 버튼 */}
      <button
        type="button"
        onClick={() => onOpenAction("kakao_consult", "floating_kakao")}
        title="카카오톡 24시 실시간 상담"
        className="chamfer-btn flex items-center gap-2 bg-[#FEE500] p-2.5 sm:px-3.5 sm:py-2.5 text-[#191919] shadow-lg transition hover:brightness-105 active:translate-y-0.5"
      >
        <MessageSquare className="h-4 w-4 shrink-0 fill-current" />
        <span className="hidden sm:inline font-display text-xs font-bold">
          카톡 24시 상담
        </span>
      </button>

      {/* 2. 전화 / 원격지원 상담 버튼 */}
      <button
        type="button"
        onClick={() => onOpenAction("phone_contact", "floating_phone")}
        title={`24시 고객센터 ${siteConfig.cs_phone}`}
        className="chamfer-btn flex items-center gap-2 bg-[#00E5FF] p-2.5 sm:px-3.5 sm:py-2.5 text-[#00131a] shadow-[0_0_18px_rgba(0,229,255,0.4)] transition hover:brightness-105 active:translate-y-0.5"
      >
        <PhoneCall className="h-4 w-4 shrink-0 fill-current" />
        <span className="hidden sm:inline font-mono text-xs font-bold">
          {siteConfig.cs_phone}
        </span>
      </button>

      {/* 3. 접속기 즉시 설치 버튼 */}
      <button
        type="button"
        onClick={() => onOpenAction("client_download", "floating_download")}
        title="접속기 설치 패키지 다운로드"
        className="chamfer-btn flex items-center gap-2 border border-[#00E5FF]/60 bg-[#101019]/95 p-2.5 sm:px-3.5 sm:py-2.5 text-[#00E5FF] shadow-lg backdrop-blur-md transition hover:bg-[#00E5FF] hover:text-[#00131a] active:translate-y-0.5"
      >
        <Download className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline font-display text-xs font-extrabold">
          접속기 설치
        </span>
      </button>

      {/* 4. 맨 위로 가기 버튼 */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="맨 위로 이동"
        className="chamfer-btn flex items-center justify-center border border-white/15 bg-[#101019]/90 p-2 sm:p-2 text-[#8E95A9] transition hover:border-[#00E5FF] hover:text-white"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </aside>
  );
}
