/**
 * 원격PC방 4단계 이용 순서 가이드(#how — HowToUseSection) 컴포넌트입니다.
 * 01 접속기 설치 및 충전 -> 02 좌석 자동 연결 -> 03 집에서 원격 플레이 -> 04 분 단위 자동 차감 시퀀스를 시각화합니다.
 */

import Image from "next/image";
import { Download } from "lucide-react";
import type { HowToStep } from "@/types/portal";

interface HowToUseSectionProps {
  steps: HowToStep[];
  onOpenDownload: (source: string) => void;
}

export function HowToUseSection({
  steps,
  onOpenDownload,
}: HowToUseSectionProps) {
  return (
    <section
      id="how"
      aria-labelledby="how-section-title"
      className="relative z-10 scroll-mt-20 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-340 px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-[#00E5FF]">
              <span>SEC // 01</span>
              <span className="h-px w-8 bg-[#00E5FF]/50" />
              <span>OPERATION SEQUENCE</span>
            </div>
            <h2
              id="how-section-title"
              className="mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl"
            >
              원격PC방 4단계 이용 순서
            </h2>
            <p className="mt-2 text-sm text-[#C4CAD9] sm:text-base">
              처음 이용하시는 분도 별도 문의 없이 3분 만에 고사양 PC방 좌석으로
              연결할 수 있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenDownload("how_section")}
            className="chamfer-btn inline-flex items-center gap-2 border border-[#00E5FF]/50 bg-[#00E5FF]/10 px-5 py-2.5 text-xs font-extrabold text-[#00E5FF] transition hover:bg-[#00E5FF] hover:text-[#05080F]"
          >
            <Download className="h-4 w-4" />
            <span>1단계 접속기 바로 받기</span>
          </button>
        </div>

        {/* 4단계 카드 그리드 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.step_no}
              className="chamfer-panel group flex flex-col overflow-hidden border border-white/10 bg-[#101019]/90 transition duration-300 hover:-translate-y-1 hover:border-[#00E5FF]/60 hover:shadow-[0_12px_30px_rgba(0,229,255,0.14)]"
            >
              {/* 스텝 일러스트 썸네일 */}
              <div className="relative aspect-16/10 w-full overflow-hidden border-b border-white/10 bg-[#0A0A0F]">
                <Image
                  src={step.image_url}
                  alt={`STEP ${step.step_no} ${step.title}`}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#101019] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 border border-[#00E5FF]/50 bg-[#0A0A0F]/90 px-2.5 py-1 font-display text-xs font-black text-[#00E5FF]">
                  STEP {step.step_no}
                </span>
              </div>

              {/* 스텝 설명 본문 */}
              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-[10px] tracking-widest text-[#8E95A9]">
                  {step.badge}
                </p>
                <h3 className="mt-1.5 text-lg font-extrabold text-white group-hover:text-[#00E5FF]">
                  {step.title}
                </h3>
                <p className="mt-2.5 flex-1 text-xs leading-relaxed text-[#C4CAD9] sm:text-sm">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

