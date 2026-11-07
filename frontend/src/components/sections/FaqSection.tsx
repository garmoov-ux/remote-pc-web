/**
 * 자주 묻는 질문 아코디언 섹션(#faq — FaqSection) 컴포넌트입니다.
 * 한글 초성/키워드 실시간 검색과 부드러운 아코디언 개폐 인터랙션을 제공합니다.
 */

"use client";

import { useMemo, useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import type { FaqItem } from "@/types/portal";
import { matchesKoreanSearch } from "@/utils/choseongSearch";

interface FaqSectionProps {
  faqs: FaqItem[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? 1);
  const [keyword, setKeyword] = useState<string>("");

  const filteredFaqs = useMemo(() => {
    return faqs.filter(
      (item) =>
        matchesKoreanSearch(item.question, keyword) ||
        matchesKoreanSearch(item.answer, keyword) ||
        matchesKoreanSearch(item.category, keyword)
    );
  }, [faqs, keyword]);

  const toggleItem = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-section-title"
      className="relative z-10 scroll-mt-20 border-t border-white/10 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        {/* 섹션 상단 헤더 */}
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-[#00E5FF]">
              <span>SEC // 05</span>
              <span className="h-px w-8 bg-[#00E5FF]/50" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2
              id="faq-section-title"
              className="mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl"
            >
              자주 묻는 질문 (FAQ)
            </h2>
            <p className="mt-2 text-sm text-[#C4CAD9]">
              요금 체계, 이용 원리, 사양, 종료 방법 등 가장 많이 문의하시는 내용을
              정리했습니다.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#00E5FF]" />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="질문 키워드 검색 (예: 요금, 종료)"
              aria-label="자주 묻는 질문 키워드 검색"
              className="w-full border border-white/20 bg-[#101019] py-2.5 pr-4 pl-10 text-xs text-white placeholder-[#8E95A9] focus:border-[#00E5FF] focus:outline-none sm:text-sm"
            />
          </div>
        </div>

        {/* 아코디언 리스트 */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border transition ${
                  isOpen
                    ? "border-[#00E5FF]/60 bg-[#101019] shadow-[0_0_25px_rgba(0,229,255,0.12)]"
                    : "border-white/10 bg-[#101019]/75 hover:border-white/25"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleItem(faq.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-[#00E5FF]">
                        Q0{idx + 1}
                      </span>
                      <span className="border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] font-bold text-[#C4CAD9]">
                        {faq.category}
                      </span>
                      <span className="text-sm font-extrabold text-white sm:text-base">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#00E5FF] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>

                {isOpen && (
                  <div className="border-t border-white/10 bg-[#0A0A0F]/60 px-5 py-4 text-xs leading-relaxed text-[#C4CAD9] sm:text-sm">
                    <div className="flex items-start gap-2.5">
                      <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B4FF39]" />
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

