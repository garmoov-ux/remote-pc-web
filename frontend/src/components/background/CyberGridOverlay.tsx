/**
 * 사이버 HUD 직교 그리드(72px), CRT 미세 스캔라인 및 7초 주기 수직 스윕 라인 배경 오버레이 컴포넌트입니다.
 */

export function CyberGridOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* 72px 직교 그리드 */}
      <div className="cyber-grid-pattern absolute inset-0 opacity-45" />
      {/* 상단/하단 라디얼 글로우 */}
      <div
        className="absolute -top-40 left-1/4 h-[520px] w-[680px] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.11) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[460px] w-[560px] rounded-full blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(255,46,151,0.09) 0%, transparent 70%)" }}
      />
      {/* 수직 스캔 스윕 바 */}
      <div className="cyber-scan-sweep absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent" />
    </div>
  );
}

