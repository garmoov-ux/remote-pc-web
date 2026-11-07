/**
 * 메인 히어로 섹션(HeroSection) 컴포넌트입니다.
 * 벤치마크(원격플러그인피시.kr) 완벽 동기화:
 * - 헤드라인 타이포그래피: "PC방 그 사양 그대로, 자리만 내 방으로."
 * - 모바일/태블릿 반응형 버튼 그룹: [접속기 설치] + [> 게임 목록 보기] 나란히 또는 세로 정렬
 * - 3대 핵심 뱃지: [상담 없이 바로 시작] [대기 00분 즉시 연결] [전국 70+ 제휴 PC방]
 * - 우측(모바일에서는 직하단) SYS.TELEMETRY HUD 스탯 카드 (Partner PC 70+, Game Units 50+, Rate 600', Wait Time 00')
 */

"use client";

import Link from "next/link";
import { ChevronRight, Download } from "lucide-react";
import type { ActionModalCategory } from "@/constants/daangnChatStory";
import type { ClientRelease, SiteConfig, TelemetryData } from "@/types/portal";

interface HeroSectionProps {
  siteConfig: SiteConfig;
  telemetry: TelemetryData;
  release: ClientRelease;
  onOpenDownload: (source: string) => void;
  onOpenAction: (category: ActionModalCategory, source: string) => void;
}

