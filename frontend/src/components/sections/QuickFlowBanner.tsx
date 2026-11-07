/**
 * 히어로 직하단 무상담 3단계 즉시 시작 배너(QuickFlowBanner) 컴포넌트입니다.
 * 벤치마크(.mani) 표준:
 * - 데스크톱: 가로 일렬 3단계 흐름 카드
 * - 모바일/태블릿: 세로 스택(flex-col) 3단계 카드와 하단 대기시간 00분 고지
 */

const QUICK_STEPS = [
  {
    step: "1",
    title: "접속기 설치",
    desc: "홈페이지에서 전용 접속기(unplug_setup.exe) 다운로드 및 1분 설치",
  },
  {
    step: "2",
    title: "프로그램 내 회원가입",
    desc: "별도 상담·승인 대기 없이 접속기 안에서 30초 간편 가입",
  },
  {
    step: "3",
    title: "충전 후 즉시 게임",
    desc: "원하는 시간 충전 즉시 전국 70+ 고사양 좌석으로 자동 연결",
  },
] as const;

export function QuickFlowBanner() {
  return (
    <section
      aria-label="무상담 3단계 빠른 시작 안내"
      className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-6 mb-8"
    >
      <div className="relative text-center border border-white/12 bg-gradient-to-b from-[#12121c]/70 to-[#0a0a10]/70 p-6 sm:p-10 lg:p-12 shadow-[0_0_35px_rgba(0,0,0,0.6)] chamfer-panel">
        {/* 상단 텍스트 */}
        <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white tracking-tight leading-snug">
          전화도. 예약도. 줄서기도.{" "}
          <span className="text-[#FF2E97] drop-shadow-[0_0_18px_rgba(255,46,151,0.5)]">
            전부 없습니다.
          </span>
        </h2>

        {/* 3단계 스텝 플로우 (모바일: 세로 스택, 데스크톱: 가로 결합) */}
        <div className="mt-6 sm:mt-8 flex flex-col md:flex-row items-stretch justify-center border border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-[#0a0a0f]/80">
          {QUICK_STEPS.map((item) => (
            <div
              key={item.step}
              className="flex-1 flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 text-left transition hover:bg-white/[0.03]"
            >
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center font-display text-sm sm:text-base font-black text-[#05080F] bg-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.4)] chamfer-btn">
                {item.step}
              </span>
              <div>
                <h3 className="font-mono text-xs sm:text-sm font-extrabold text-white">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-[11px] sm:text-xs text-[#8E95A9] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 캡션 */}
        <p className="mt-4 sm:mt-5 font-mono text-[11px] sm:text-xs text-[#8E95A9] tracking-wider">
          // 새벽 3시든 일요일 아침이든.{" "}
          <strong className="text-[#00E5FF] font-bold">대기 시간 00분.</strong>
        </p>
      </div>
    </section>
  );
}
