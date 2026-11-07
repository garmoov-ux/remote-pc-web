/**
 * 하단 접속기 패키지 다운로드 섹션(#download — DownloadCtaSection) 컴포넌트입니다.
 * 설치 파일명(unplug_setup.exe), 버전, 지원 OS, SHA-256 무결성 검증 정보 및 즉시 다운로드 버튼을 제공합니다.
 */

import { Download, ExternalLink, HardDrive, ShieldCheck } from "lucide-react";
import type { ClientRelease, SiteConfig } from "@/types/portal";
import { shortenSha256 } from "@/utils/formatters";

interface DownloadCtaSectionProps {
  release: ClientRelease;
  siteConfig: SiteConfig;
  onOpenDownload: (source: string) => void;
}

export function DownloadCtaSection({
  release,
  siteConfig,
  onOpenDownload,
}: DownloadCtaSectionProps) {
  return (
    <section
      id="download"
      aria-labelledby="download-section-title"
      className="relative z-10 border-t border-[#00E5FF]/25 bg-gradient-to-b from-[#0D0D18] to-[#0A0A0F] py-20"
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="chamfer-panel relative overflow-hidden border border-[#00E5FF]/50 bg-[#101019] p-7 shadow-[0_0_50px_rgba(0,229,255,0.18)] sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* 좌측 패키지 설명 */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 border border-[#B4FF39]/40 bg-[#B4FF39]/10 px-3 py-1 font-mono text-xs font-bold text-[#B4FF39]">
                OFFICIAL CLIENT INSTALLER // {release.version}
              </span>

              <h2
                id="download-section-title"
                className="mt-4 text-2xl font-black tracking-tight text-white sm:text-4xl"
              >
                지금 {siteConfig.brand_name} 접속기를 설치하고
                <br />
                <span className="text-[#00E5FF]">
                  대기 시간 0분으로 고사양 좌석에 연결하세요
                </span>
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#C4CAD9] sm:text-base">
                {release.release_notes}. 설치 전 내 컴퓨터에서 실행 중인 게임이
                있다면 먼저 종료한 뒤 접속기를 실행해 주세요.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs text-[#8E95A9]">
                <span className="inline-flex items-center gap-1.5">
                  <HardDrive className="h-4 w-4 text-[#00E5FF]" />
                  <span>
                    파일: <strong className="text-white">{release.filename}</strong> (
                    {release.file_size_label})
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#B4FF39]" />
                  <span>
                    SHA-256:{" "}
                    <strong className="text-[#B4FF39]">
                      {shortenSha256(release.sha256_hash)}
                    </strong>
                  </span>
                </span>
              </div>
            </div>

            {/* 우측 다운로드 액션 박스 */}
            <div className="flex flex-col gap-3.5 border border-white/10 bg-[#0A0A0F]/90 p-6 lg:col-span-5">
              <div className="flex items-center justify-between text-xs text-[#8E95A9]">
                <span>지원 환경</span>
                <span className="font-semibold text-white">{release.os_support}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#8E95A9]">
                <span>기본 요금제</span>
                <span className="font-bold text-[#B4FF39]">
                  1만원 충전 시 600분(10시간)
                </span>
              </div>

              <button
                type="button"
                onClick={() => onOpenDownload("download_section")}
                className="chamfer-btn shine-cta mt-2 flex w-full items-center justify-center gap-2.5 bg-[#00E5FF] py-4 text-base font-black text-[#05080F] shadow-[0_0_30px_rgba(0,229,255,0.45)] transition hover:bg-[#4DF0FF]"
              >
                <Download className="h-5 w-5" />
                <span>접속기 설치 파일 다운로드</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenDownload("download_section_mirror")}
                className="flex w-full items-center justify-center gap-1.5 border border-white/15 bg-white/5 py-3 text-xs font-bold text-[#C4CAD9] transition hover:border-[#00E5FF] hover:text-white"
              >
                <span>외부 CDN 미러에서 직접 내려받기</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
