/**
 * 모바일 및 태블릿 전용 전체화면 HUD 드로어 메뉴(MobileMenuOverlay) 컴포넌트입니다.
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
      aria-label="모바일 네비게이션 메뉴"
      className="fixed inset-0 z-50 flex flex-col bg-[#0A0A0F]/95 p-6 backdrop-blur-xl lg:hidden"
    >
      {/* 상단 닫기 바 */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-[#00E5FF]">
            NAVIGATION // HUD MENU
          </span>
          <p className="text-lg font-extrabold text-white">
            {siteConfig.brand_name}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="모바일 메뉴 닫기"
          className="inline-flex h-10 w-10 items-center justify-center border border-white/15 bg-white/5 text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 섹션 이동 링크 목록 */}
      <nav className="mt-6 flex flex-1 flex-col gap-2 overflow-y-auto">
        {NAV_SECTIONS.map((item) => {
          const isActive = activeSectionId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={onClose}
              className={`flex items-center justify-between border px-4 py-3.5 text-base font-bold transition ${
                isActive
                  ? "border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]"
                  : "border-white/10 bg-white/[0.02] text-white hover:border-white/30"
              }`}
            >
              <span>{item.label}</span>
              <span className="font-mono text-xs text-[#8E95A9]">
                SEC // {item.code}
              </span>
            </a>
          );
        })}

        <Link
          href="/admin"
          onClick={onClose}
          className="mt-2 flex items-center justify-between border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-semibold text-[#C4CAD9]"
        >
          <span>관리자 CMS 대시보드</span>
          <span className="font-mono text-xs text-[#00E5FF]">ADMIN</span>
        </Link>
      </nav>

      {/* 하단 즉시 다운로드 및 24시 고객센터 버튼 */}
      <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenAction("client_download", "mobile_menu_download");
          }}
          className="chamfer-btn flex w-full items-center justify-center gap-2 bg-[#00E5FF] py-3.5 text-sm font-extrabold text-[#05080F]"
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
            className="flex items-center justify-center gap-1.5 border border-white/15 bg-white/5 py-3 text-xs font-bold text-white"
          >
            <PhoneCall className="h-3.5 w-3.5 text-[#B4FF39]" />
            <span>{siteConfig.cs_phone}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAction("kakao_consult", "mobile_menu_kakao");
            }}
            className="flex items-center justify-center gap-1.5 border border-[#FEE500]/40 bg-[#FEE500]/10 py-3 text-xs font-bold text-[#FEE500]"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>카카오톡 24시 상담</span>
          </button>
        </div>
      </div>
    </div>
  );
}