export function HeroSection({
  siteConfig,
  telemetry,
  release,
  onOpenDownload,
  onOpenAction,
}: HeroSectionProps) {
  return (
    <section
      id="top"
      aria-label="메인 히어로 및 실시간 가동 현황"
      className="relative z-10 overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 lg:pb-24 min-h-[90vh] flex items-center"
    >
      {/* 배경 히어로 이미지 + 다크 비네팅 오버레이 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage: "url('/images/hero/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0A0A0F]/70 via-[#0A0A0F]/85 to-[#0A0A0F]"
      />

      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* 좌측 메인 텍스트 & 버튼 영역 (모바일: 1열, 데스크톱: 7열) */}
          <div className="lg:col-span-7">
            {/* 상단 칩 배지 */}
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-3 sm:px-3.5 py-1 sm:py-1.5 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#00E5FF] chamfer-btn">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B4FF39] shadow-[0_0_8px_#B4FF39] animate-pulse" />
              <span>{siteConfig.brand_name} ACCESS GRID // REV 2.6</span>
            </div>

            {/* 메인 헤드라인 */}
            <h1 className="text-3xl leading-[1.12] sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight text-white">
              PC방 그 사양 <span className="text-[#00E5FF] drop-shadow-[0_0_20px_rgba(0,229,255,0.45)]">그대로</span>,
              <br />
              자리만 <span className="text-[#FF2E97] drop-shadow-[0_0_20px_rgba(255,46,151,0.5)]">내 방</span>으로.
            </h1>

            {/* 서브 카피 */}
            <p className="mt-3 sm:mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-[#b9c0d6]">
              <strong className="font-bold text-white border-b-2 border-[#00E5FF] pb-0.5">
                따로 문의할 필요 없습니다.
              </strong>{" "}
              접속기를 설치하고 프로그램 안에서 가입만 하면, 전국 {telemetry.partner_stores} 고사양
              좌석에 대기 없이 즉시 연결됩니다.
            </p>

            {/* 버튼 영역 (모바일/태블릿 최적화: 가로 나란히 또는 유연한 랩) */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenDownload("hero_cta")}
                className="chamfer-btn shine-cta inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#00E5FF] via-[#7DF9FF] to-[#00E5FF] px-6 sm:px-8 py-3.5 sm:py-4 font-display text-xs sm:text-sm font-black tracking-wider text-[#00131a] shadow-[0_0_26px_rgba(0,229,255,0.45)] transition hover:brightness-110 active:translate-y-0.5"
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>접속기 설치 ({release.version})</span>
              </button>

              <Link
                href="#games"
                className="chamfer-btn inline-flex items-center justify-center gap-2 border border-white/20 bg-white/[0.04] px-5 sm:px-6 py-3.5 sm:py-4 font-mono text-xs sm:text-sm font-bold text-white transition hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 hover:text-[#00E5FF]"
              >
                <span>&gt; 게임 목록 보기</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* 3대 핵심 뱃지 바 (모바일 가로 배치 최적화) */}
            <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-2 text-xs">
              <span className="border border-white/10 bg-[#14141f]/75 px-3 py-1.5 font-mono text-[11px] sm:text-xs text-[#C4CAD9] chamfer-btn">
                상담 없이 <strong className="text-[#B4FF39]">바로 시작</strong>
              </span>
              <span className="border border-white/10 bg-[#14141f]/75 px-3 py-1.5 font-mono text-[11px] sm:text-xs text-[#C4CAD9] chamfer-btn">
                대기 <strong className="text-[#B4FF39]">00분</strong> 즉시 연결
              </span>
              <button
                type="button"
                onClick={() => onOpenAction("phone_contact", "hero_partner_chip")}
                className="border border-white/10 bg-[#14141f]/75 px-3 py-1.5 font-mono text-[11px] sm:text-xs text-[#C4CAD9] chamfer-btn text-left hover:border-[#00E5FF] transition"
              >
                전국 <strong className="text-[#B4FF39]">70+</strong> 제휴 PC방
              </button>
            </div>
          </div>

          {/* 우측 텔레메트리 HUD 스탯 카드 (모바일에서는 바로 아래 1열 배치, 데스크톱: 5열) */}
          <div className="lg:col-span-5 w-full mt-2 lg:mt-0">
            <div className="relative border border-white/15 bg-gradient-to-b from-[#12121c]/90 to-[#0a0a10]/90 shadow-[0_0_35px_rgba(0,229,255,0.12)] chamfer-panel">
              {/* 상단 라벨 */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 sm:px-6 py-3 sm:py-3.5">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-widest text-[#8E95A9]">
                  SYS.TELEMETRY
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-bold text-[#B4FF39]">
                  <span className="h-2 w-2 animate-ping rounded-full bg-[#B4FF39]" />
                  {telemetry.status}
                </span>
              </div>

              {/* 4행 스탯 리스트 (모바일 폭에 완벽 정렬) */}
              <div className="divide-y divide-white/10">
                <div className="flex items-baseline justify-between px-5 sm:px-6 py-3.5 sm:py-4">
                  <span className="font-mono text-xs sm:text-sm uppercase tracking-wider text-[#8E95A9]">
                    Partner PC
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-black text-[#00E5FF] drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                    {telemetry.partner_stores}
                  </span>
                </div>

                <div className="flex items-baseline justify-between px-5 sm:px-6 py-3.5 sm:py-4">
                  <span className="font-mono text-xs sm:text-sm uppercase tracking-wider text-[#8E95A9]">
                    Game Units
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-black text-[#FF2E97] drop-shadow-[0_0_12px_rgba(255,46,151,0.4)]">
                    {telemetry.supported_games}
                  </span>
                </div>

                <div className="flex items-baseline justify-between px-5 sm:px-6 py-3.5 sm:py-4">
                  <span className="font-mono text-xs sm:text-sm uppercase tracking-wider text-[#8E95A9]">
                    Rate / 10K
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-black text-[#B4FF39] drop-shadow-[0_0_12px_rgba(180,255,57,0.4)]">
                    {telemetry.minutes_per_10k}
                  </span>
                </div>

                <div className="flex items-baseline justify-between px-5 sm:px-6 py-3.5 sm:py-4">
                  <span className="font-mono text-xs sm:text-sm uppercase tracking-wider text-[#8E95A9]">
                    Wait Time
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-black text-[#00E5FF] drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                    {telemetry.avg_wait_minutes}
                  </span>
                </div>
              </div>

              {/* 하단 실시간 가용 좌석 상태 */}
              <div className="border-t border-white/10 bg-[#0a0a0f]/60 px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between text-[11px] sm:text-xs">
                <span className="text-[#8E95A9]">현재 즉시 배정 가용 좌석</span>
                <span className="font-mono font-bold text-[#00E5FF]">
                  {telemetry.available_seats} SEATS READY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
