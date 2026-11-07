/**
 * 메인 히어로 섹션(HeroSection) 컴포넌트입니다.
 * "PC방 그 사양 그대로, 자리만 내 방으로" 핵심 카피와 우측 실시간 텔레메트리 HUD 패널(70+, 50+, 600분, 00분)을 시각화합니다.
 */

"use client";

import {
  Activity,
  ChevronRight,
  Cpu,
  Download,
  Gamepad2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { ClientRelease, SiteConfig, TelemetryData } from "@/types/portal";

interface HeroSectionProps {
  siteConfig: SiteConfig;
  telemetry: TelemetryData;
  release: ClientRelease;
  onOpenDownload: (source: string) => void;
}

export function HeroSection({
  siteConfig,
  telemetry,
  release,
  onOpenDownload,
}: HeroSectionProps) {
  return (
    <section
      id="top"
      aria-label="메인 히어로 및 실시간 가동 현황"
      className="relative z-10 overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24"
    >
      {/* 배경 히어로 이미지 + 다크 비네팅 오버레이 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-22"
        style={{
          backgroundImage: "url('/images/hero/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0A0A0F]/60 via-[#0A0A0F]/85 to-[#0A0A0F]"
      />

      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* 좌측 메인 가치 제안 및 다운로드 CTA (7열) */}
          <div className="lg:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2 border border-[#00E5FF]/35 bg-[#00E5FF]/10 px-3.5 py-1.5 text-xs font-bold text-[#00E5FF]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#B4FF39]" />
              <span>24시간 연중무휴 · 집에서 바로 접속하는 고사양 원격PC방</span>
            </div>

            <h1 className="text-3xl leading-[1.18] font-black tracking-tight text-white sm:text-5xl lg:text-[54px]">
              PC방 그 사양 그대로,
              <br />
              <span className="bg-gradient-to-r from-[#00E5FF] via-[#7CEEFF] to-[#FF2E97] bg-clip-text text-transparent">
                자리만 내 방으로
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#C4CAD9] sm:text-lg">
              설치부터 접속까지 단 3분. 상담·예약·대기 없이 바로 시작하세요.
              전국{" "}
              <strong className="font-bold text-white">
                {telemetry.partner_stores} 정식 제휴 PC방
              </strong>
              의 실제 고사양 컴퓨터와 프리미엄 혜택을 집이나 노트북에서 그대로
              누릴 수 있습니다.
            </p>

            {/* 듀얼 CTA 버튼 그룹 */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => onOpenDownload("hero_cta")}
                className="chamfer-btn shine-cta inline-flex items-center justify-center gap-2.5 bg-[#00E5FF] px-7 py-4 text-base font-black text-[#05080F] shadow-[0_0_30px_rgba(0,229,255,0.45)] transition hover:bg-[#4DF0FF]"
              >
                <Download className="h-5 w-5" />
                <span>접속기 다운로드 ({release.version})</span>
              </button>

              <a
                href="#games"
                className="chamfer-btn inline-flex items-center justify-center gap-2 border border-white/20 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white transition hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 hover:text-[#00E5FF]"
              >
                <Gamepad2 className="h-4 w-4 text-[#00E5FF]" />
                <span>서비스 게임 50+ 목록 보기</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            {/* 하단 신뢰 보조 칩 */}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#8E95A9]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#B4FF39]" />
                <span>무상담·무약정 즉시 자동 배정</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-[#00E5FF]" />
                <span>1만원 기준 600분(10시간) · 분 단위 차감</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-[#FF2E97]" />
                <span>24시 고객센터 ({siteConfig.cs_phone})</span>
              </span>
            </div>
          </div>

          {/* 우측 실시간 텔레메트리 HUD 패널 (5열) */}
          <div className="lg:col-span-5">
            <div className="chamfer-panel relative border border-[#00E5FF]/35 bg-[#101019]/92 p-6 shadow-[0_0_45px_rgba(0,229,255,0.14)] backdrop-blur-xl sm:p-7">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#00E5FF]" />
                  <span className="font-mono text-xs font-bold tracking-wider text-white">
                    SYSTEM TELEMETRY // ACCESS GRID
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#B4FF39]">
                  <span className="h-2 w-2 animate-ping rounded-full bg-[#B4FF39]" />
                  {telemetry.status}
                </span>
              </div>

              {/* 4대 핵심 운영 지표 2x2 그리드 */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="border border-white/10 bg-[#0A0A0F]/90 p-4 transition hover:border-[#00E5FF]/50">
                  <p className="font-mono text-[10px] tracking-widest text-[#8E95A9]">
                    PARTNER NODES
                  </p>
                  <p className="mt-1 font-display text-3xl font-black text-[#00E5FF] sm:text-4xl">
                    {telemetry.partner_stores}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#C4CAD9]">
                    전국 정식 제휴 PC방
                  </p>
                </div>

                <div className="border border-white/10 bg-[#0A0A0F]/90 p-4 transition hover:border-[#00E5FF]/50">
                  <p className="font-mono text-[10px] tracking-widest text-[#8E95A9]">
                    SERVICE GAMES
                  </p>
                  <p className="mt-1 font-display text-3xl font-black text-white sm:text-4xl">
                    {telemetry.supported_games}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#C4CAD9]">
                    프리미엄 혜택 지원 게임
                  </p>
                </div>

                <div className="border border-white/10 bg-[#0A0A0F]/90 p-4 transition hover:border-[#00E5FF]/50">
                  <p className="font-mono text-[10px] tracking-widest text-[#8E95A9]">
                    BASE RATE (10,000 KRW)
                  </p>
                  <p className="mt-1 font-display text-3xl font-black text-[#B4FF39] sm:text-4xl">
                    {telemetry.minutes_per_10k}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#C4CAD9]">
                    1만원 기준 충전 시간
                  </p>
                </div>

                <div className="border border-white/10 bg-[#0A0A0F]/90 p-4 transition hover:border-[#FF2E97]/50">
                  <p className="font-mono text-[10px] tracking-widest text-[#8E95A9]">
                    QUEUE LATENCY
                  </p>
                  <p className="mt-1 font-display text-3xl font-black text-[#FF2E97] sm:text-4xl">
                    {telemetry.avg_wait_minutes}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#C4CAD9]">
                    평균 좌석 대기 시간
                  </p>
                </div>
              </div>

              {/* 하단 실시간 가용 노드 상태 바 */}
              <div className="mt-5 border border-white/10 bg-[#0A0A0F]/70 p-3.5 text-xs">
                <div className="flex items-center justify-between text-[#C4CAD9]">
                  <span>현재 즉시 배정 가능 고사양 좌석</span>
                  <span className="font-mono font-bold text-[#00E5FF]">
                    {telemetry.available_seats} SEATS READY
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden bg-white/10">
                  <div className="h-full w-[84%] bg-gradient-to-r from-[#00E5FF] via-[#B4FF39] to-[#FF2E97]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
