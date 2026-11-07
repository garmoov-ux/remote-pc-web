/**
 * 하단 사업자 마스터 프로필(언플러그 / 차수빈 / 240-18-02372 / 제 2025-김해장유-0356 호) 및 고객센터 안내 푸터 컴포넌트입니다.
 */

import Link from "next/link";
import { ExternalLink, Monitor, PhoneCall, ShieldCheck } from "lucide-react";
import type { ActionModalCategory } from "@/constants/daangnChatStory";
import { NAV_SECTIONS } from "@/constants/portalData";
import type { SiteConfig } from "@/types/portal";

interface SiteFooterProps {
  siteConfig: SiteConfig;
  onOpenAction: (category: ActionModalCategory, source: string) => void;
}

export function SiteFooter({ siteConfig, onOpenAction }: SiteFooterProps) {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#07070B] py-12 text-xs text-[#8E95A9]">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-8 lg:grid-cols-12">
          {/* 좌측 브랜드 및 사업자 등록 정보 */}
          <div className="space-y-3 lg:col-span-7">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center border border-[#00E5FF]/50 bg-[#00E5FF]/10 text-[#00E5FF]">
                <Monitor className="h-3.5 w-3.5" />
              </div>
              <span className="text-base font-extrabold text-white">
                {siteConfig.brand_name} ({siteConfig.brand_sub_name})
              </span>
            </div>

            <p className="leading-relaxed text-[#C4CAD9]">
              전국 70여 개 정식 제휴 PC방의 고사양 좌석을 대기 없이 내 방으로 연결하는
              24시간 무중단 원격 PC방 플랫폼입니다.
            </p>

            <div className="grid grid-cols-1 gap-y-1.5 pt-2 text-xs text-[#8E95A9] sm:grid-cols-2">
              <p>
                <span className="font-semibold text-[#C4CAD9]">상호명 / 대표자:</span>{" "}
                {siteConfig.company_name} / {siteConfig.ceo_name}
              </p>
              <p>
                <span className="font-semibold text-[#C4CAD9]">사업자등록번호:</span>{" "}
                <span className="font-mono">{siteConfig.business_reg_no}</span>
              </p>
              <p>
                <span className="font-semibold text-[#C4CAD9]">통신판매업신고번호:</span>{" "}
                {siteConfig.mail_order_reg_no}
              </p>
              <p>
                <span className="font-semibold text-[#C4CAD9]">대표 이메일:</span>{" "}
                <button
                  type="button"
                  onClick={() => onOpenAction("phone_contact", "footer_email")}
                  className="hover:text-[#00E5FF]"
                >
                  {siteConfig.contact_email}
                </button>
              </p>
              <p className="sm:col-span-2">
                <span className="font-semibold text-[#C4CAD9]">사업장 소재지:</span>{" "}
                {siteConfig.company_address}
              </p>
            </div>
          </div>

          {/* 우측 섹션 퀵링크 & 24시간 고객센터 요약 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-5">
            <div>
              <p className="mb-3 font-mono text-[11px] font-bold tracking-wider text-[#00E5FF] uppercase">
                QUICK ACCESS // 섹션 바로가기
              </p>
              <ul className="space-y-2">
                {NAV_SECTIONS.map((sec) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className="transition hover:text-[#00E5FF]"
                    >
                      [{sec.code}] {sec.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link href="/admin" className="transition hover:text-[#00E5FF]">
                    [CMS] 관리자 시스템
                  </Link>
                </li>
              </ul>
            </div>

            <div className="border border-white/10 bg-[#101019] p-4">
              <p className="font-mono text-[11px] font-bold text-[#B4FF39]">
                24/7 CUSTOMER CENTER
              </p>
              <button
                type="button"
                onClick={() => onOpenAction("phone_contact", "footer_phone")}
                className="mt-1.5 flex items-center gap-1.5 font-mono text-lg font-extrabold text-white hover:text-[#00E5FF]"
              >
                <PhoneCall className="h-4 w-4 text-[#00E5FF]" />
                <span>{siteConfig.cs_phone}</span>
              </button>
              <p className="mt-1 text-[11px] text-[#8E95A9]">
                365일 연중무휴 24시간 전화·문자·카카오톡·AnyDesk 원격지원 상시 대기
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAction("kakao_consult", "footer_kakao")}
                  className="inline-flex items-center gap-1 border border-[#FEE500]/40 bg-[#FEE500]/10 px-2.5 py-1 text-[11px] font-bold text-[#FEE500] transition hover:bg-[#FEE500]/20"
                >
                  <span>카카오톡 상담</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAction("phone_contact", "footer_anydesk")}
                  className="inline-flex items-center gap-1 border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:border-[#00E5FF]"
                >
                  <span>AnyDesk 원격지원</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 저작권 및 보안 배지 */}
        <div className="mt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-[#8E95A9]">
            COPYRIGHT (C) {new Date().getFullYear()} {siteConfig.company_name} (
            {siteConfig.brand_name}). ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#8E95A9]">
            <ShieldCheck className="h-4 w-4 text-[#00E5FF]" />
            <span>SHA-256 클라이언트 무결성 검증 및 24시간 보안 관제 적용</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
