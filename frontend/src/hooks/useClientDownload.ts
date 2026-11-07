/**
 * "접속기 설치", "카카오톡", "우측하단 연락처" 등 주요 버튼 클릭 시
 * 당근마켓(당근양파님) 채팅 요약 및 AI 시대 필수 학습 안내 모달을 카테고리별로 오픈하고 전환 로그를 기록하는 커스텀 훅입니다.
 */

"use client";

import { useCallback, useState } from "react";
import type { ActionModalCategory } from "@/constants/daangnChatStory";
import { trackDownloadClick } from "@/services/portalApi";

export function useClientDownload() {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [activeModalCategory, setActiveModalCategory] =
    useState<ActionModalCategory>("client_download");
  const [lastTriggerSection, setLastTriggerSection] = useState("hero_cta");

  const openActionModal = useCallback(
    (category: ActionModalCategory, triggerSection: string) => {
      setActiveModalCategory(category);
      setLastTriggerSection(triggerSection);
      setIsInstallModalOpen(true);
      void trackDownloadClick(`${category}:${triggerSection}`);
    },
    []
  );

  const openDownloadGuide = useCallback(
    (triggerSection: string) => {
      openActionModal("client_download", triggerSection);
    },
    [openActionModal]
  );

  const closeDownloadGuide = useCallback(() => {
    setIsInstallModalOpen(false);
  }, []);

  return {
    isInstallModalOpen,
    activeModalCategory,
    setActiveModalCategory,
    lastTriggerSection,
    openActionModal,
    openDownloadGuide,
    closeDownloadGuide,
  };
}
