/**
 * 현재 뷰포트 스크롤 위치를 감지하여 활성 섹션 ID(#how, #games, #why, #notice, #faq)를 반환하는 커스텀 훅입니다.
 */

"use client";

import { useEffect, useState } from "react";

export function useScrollSpy(sectionIds: readonly string[], offsetPx = 180): string {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + offsetPx;
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = id;
            break;
          }
        }
      }
      setActiveId(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offsetPx]);

  return activeId;
}
