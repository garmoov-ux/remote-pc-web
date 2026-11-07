/**
 * "접속기 설치", "카카오톡", "우측하단 연락처" 클릭 시 각각 다른 맞춤형 내용으로
 * 당근마켓("당근양파"님) 채팅 요약과 AI 시대 필수 학습 메시지, 접속기 구현(시연용 패스)/PC방 제휴 구조를 안내하는 반응형 커스텀 모달입니다.
 */

"use client";

import { useEffect } from "react";
import {
  Bot,
  CheckCircle2,
  Cpu,
  Download,
  Handshake,
  MessageSquare,
  PhoneCall,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import {
  type ActionModalCategory,
  DAANGN_MODAL_SCENARIOS,
} from "@/constants/daangnChatStory";
import type { ClientRelease, SiteConfig } from "@/types/portal";
import { shortenSha256 } from "@/utils/formatters";

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ActionModalCategory;
  onChangeCategory: (category: ActionModalCategory) => void;
  release: ClientRelease;
  siteConfig: SiteConfig;
  triggerSection: string;
}

const CATEGORY_ORDER: readonly ActionModalCategory[] = [
  "client_download",
  "kakao_consult",
  "phone_contact",
] as const;

export function InstallGuideModal({
  isOpen,
  onClose,
  category,
  onChangeCategory,
  release,
  siteConfig,
  triggerSection,
}: InstallGuideModalProps) {
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

  const scenario = DAANGN_MODAL_SCENARIOS[category];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="daangn-story-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0A0A0F]/88 p-0 backdrop-blur-md sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="chamfer-panel relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden border border-[#00E5FF]/50 bg-[#101019] shadow-[0_0_60px_rgba(0,229,255,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 고정 상단 헤더 & 닫기 버튼 (모바일·태블릿·데스크톱 최적화) */}
        <div className="sticky top-0 z-20 border-b border-white/10 bg-[#101019]/95 px-4 pt-4 pb-3 backdrop-blur-md sm:px-7 sm:pt-6 sm:pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 border border-[#B4FF39]/40 bg-[#B4FF39]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-[#B4FF39] sm:text-[11px]">
                <Sparkles className="h-3 w-3 shrink-0" />
                <span>{scenario.badgeText}</span>
              </div>
              <h3
                id="daangn-story-modal-title"
                className="mt-2 text-base leading-snug font-black text-white sm:text-xl"
              >
                {scenario.headline}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="브리핑 모달 닫기"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 bg-white/5 text-[#C4CAD9] transition hover:border-[#00E5FF] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 3대 카테고리 전환 탭 (접속기 설치 / 카카오톡 / 우측하단 연락처 각각 다른 내용 확인 가능) */}
          <div
            role="tablist"
            aria-label="클릭 영역별 당근 채팅 요약 탭"
            className="mt-3.5 grid grid-cols-3 gap-1.5"
          >
            {CATEGORY_ORDER.map((catKey) => {
              const item = DAANGN_MODAL_SCENARIOS[catKey];
              const isSelected = category === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onChangeCategory(catKey)}
                  className={`flex items-center justify-center gap-1.5 border px-2 py-2 text-[11px] font-extrabold transition sm:px-3 sm:text-xs ${
                    isSelected
                      ? "border-[#00E5FF] bg-[#00E5FF] text-[#05080F] shadow-[0_0_15px_rgba(0,229,255,0.35)]"
                      : "border-white/15 bg-[#0A0A0F]/80 text-[#C4CAD9] hover:border-[#00E5FF]/50 hover:text-white"
                  }`}
                >
                  {catKey === "client_download" ? (
                    <Download className="h-3.5 w-3.5 shrink-0" />
                  ) : catKey === "kakao_consult" ? (
                    <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <PhoneCall className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="truncate">{item.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 스크롤 본문 영역 */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-7 sm:py-6">
          {/* 서브 헤드라인 & 당근마켓 채팅 배경 요약 박스 */}
          <div className="border-l-2 border-[#00E5FF] bg-[#0A0A0F]/90 p-3.5 sm:p-4">
            <p className="text-xs font-bold leading-relaxed text-[#00E5FF] sm:text-sm">
              {scenario.subHeadline}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#C4CAD9]">
              {scenario.chatContextSummary}
            </p>
          </div>

          {/* 3단계 핵심 브리핑 카드 */}
          <div className="space-y-3">
            {scenario.sections.map((sec, idx) => (
              <div
                key={sec.stepCode}
                className={`border p-3.5 sm:p-4 ${
                  idx === 0
                    ? "border-[#00E5FF]/40 bg-[#00E5FF]/5"
                    : idx === 1
                    ? "border-[#B4FF39]/35 bg-[#B4FF39]/4"
                    : "border-[#FF2E97]/35 bg-[#FF2E97]/4"
                }`}
              >
                <div className="flex items-center gap-2">
                  {idx === 0 ? (
                    <Cpu className="h-4 w-4 shrink-0 text-[#00E5FF]" />
                  ) : idx === 1 ? (
                    <Handshake className="h-4 w-4 shrink-0 text-[#B4FF39]" />
                  ) : (
                    <Bot className="h-4 w-4 shrink-0 text-[#FF2E97]" />
                  )}
                  <span className="font-mono text-[10px] font-black tracking-wider text-[#00E5FF] sm:text-[11px]">
                    {sec.stepCode}
                  </span>
                </div>
                <h4 className="mt-1 text-xs font-extrabold text-white sm:text-sm">
                  {sec.title}
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-[#C4CAD9]">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          {/* 접속기 구현 완료(시연용 패스) 및 PC방 제휴 상태 명세 박스 */}
          <div className="border border-white/12 bg-[#0A0A0F] p-3.5 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#B4FF39]" />
                <span className="text-xs font-extrabold text-white">
                  {scenario.techNoteTitle}
                </span>
              </div>
              <span className="border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#00E5FF]">
                TRIGGER // {triggerSection.toUpperCase()}
              </span>
            </div>

            <p className="mt-2.5 text-xs leading-relaxed text-[#C4CAD9]">
              {scenario.techNoteBody}
            </p>

            <div className="mt-3 grid grid-cols-1 gap-2 border-t border-white/10 pt-3 font-mono text-[11px] sm:grid-cols-3">
              <div className="bg-white/[0.02] p-2">
                <span className="block text-[10px] text-[#8E95A9]">
                  접속기 코어 엔진
                </span>
                <span className="font-bold text-[#B4FF39]">
                  구현 완료 (테스트 패스)
                </span>
              </div>
              <div className="bg-white/[0.02] p-2">
                <span className="block text-[10px] text-[#8E95A9]">
                  상용화 필수 조건
                </span>
                <span className="font-bold text-[#00E5FF]">
                  PC방 매장 가맹 제휴
                </span>
              </div>
              <div className="bg-white/[0.02] p-2">
                <span className="block text-[10px] text-[#8E95A9]">
                  패키지 무결성 ({release.version})
                </span>
                <span className="font-bold text-white">
                  {shortenSha256(release.sha256_hash)}
                </span>
              </div>
            </div>
          </div>

          {/* 하단 당근양파님 응원 인용구 */}
          <div className="flex items-start gap-2.5 border border-[#B4FF39]/30 bg-[#B4FF39]/6 p-3.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#B4FF39]" />
            <p className="text-xs font-bold leading-relaxed text-white">
              &ldquo;{scenario.closingQuote}&rdquo;
            </p>
          </div>
        </div>

        {/* 고정 하단 액션 푸터 */}
        <div className="sticky bottom-0 z-20 flex flex-col gap-2 border-t border-white/10 bg-[#101019]/95 px-4 py-3 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-4">
          <p className="text-[11px] text-[#8E95A9]">
            상단 3개 탭을 눌러{" "}
            <strong className="text-white">
              접속기 설치 · 카카오톡 · 우측하단 연락처
            </strong>
            별 요약 메시지를 모두 확인해 보세요.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="chamfer-btn shine-cta shrink-0 bg-[#00E5FF] px-6 py-2.5 text-xs font-black text-[#05080F] shadow-[0_0_20px_rgba(0,229,255,0.4)] transition hover:bg-[#4DF0FF] sm:text-sm"
          >
            내용 확인 닫기 ({siteConfig.brand_name})
          </button>
        </div>
      </div>
    </div>
  );
}
