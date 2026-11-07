/**
 * 접속기 설치 버튼 클릭 시 전환 로그 기록 및 사전 체크리스트 모달(InstallGuideModal) 오픈을 제어하는 커스텀 훅입니다.
 */

"use client";

import { useCallback, useState } from "react";
import { trackDownloadClick } from "@/services/portalApi";

export function useClientDownload() {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [lastTriggerSection, setLastTriggerSection] = useState("hero_cta");

  const openDownloadGuide = useCallback((triggerSection: string) => {
    setLastTriggerSection(triggerSection);
    setIsInstallModalOpen(true);
    void trackDownloadClick(triggerSection);
  }, []);

  const closeDownloadGuide = useCallback(() => {
    setIsInstallModalOpen(false);
  }, []);

  return {
    isInstallModalOpen,
    lastTriggerSection,
    openDownloadGuide,
    closeDownloadGuide,
  };
}
