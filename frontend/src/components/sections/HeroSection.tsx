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
      className="relative z-10 overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-28 min-h-[92vh] sm:min-h-screen flex items-center"
    >
      {/* 벤치마크 1:1 고대비 배경 히어로 이미지 레이어 (filter + position 30%) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          backgroundImage: "url('/images/hero/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "saturate(0.7) brightness(0.5) contrast(1.05)",
        }}
      />

      {/* 벤치마크 1:1 이중 그라데이션 스크림 오버레이 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,15,0.72), rgba(10,10,15,0.55) 45%, #0a0a0f 92%), linear-gradient(100deg, rgba(10,10,15,0.9), transparent 60%)",
        }}
      />

      <div className="mx-auto w-full max-w-310 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* 좌측 메인 텍스트 & 버튼 영역 (모바일: 1열, 데스크톱: 7열) */}
          <div className="lg:col-span-7">
            {/* 상단 칩 배지 */}
            <div className="mb-5 sm:mb-6.5 inline-flex items-center gap-2.5 border border-[#00E5FF]/35 bg-[#00E5FF]/10 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#00E5FF] chamfer-btn">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B4FF39] shadow-[0_0_8px_#B4FF39] animate-pulse" />
              <span>{siteConfig.brand_name} ACCESS GRID // REV 2.6</span>
            </div>

            {/* 메인 헤드라인 (벤치마크 clamp(2.6rem, 6.4vw, 5.4rem) 1:1 완벽 일치) */}
            <h1 className="font-display font-black text-white text-[clamp(2.6rem,6.4vw,5.4rem)] leading-none tracking-[0.01em] mb-6 drop-shadow-[0_0_26px_rgba(0,229,255,0.35)]">
              PC방 그 사양
              <br />
              <span className="text-[#00E5FF]">그대로</span>,
              <br />
              자리만 <span className="text-[#FF2E97] drop-shadow-[0_0_26px_rgba(255,46,151,0.5)]">내 방</span>으로.
            </h1>

            {/* 서브 카피 */}
            <p className="max-w-[52ch] text-[16px] sm:text-[18px] leading-[1.6] text-[#b9c0d6] my-6 sm:my-8">
              <strong className="font-bold text-white border-b-2 border-[#00E5FF] pb-0.5">
                따로 문의할 필요 없습니다.
              </strong>{" "}
              접속기를 설치하고 프로그램 안에서 가입만 하면, 고사양
              좌석에 대기 없이 즉시 연결됩니다.
            </p>

            {/* 버튼 영역 (모바일에서도 항상 좌우 가로 1열 나란히 유지: flex-nowrap) */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-3.5">
              <button
                type="button"
                onClick={() => onOpenDownload("hero_cta")}
                className="chamfer-btn shine-cta inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 sm:gap-3 bg-linear-to-r from-[#00E5FF] via-[#7DF9FF] to-[#00E5FF] px-4 sm:px-7 py-3 sm:py-4 font-display text-xs sm:text-[15px] font-black tracking-[0.02em] sm:tracking-[0.04em] text-[#00131a] shadow-[0_0_22px_rgba(0,229,255,0.45)] transition hover:brightness-105 active:translate-y-0.5 whitespace-nowrap"
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span>접속기 설치</span>
              </button>

              <Link
                href="#games"
                className="chamfer-btn inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 sm:gap-2 border border-[#00E5FF]/40 bg-white/[0.03] px-3.5 sm:px-6 py-3 sm:py-4 font-mono text-[11px] sm:text-[13px] font-semibold tracking-[0.04em] sm:tracking-[0.08em] uppercase text-[#00E5FF] transition hover:bg-[#00E5FF]/10 hover:text-white whitespace-nowrap"
              >
                <span>&gt; 게임 목록</span>
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              </Link>
            </div>

            {/* 3대 핵심 뱃지 바 (벤치마크 1:1 동기화: hbadge 스타일) */}
            <div className="mt-8 sm:mt-9 flex flex-wrap items-center gap-2.5 text-xs">
              <span className="border border-white/10 bg-[#14141f]/70 px-3.5 py-2 font-mono text-[12px] tracking-[0.06em] text-[#a4adc2] chamfer-btn">
                상담 없이 <strong className="font-bold text-[#B4FF39]">바로 시작</strong>
              </span>
              <span className="border border-white/10 bg-[#14141f]/70 px-3.5 py-2 font-mono text-[12px] tracking-[0.06em] text-[#a4adc2] chamfer-btn">
                대기 <strong className="font-bold text-[#B4FF39]">00분</strong> 즉시 연결
              </span>
              <button
                type="button"
                onClick={() => onOpenAction("phone_contact", "hero_partner_chip")}
                className="border border-white/10 bg-[#14141f]/70 px-3.5 py-2 font-mono text-[12px] tracking-[0.06em] text-[#a4adc2] chamfer-btn text-left hover:border-[#00E5FF]/60 hover:text-white transition"
              >
                전국 <strong className="font-bold text-[#B4FF39]">70+</strong> 제휴 PC방
              </button>
            </div>
          </div>

          {/* 우측 텔레메트리 HUD 스탯 카드 (벤치마크 1:1 .hstat 스타일) */}
          <div className="lg:col-span-5 w-full mt-4 lg:mt-0">
            <div className="relative border border-white/15 bg-linear-to-b from-[#12121c]/90 to-[#0a0a10]/92 shadow-[0_0_35px_rgba(0,229,255,0.12)] chamfer-panel">
              {/* 상단 라벨 */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 sm:px-6 py-3.5">
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-[#8E95A9]">
                  SYS.TELEMETRY
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-bold text-[#B4FF39]">
                  <span className="h-2 w-2 animate-ping rounded-full bg-[#B4FF39]" />
                  {telemetry.status}
                </span>
              </div>

              {/* 4행 스탯 리스트 (벤치마크 30px Orbitron 숫자 완벽 일치) */}
              <div className="divide-y divide-white/10">
                <div className="flex items-baseline justify-between px-5 sm:px-6 py-4 sm:py-4.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#8E95A9]">
                    Partner PC
                  </span>
                  <span className="font-display text-[26px] sm:text-[30px] font-black text-[#00E5FF] drop-shadow-[0_0_16px_rgba(0,229,255,0.45)]">
                    {telemetry.partner_stores}
                  </span>
                </div>

                <div className="flex items-baseline justify-between px-5 sm:px-6 py-4 sm:py-4.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#8E95A9]">
                    Game Units
                  </span>
                  <span className="font-display text-[26px] sm:text-[30px] font-black text-[#FF2E97] drop-shadow-[0_0_16px_rgba(255,46,151,0.45)]">
                    {telemetry.supported_games}
                  </span>
                </div>

                <div className="flex items-baseline justify-between px-5 sm:px-6 py-4 sm:py-4.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#8E95A9]">
                    Rate / 10K
                  </span>
                  <span className="font-display text-[26px] sm:text-[30px] font-black text-[#B4FF39] drop-shadow-[0_0_16px_rgba(180,255,57,0.45)]">
                    {telemetry.minutes_per_10k}
                  </span>
                </div>

                <div className="flex items-baseline justify-between px-5 sm:px-6 py-4 sm:py-4.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#8E95A9]">
                    Wait Time
                  </span>
                  <span className="font-display text-[26px] sm:text-[30px] font-black text-[#00E5FF] drop-shadow-[0_0_16px_rgba(0,229,255,0.45)]">
                    {telemetry.avg_wait_minutes}
                  </span>
                </div>
              </div>

              {/* 하단 실시간 배정 상태 바 */}
              <div className="border-t border-white/10 bg-white/[0.02] px-5 sm:px-6 py-3 flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#8E95A9]">현재 즉시 배정 가용 좌석</span>
                <span className="font-bold text-[#B4FF39] tracking-wider">
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
