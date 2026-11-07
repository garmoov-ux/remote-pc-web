/**
 * 공지사항·필수 주의사항·원격지원·24시간 고객센터 섹션(#notice — NoticeAndCareSection) 컴포넌트입니다.
 * 1) 접속기 정상 종료 2단계, 2) 20분 의무 사용 안내, 3) AnyDesk 원격지원 안내, 4) 24시간 고객센터(전화/문자/카카오톡) 모달 연동을 제공합니다.
 */

import {
  AlertOctagon,
  Clock,
  ExternalLink,
  Headset,
  MessageSquare,
  PhoneCall,
  Send,
  Wrench,
} from "lucide-react";
import type { ActionModalCategory } from "@/constants/daangnChatStory";
import type { NoticeItem, SiteConfig } from "@/types/portal";

interface NoticeAndCareSectionProps {
  notices: NoticeItem[];
  siteConfig: SiteConfig;
  onOpenAction: (category: ActionModalCategory, source: string) => void;
}

export function NoticeAndCareSection({
  notices,
  siteConfig,
  onOpenAction,
}: NoticeAndCareSectionProps) {
  return (
    <section
      id="notice"
      aria-labelledby="notice-section-title"
      className="relative z-10 scroll-mt-20 border-t border-white/10 bg-[#0D0D16]/80 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8">
        {/* 섹션 상단 헤더 */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-[#FF2E97]">
            <span>SEC // 04</span>
            <span className="h-px w-8 bg-[#FF2E97]/50" />
            <span>MANDATORY RULES & 24/7 CARE</span>
          </div>
          <h2
            id="notice-section-title"
            className="mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl"
          >
            필수 이용 수칙 및 24시간 고객센터
          </h2>
          <p className="mt-2 text-sm text-[#C4CAD9] sm:text-base">
            의도치 않은 시간 차감이나 계정 보호 제한을 예방하기 위해 아래 3가지
            핵심 수칙을 반드시 확인해 주세요.
          </p>
        </div>

        {/* 필수 공지 3종 카드 그리드 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {notices.map((notice) => {
            const isExitRule = notice.category === "exit_rule";
            const isMandatory = notice.category === "mandatory_time";

            return (
              <article
                key={notice.id}
                className={`chamfer-panel flex flex-col justify-between border bg-[#101019] p-6 sm:p-7 ${isExitRule
                    ? "border-[#FF2E97]/50 shadow-[0_0_30px_rgba(255,46,151,0.12)]"
                    : isMandatory
                      ? "border-[#FFB800]/45"
                      : "border-[#00E5FF]/45"
                  }`}
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] font-bold ${isExitRule
                          ? "bg-[#FF2E97]/15 text-[#FF2E97]"
                          : isMandatory
                            ? "bg-[#FFB800]/15 text-[#FFB800]"
                            : "bg-[#00E5FF]/15 text-[#00E5FF]"
                        }`}
                    >
                      {isExitRule ? (
                        <AlertOctagon className="h-3.5 w-3.5" />
                      ) : isMandatory ? (
                        <Clock className="h-3.5 w-3.5" />
                      ) : (
                        <Wrench className="h-3.5 w-3.5" />
                      )}
                      <span>{notice.badge_text}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-white sm:text-xl">
                    {notice.title}
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#C4CAD9] sm:text-sm">
                    {notice.summary}
                  </p>

                  {/* 단계별 상세 가이드 */}
                  <div className="mt-5 space-y-2.5">
                    {notice.steps_json.map((step) => (
                      <div
                        key={step.step_no}
                        className="border border-white/10 bg-[#0A0A0F]/90 p-3.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-black text-[#00E5FF]">
                            {step.step_no}
                          </span>
                          <strong className="text-xs font-extrabold text-white sm:text-sm">
                            {step.title}
                          </strong>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-[#8E95A9]">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {notice.cta_url && notice.cta_label && (
                  <div className="mt-5 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        onOpenAction("phone_contact", "notice_anydesk")
                      }
                      className="chamfer-btn flex w-full items-center justify-center gap-2 bg-[#00E5FF] py-3 text-xs font-extrabold text-[#05080F] transition hover:bg-[#4DF0FF]"
                    >
                      <span>{notice.cta_label}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* 하단 24시간 실시간 고객센터 통합 데스크 배너 */}
        <div className="chamfer-panel mt-10 border border-[#00E5FF]/40 bg-linear-to-r from-[#101019] via-[#131424] to-[#101019] p-6 sm:p-8">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#B4FF39]">
                <Headset className="h-4 w-4" />
                <span>365일 24시간 연중무휴 실시간 기술지원 데스크</span>
              </div>
              <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
                설치·접속·사운드·해상도 등 불편 사항이 있으신가요?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#C4CAD9] sm:text-sm">
                새벽 시간에도 전문 엔지니어가 상시 대기 중입니다. 전화, 문자 또는
                카카오톡 채널로 연락해 주시면 즉시 확인하여 처리해 드립니다.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
              <button
                type="button"
                onClick={() => onOpenAction("phone_contact", "notice_cs_phone")}
                className="chamfer-btn flex items-center justify-center gap-2 bg-[#00E5FF] px-5 py-3.5 text-xs font-extrabold text-[#05080F] transition hover:bg-[#4DF0FF] sm:text-sm"
              >
                <PhoneCall className="h-4 w-4" />
                <span>전화 {siteConfig.cs_phone}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAction("phone_contact", "notice_cs_sms")}
                className="flex items-center justify-center gap-1.5 border border-white/20 bg-white/5 px-4 py-3.5 text-xs font-bold text-white transition hover:border-[#00E5FF] sm:text-sm"
              >
                <Send className="h-3.5 w-3.5 text-[#00E5FF]" />
                <span>문자 상담</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAction("kakao_consult", "notice_cs_kakao")}
                className="flex items-center justify-center gap-1.5 border border-[#FEE500]/50 bg-[#FEE500]/15 px-5 py-3.5 text-xs font-extrabold text-[#FEE500] transition hover:bg-[#FEE500] hover:text-[#05080F] sm:text-sm"
              >
                <MessageSquare className="h-4 w-4" />
                <span>카카오톡 상담</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
