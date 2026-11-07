/**
 * 히어로 직하단 무상담 3단계 즉시 시작 배너(QuickFlowBanner) 컴포넌트입니다.
 * "복잡한 절차 없이 설치 후 바로 시작: 1. 접속기 설치 -> 2. 프로그램 내 회원가입 -> 3. 충전 후 즉시 게임" 흐름을 안내합니다.
 */

import { ArrowRight, CheckCircle2 } from "lucide-react";

const QUICK_STEPS = [
  {
    step: "STEP 01",
    title: "접속기 설치",
    desc: "홈페이지에서 전용 접속기(unplug_setup.exe) 즉시 다운로드 및 설치",
  },
  {
    step: "STEP 02",
    title: "프로그램 내 회원가입",
    desc: "별도 상담·승인 대기 없이 접속기 프로그램에서 30초 간편 가입",
  },
  {
    step: "STEP 03",
    title: "충전 후 즉시 게임",
    desc: "원하는 시간 충전 즉시 전국 빈 고사양 좌석으로 자동 연결 플레이",
  },
] as const;

export function QuickFlowBanner() {
  return (
    <section
      aria-label="무상담 3단계 빠른 시작 안내"
      className="relative z-10 border-y border-[#00E5FF]/20 bg-[#101019]/90 py-8 backdrop-blur-md"
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#B4FF39]" />
            <h2 className="text-sm font-extrabold tracking-tight text-white sm:text-base">
              복잡한 절차 없이 설치 후 바로 시작 —{" "}
              <span className="text-[#00E5FF]">
                상담·예약 없이 24시간 무인 자동 배정
              </span>
            </h2>
          </div>
          <span className="font-mono text-[11px] text-[#8E95A9]">
            FAST-TRACK // 3-STEP DIRECT LAUNCH
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {QUICK_STEPS.map((item, idx) => (
            <div
              key={item.step}
              className="relative flex items-center justify-between border border-white/10 bg-[#0A0A0F]/85 p-4 transition hover:border-[#00E5FF]/45"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-[#00E5FF]">
                    {item.step}
                  </span>
                  <h3 className="text-sm font-extrabold text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#C4CAD9]">
                  {item.desc}
                </p>
              </div>
              {idx < QUICK_STEPS.length - 1 && (
                <ArrowRight className="hidden h-5 w-5 shrink-0 text-[#00E5FF]/60 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

