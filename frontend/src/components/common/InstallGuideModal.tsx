/**
 * 접속기(unplug_setup.exe) 설치 파일 다운로드 시 표시되는 사전 체크리스트 및 무결성 안내 커스텀 모달 컴포넌트입니다.
 */

"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  ShieldCheck,
  Terminal,
  X,
} from "lucide-react";
import type { ClientRelease, SiteConfig } from "@/types/portal";
import { shortenSha256 } from "@/utils/formatters";

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  release: ClientRelease;
  siteConfig: SiteConfig;
  triggerSection: string;
}

export function InstallGuideModal({
  isOpen,
  onClose,
  release,
  siteConfig,
  triggerSection,
}: InstallGuideModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyHash = async () => {
    try {
      await navigator.clipboard.writeText(release.sha256_hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch {
      setCopiedHash(false);
    }
  };

  const directDownloadHref = `${release.download_url}?source=${encodeURIComponent(
    triggerSection
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-guide-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0F]/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="chamfer-panel relative max-h-[90vh] w-full max-w-xl overflow-y-auto border border-[#00E5FF]/45 bg-[#101019] p-6 sm:p-8 shadow-[0_0_55px_rgba(0,229,255,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div className="mb-5 flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <span className="font-mono text-[11px] font-semibold tracking-widest text-[#00E5FF]">
              CLIENT PACKAGE // {release.version}
            </span>
            <h3
              id="install-guide-modal-title"
              className="mt-1 text-xl font-extrabold text-white"
            >
              {siteConfig.brand_name} 접속기 설치 안내
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="설치 안내 모달 닫기"
            className="rounded p-1.5 text-[#8E95A9] transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 패키지 메타데이터 박스 */}
        <div className="mb-5 grid grid-cols-2 gap-3 border border-white/10 bg-[#0A0A0F]/90 p-4 text-xs sm:grid-cols-3">
          <div>
            <p className="text-[#8E95A9]">설치 파일명</p>
            <p className="mt-1 font-mono font-bold text-[#00E5FF]">
              {release.filename}
            </p>
          </div>
          <div>
            <p className="text-[#8E95A9]">지원 운영체제</p>
            <p className="mt-1 font-semibold text-white">{release.os_support}</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[#8E95A9]">무결성 SHA-256</p>
            <button
              type="button"
              onClick={handleCopyHash}
              className="mt-1 inline-flex items-center gap-1.5 font-mono text-[11px] text-[#B4FF39] hover:underline"
              title="클릭하여 전체 SHA-256 해시 복사"
            >
              <span>{shortenSha256(release.sha256_hash)}</span>
              <Copy className="h-3.5 w-3.5" />
              {copiedHash && <span className="text-[10px] text-white">복사됨</span>}
            </button>
          </div>
        </div>

        {/* 설치 전 필수 체크리스트 3가지 */}
        <div className="mb-6 space-y-3">
          <p className="text-xs font-bold tracking-wider text-[#00E5FF] uppercase">
            설치 및 접속 전 필수 확인 사항
          </p>
          <div className="flex items-start gap-3 border border-white/10 bg-white/[0.02] p-3.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#B4FF39]" />
            <div className="text-xs leading-relaxed text-[#C4CAD9]">
              <strong className="text-white">
                1. 내 PC에서 실행 중인 게임 먼저 종료:
              </strong>{" "}
              로컬 PC에서 이미 게임을 켜둔 채로 원격 접속기를 실행하면 중복 접속으로
              인식될 수 있으니 실행 중인 게임을 종료해 주세요.
            </div>
          </div>
          <div className="flex items-start gap-3 border border-white/10 bg-white/[0.02] p-3.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#00E5FF]" />
            <div className="text-xs leading-relaxed text-[#C4CAD9]">
              <strong className="text-white">
                2. Windows PC 보호(SmartScreen) 안내창 표시 시:
              </strong>{" "}
              창 좌측의 <span className="text-[#00E5FF]">[추가 정보]</span>를 누른 뒤{" "}
              <span className="text-[#00E5FF]">[실행]</span>을 클릭하면 정상 설치됩니다.
            </div>
          </div>
          <div className="flex items-start gap-3 border border-[#FF2E97]/30 bg-[#FF2E97]/[0.05] p-3.5">
            <Terminal className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2E97]" />
            <div className="text-xs leading-relaxed text-[#C4CAD9]">
              <strong className="text-white">
                3. 사용 종료 시 2단계 로그아웃 필수:
              </strong>{" "}
              게임 종료 후 원격창을 닫고 반드시 접속기에서{" "}
              <span className="font-bold text-[#FF2E97]">[로그아웃]</span> 버튼을
              눌러야 시간 차감이 멈춥니다.
            </div>
          </div>
        </div>

        {/* 다운로드 액션 버튼 영역 */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={directDownloadHref}
            className="chamfer-btn shine-cta flex flex-1 items-center justify-center gap-2 bg-[#00E5FF] px-6 py-3.5 text-sm font-extrabold text-[#05080F] shadow-[0_0_25px_rgba(0,229,255,0.4)] transition hover:bg-[#4DF0FF]"
          >
            <Download className="h-4 w-4" />
            <span>접속기 즉시 다운로드 ({release.filename})</span>
          </a>
          <a
            href={release.fallback_cdn_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 border border-white/20 bg-white/5 px-4 py-3.5 text-xs font-bold text-white transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
          >
            <span>고속 CDN 미러 다운로드</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
