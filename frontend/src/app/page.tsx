/**
 *원격플러그인 피시 (UNPLUG 원격 PC방) 메인 포털 페이지 엔트리(page.tsx)입니다.
 * 선제적 분할 원칙(150행 이내)에 따라 배경, 헤더, 8대 핵심 섹션, 푸터, 플로팅 바, 당근 채팅 요약 모달을 조립합니다.
 */

"use client";

import { useEffect, useState } from "react";
import { CyberGridOverlay } from "@/components/background/CyberGridOverlay";
import { NetworkCanvasBg } from "@/components/background/NetworkCanvasBg";
import { InstallGuideModal } from "@/components/common/InstallGuideModal";
import { FloatingConsultBar } from "@/components/layout/FloatingConsultBar";
import { HeaderNav } from "@/components/layout/HeaderNav";
import { MobileMenuOverlay } from "@/components/layout/MobileMenuOverlay";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { DownloadCtaSection } from "@/components/sections/DownloadCtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { GamesCatalogSection } from "@/components/sections/GamesCatalogSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowToUseSection } from "@/components/sections/HowToUseSection";
import { NoticeAndCareSection } from "@/components/sections/NoticeAndCareSection";
import { QuickFlowBanner } from "@/components/sections/QuickFlowBanner";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";
import { DEFAULT_PORTAL_BOOTSTRAP, NAV_SECTIONS } from "@/constants/portalData";
import { useClientDownload } from "@/hooks/useClientDownload";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { fetchPortalBootstrap } from "@/services/portalApi";
import type { PortalBootstrapData, PortalThemeMode } from "@/types/portal";

const SECTION_IDS = NAV_SECTIONS.map((s) => s.id);

export default function PortalHomePage() {
  const [portalData, setPortalData] = useState<PortalBootstrapData>(
    DEFAULT_PORTAL_BOOTSTRAP
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<PortalThemeMode>("cyber");

  const activeSectionId = useScrollSpy(SECTION_IDS);
  const {
    isInstallModalOpen,
    activeModalCategory,
    setActiveModalCategory,
    lastTriggerSection,
    openActionModal,
    openDownloadGuide,
    closeDownloadGuide,
  } = useClientDownload();

  useEffect(() => {
    let mounted = true;
    fetchPortalBootstrap().then((data) => {
      if (mounted) setPortalData(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleTheme = () => {
    const nextTheme: PortalThemeMode = themeMode === "cyber" ? "warm" : "cyber";
    setThemeMode(nextTheme);
    document.documentElement.setAttribute(
      "data-theme",
      nextTheme === "warm" ? "warm" : "cyber"
    );
  };

  return (
    <div className="relative min-h-screen">
      {/* 실시간 Canvas 네트워크 파티클 & 사이버 그리드 오버레이 */}
      <NetworkCanvasBg />
      <CyberGridOverlay />

      {/* 상단 고정 HUD 네비게이션 및 모바일 전체화면 드로어 */}
      <HeaderNav
        siteConfig={portalData.site_config}
        activeSectionId={activeSectionId}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        onOpenDownload={openDownloadGuide}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />
      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        siteConfig={portalData.site_config}
        activeSectionId={activeSectionId}
        onOpenAction={openActionModal}
      />

      {/* 메인 8대 핵심 포털 섹션 */}
      <main>
        <HeroSection
          siteConfig={portalData.site_config}
          telemetry={portalData.telemetry}
          release={portalData.latest_release}
          onOpenDownload={openDownloadGuide}
          onOpenAction={openActionModal}
        />
        <QuickFlowBanner />
        <HowToUseSection
          steps={portalData.how_to_steps}
          onOpenDownload={openDownloadGuide}
        />
        <GamesCatalogSection games={portalData.games} />
        <WhyChooseSection
          features={portalData.why_features}
          teamRoles={portalData.team_roles}
        />
        <NoticeAndCareSection
          notices={portalData.notices}
          siteConfig={portalData.site_config}
          onOpenAction={openActionModal}
        />
        <FaqSection faqs={portalData.faqs} />
        <DownloadCtaSection
          release={portalData.latest_release}
          siteConfig={portalData.site_config}
          onOpenDownload={openDownloadGuide}
        />
      </main>

      {/* 하단 사업자 정보 푸터 & 우측 하단 플로팅 상담 바 & 당근양파님 맞춤형 브리핑 모달 */}
      <SiteFooter
        siteConfig={portalData.site_config}
        onOpenAction={openActionModal}
      />
      <FloatingConsultBar
        siteConfig={portalData.site_config}
        onOpenAction={openActionModal}
      />
      <InstallGuideModal
        isOpen={isInstallModalOpen}
        onClose={closeDownloadGuide}
        category={activeModalCategory}
        onChangeCategory={setActiveModalCategory}
        release={portalData.latest_release}
        siteConfig={portalData.site_config}
        triggerSection={lastTriggerSection}
      />
    </div>
  );
}
