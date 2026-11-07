/**
 * 원격플러그인 피시 (UNPLUG 원격 PC방) 웹 포털 전 도메인 TypeScript 인터페이스 정의 모듈입니다.
 */

export type GameGenreType = "전체" | "MMORPG" | "스포츠/FPS" | "액션/기타";

export type GameSupportStatus = "available" | "direct" | "restricted";

export type PortalThemeMode = "cyber" | "warm";

/** 사업자 및 사이트 마스터 설정 인터페이스 */
export interface SiteConfig {
  id: number;
  brand_name: string;
  brand_sub_name: string;
  company_name: string;
  ceo_name: string;
  business_reg_no: string;
  mail_order_reg_no: string;
  company_address: string;
  cs_phone: string;
  kakao_channel_url: string;
  contact_email: string;
  anydesk_download_url: string;
  stat_partner_pc_count: string;
  stat_service_game_count: string;
  stat_base_minutes_per_10k: string;
  stat_avg_wait_minutes: string;
}

/** 실시간 텔레메트리 지표 인터페이스 */
export interface TelemetryData {
  status: string;
  status_label: string;
  partner_stores: string;
  supported_games: string;
  minutes_per_10k: string;
  avg_wait_minutes: string;
  active_nodes: number;
  available_seats: number;
  updated_at: string;
}

/** 접속기 클라이언트 릴리스 정보 인터페이스 */
export interface ClientRelease {
  id: number;
  version: string;
  filename: string;
  download_url: string;
  fallback_cdn_url: string;
  sha256_hash: string;
  file_size_label: string;
  os_support: string;
  release_notes: string;
  is_latest: boolean;
}

/** 4단계 이용 순서 가이드(#how) 항목 인터페이스 */
export interface HowToStep {
  step_no: string;
  badge: string;
  title: string;
  description: string;
  image_url: string;
}

/** 서비스 게임 카탈로그(#games) 항목 인터페이스 */
export interface ServiceGame {
  id: number;
  game_code: string;
  title: string;
  genre: Exclude<GameGenreType, "전체">;
  thumbnail_url: string;
  support_status: GameSupportStatus;
  badge_label: string;
  benefit_summary: string;
  is_featured: boolean;
  display_order: number;
}

/** 서비스 특징 3대 핵심 경쟁력(#why) 인터페이스 */
export interface WhyFeature {
  num: string;
  title: string;
  description: string;
  highlight: string;
}

/** 개발·운영 전담팀 4대 역할(#why) 인터페이스 */
export interface TeamRole {
  role_code: string;
  title: string;
  subtitle: string;
  description: string;
  icon_url: string;
}

/** 공지사항 내 단계별 가이드 인터페이스 */
export interface NoticeStepItem {
  step_no: string;
  title: string;
  description: string;
}

/** 공지사항 및 필수 주의사항(#notice) 인터페이스 */
export interface NoticeItem {
  id: number;
  category: string;
  badge_text: string;
  title: string;
  summary: string;
  steps_json: NoticeStepItem[];
  cta_label?: string | null;
  cta_url?: string | null;
  is_pinned: boolean;
  display_order: number;
}

/** 자주 묻는 질문(#faq) 항목 인터페이스 */
export interface FaqItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  display_order: number;
}

/** 포털 부트스트랩 통합 응답 인터페이스 */
export interface PortalBootstrapData {
  site_config: SiteConfig;
  telemetry: TelemetryData;
  latest_release: ClientRelease;
  how_to_steps: HowToStep[];
  games: ServiceGame[];
  why_features: WhyFeature[];
  team_roles: TeamRole[];
  notices: NoticeItem[];
  faqs: FaqItem[];
}

/** 커스텀 알림/확인 모달 상태 인터페이스 */
export interface DialogModalState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}
