/**
 * 원격플러그인 피시 (UNPLUG 원격 PC방) 루트 레이아웃(layout.tsx) 모듈입니다.
 * Pretendard Variable 및 Orbitron 웹폰트 로드, SEO 메타태그, OpenGraph 및 JSON-LD 구조화 데이터를 포함합니다.
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "원격플러그인 피시 | 24시 고사양 원격PC방 · 지피방 · 홈피씨 (UNPLUG)",
  description:
    "PC방 그 사양 그대로, 자리만 내 방으로. 전국 70+ 정식 제휴 PC방, 50+ 인기 게임 프리미엄 혜택, 1만원 기준 600분(10시간), 대기 시간 0분으로 즉시 접속하세요.",
  keywords: [
    "원격플러그인 피시",
    "원격PC방",
    "지피방",
    "홈피씨",
    "언플러그 원격PC방",
    "로스트아크 원격PC방",
    "메이플스토리 지피방",
    "피파온라인4 지피방",
    "리니지 원격PC방",
  ],
  openGraph: {
    title: "원격플러그인 피시 — PC방 그 사양 그대로, 자리만 내 방으로",
    description:
      "설치부터 접속까지 단 3분. 상담·예약·대기 없이 전국 70+ 고사양 PC방 좌석으로 즉시 연결됩니다.",
    type: "website",
    locale: "ko_KR",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const structuredDataJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "원격플러그인 피시 (UNPLUG 원격 PC방)",
      description:
        "24시간 연중무휴 집에서 바로 접속하는 고사양 원격PC방 · 지피방 서비스",
    },
    {
      "@type": "Organization",
      name: "언플러그 (원격플러그인 피시)",
      telephone: "010-3470-8716",
      email: "pueen123@naver.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "대청로 210번길 24",
        addressLocality: "김해시",
        addressRegion: "경상남도",
        addressCountry: "KR",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700;800&family=Orbitron:wght@700;800;900&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataJsonLd),
          }}
        />
      </head>
      <body className="min-h-screen antialiased selection:bg-[#00E5FF] selection:text-[#05080F]">
        {children}
      </body>
    </html>
  );
}
