/**
 * 모바일 및 태블릿 전용 전체화면 HUD 오버레이 메뉴(MobileMenuOverlay) 컴포넌트입니다.
 * 벤치마크(.mmenu) 표준:
 * - 딥 다크 블러 백드롭 (rgba(6,6,10,.96))
 * - 우상단 마젠타 닫기 버튼 (✕)
 * - 큼직한 Orbitron 볼드 헤딩 네비 링크
 * - 하단 "접속기 설치" 홀로그램 아케이드 버튼 및 카카오톡/전화 빠른 지원
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Download, MessageSquare, PhoneCall, X } from "lucide-react";
import type { ActionModalCategory } from "@/constants/daangnChatStory";
import { NAV_SECTIONS } from "@/constants/portalData";
import type { SiteConfig } from "@/types/portal";

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  siteConfig: SiteConfig;
  activeSectionId: string;
  onOpenAction: (category: ActionModalCategory, source: string) => void;
}

export function MobileMenuOverlay({
  isOpen,
  onClose,
  siteConfig,
  activeSectionId,
  onOpenAction,
}: MobileMenuOverlayProps) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="모바일 전체화면 네비게이션 메뉴"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#06060a]/96 p-6 sm:p-10 backdrop-blur-xl lg:hidden overflow-y-auto"
    >
      {/* 상단 바: 브랜드 및 우상단 마젠타 닫기 버튼 */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <span className="font-mono text-[11px] font-bold tracking-widest text-[#00E5FF]">
            SYSTEM NAVIGATION // ACCESS GRID
          </span>
          <p className="mt-0.5 text-lg font-black tracking-wider text-white">
            {siteConfig.brand_name}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="모바일 메뉴 닫기"
          className="flex h-10 w-10 items-center justify-center text-[#FF2E97] transition hover:scale-110"
        >
          <X className="h-7 w-7" />
        </button>
      </div>

      {/* 중앙: 벤치마크 스타일의 큼직한 Orbitron 네비 링크 목록 */}
      <nav className="my-auto flex flex-col items-center justify-center gap-2 py-6 text-center">
        {NAV_SECTIONS.map((item) => {
          const isActive = activeSectionId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={onClose}
              className={`font-display text-2xl sm:text-3xl font-black tracking-wide py-2.5 transition ${
                isActive
                  ? "text-[#00E5FF] drop-shadow-[0_0_18px_rgba(0,229,255,0.6)]"
                  : "text-white hover:text-[#00E5FF]"
              }`}
            >
              {item.label}
            </a>
          );
        })}

        <Link
          href="/admin"
          onClick={onClose}
          className="mt-2 font-mono text-xs tracking-widest text-[#8E95A9] hover:text-white"
        >
          [ CMS 관리자 시스템 ]
        </Link>
      </nav>

      {/* 하단: 접속기 설치 아케이드 버튼 & 24시 상담 버튼 */}
      <div className="space-y-3 border-t border-white/10 pt-5">
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenAction("client_download", "mobile_menu_download");
          }}
          className="chamfer-btn shine-cta flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#00E5FF] via-[#7DF9FF] to-[#00E5FF] py-3.5 font-display text-sm font-black text-[#00131a] shadow-[0_0_24px_rgba(0,229,255,0.45)]"
        >
          <Download className="h-4 w-4" />
          <span>접속기 설치 패키지 다운로드</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAction("phone_contact", "mobile_menu_phone");
            }}
            className="chamfer-btn flex items-center justify-center gap-1.5 bg-[#101019] border border-[#00E5FF]/40 py-2.5 font-mono text-xs font-bold text-[#00E5FF]"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>{siteConfig.cs_phone}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAction("kakao_consult", "mobile_menu_kakao");
            }}
            className="chamfer-btn flex items-center justify-center gap-1.5 bg-[#FEE500] py-2.5 font-display text-xs font-bold text-[#191919]"
          >
            <MessageSquare className="h-3.5 w-3.5 fill-current" />
            <span>카톡 24시 상담</span>
          </button>
        </div>
      </div>
    </div>
  );
}
