/**
 * 원격플러그인 피시 (UNPLUG 원격 PC방) 관리자 CMS 페이지 엔트리(/admin/page.tsx)입니다.
 */

import type { Metadata } from "next";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

export const metadata: Metadata = {
  title: "관리자 CMS | 원격플러그인 피시 (UNPLUG 원격 PC방)",
  description:
    "원격플러그인 피시 접속기 다운로드 전환 통계, 서비스 게임 카탈로그 및 릴리스 버전 관리 센터",
};

export default function AdminCmsPage() {
  return <AdminDashboardView />;
}
