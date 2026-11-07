/**
 * 서비스 핵심 경쟁력 및 개발·운영 전담팀 소개 섹션(#why — WhyChooseSection) 컴포넌트입니다.
 * 3대 핵심 경쟁력(01 자체 기술팀, 02 365일 실시간 상담, 03 렉 없는 자체 최적화)과 4대 전담 파트를 시각화합니다.
 */

import type { TeamRole, WhyFeature } from "@/types/portal";

interface WhyChooseSectionProps {
  features: WhyFeature[];
  teamRoles: TeamRole[];
}

export function WhyChooseSection({
  features,
  teamRoles,
}: WhyChooseSectionProps) {
  return (
    <section
      id="why"
      aria-labelledby="why-section-title"
      className="relative z-10 scroll-mt-20 border-t border-white/10 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* 섹션 상단 헤더 */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-[#00E5FF]">
            <span>SEC // 03</span>
            <span className="h-[1px] w-8 bg-[#00E5FF]/50" />
            <span>CORE COMPETENCE & TEAM</span>
          </div>
          <h2
            id="why-section-title"
            className="mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl"
          >
            전국 70여 개 지점이 연결된 압도적 경쟁력
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#C4CAD9] sm:text-base">
            단순 중개 업체가 아닌 자체 개발·인프라·운영·고객지원 전담 조직이 365일
            무중단으로 서비스 품질을 책임집니다.
          </p>
        </div>

        {/* 3대 핵심 경쟁력 카드 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {features.map((item) => (
            <article
              key={item.num}
              className="chamfer-panel relative flex flex-col justify-between border border-white/12 bg-[#101019]/90 p-6 transition hover:border-[#00E5FF]/60 hover:shadow-[0_12px_32px_rgba(0,229,255,0.14)] sm:p-7"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-display text-3xl font-black text-[#00E5FF]">
                    {item.num}
                  </span>
                  <span className="border border-[#00E5FF]/35 bg-[#00E5FF]/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-[#00E5FF]">
                    {item.highlight}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#C4CAD9]">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* 4대 전담팀 역할 서브 그리드 */}
        <div className="mt-14">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white sm:text-xl">
              4대 전문 파트 상시 운영 체계
            </h3>
            <span className="font-mono text-xs text-[#8E95A9]">
              DEDICATED UNITS // 04 DIVISIONS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {teamRoles.map((role) => (
              <div
                key={role.role_code}
                className="group flex flex-col border border-white/10 bg-[#0D0D15] p-5 transition hover:border-[#00E5FF]/50"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center border border-[#00E5FF]/30 bg-[#0A0A0F] p-2.5">
                    <img
                      src={role.icon_url}
                      alt={role.title}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#00E5FF]">
                    {role.role_code}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-white group-hover:text-[#00E5FF]">
                  {role.title}
                </h4>
                <p className="font-mono text-[11px] text-[#8E95A9]">
                  {role.subtitle}
                </p>
                <p className="mt-2.5 text-xs leading-relaxed text-[#C4CAD9]">
                  {role.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

