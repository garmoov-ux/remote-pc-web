/**
 * 원격플러그인 피시 (UNPLUG 원격 PC방) 관리자 CMS 대시보드 뷰(AdminDashboardView) 컴포넌트입니다.
 * 관리자 인증, 접속기 다운로드 통계 조회, 엑셀(.xlsx) 리포트 추출, 서비스 게임 등록/수정, 접속기 릴리스 버전 갱신 기능을 제공합니다.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  FileSpreadsheet,
  Gamepad2,
  Lock,
  PackageCheck,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { AppDialogModal } from "@/components/common/AppDialogModal";
import { DEFAULT_PORTAL_BOOTSTRAP } from "@/constants/portalData";
import {
  callAdminRpc,
  fetchPortalBootstrap,
  loginAdminApi,
} from "@/services/portalApi";
import type {
  DialogModalState,
  GameGenreType,
  GameSupportStatus,
  PortalBootstrapData,
} from "@/types/portal";
import { formatKoreanDateTime } from "@/utils/formatters";

interface StatsSummaryResult {
  total_downloads: number;
  total_games: number;
  section_breakdown: Record<string, number>;
  recent_logs: Array<{
    id: number;
    trigger_section: string;
    release_version: string;
    client_ip_masked: string;
    referrer: string;
    created_at: string;
  }>;
}

export function AdminDashboardView() {
  const [portalData, setPortalData] = useState<PortalBootstrapData>(
    DEFAULT_PORTAL_BOOTSTRAP
  );
  const [stats, setStats] = useState<StatsSummaryResult>({
    total_downloads: 0,
    total_games: DEFAULT_PORTAL_BOOTSTRAP.games.length,
    section_breakdown: {},
    recent_logs: [],
  });
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("admin");
  const [password, setPassword] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"stats" | "games" | "release">(
    "stats"
  );

  // 신규/수정 게임 폼 상태
  const [gameCode, setGameCode] = useState("G-51");
  const [gameTitle, setGameTitle] = useState("");
  const [gameGenre, setGameGenre] =
    useState<Exclude<GameGenreType, "전체">>("MMORPG");
  const [gameStatus, setGameStatus] = useState<GameSupportStatus>("available");
  const [gameBadge, setGameBadge] = useState("PC방 프리미엄");
  const [gameBenefit, setGameBenefit] = useState("집에서 PC방 혜택 동일 적용");

  // 릴리스 수정 폼 상태
  const [relVersion, setRelVersion] = useState(
    DEFAULT_PORTAL_BOOTSTRAP.latest_release.version
  );
  const [relFilename, setRelFilename] = useState(
    DEFAULT_PORTAL_BOOTSTRAP.latest_release.filename
  );
  const [relFallbackUrl, setRelFallbackUrl] = useState(
    DEFAULT_PORTAL_BOOTSTRAP.latest_release.fallback_cdn_url
  );
  const [relNotes, setRelNotes] = useState(
    DEFAULT_PORTAL_BOOTSTRAP.latest_release.release_notes
  );

  const [dialog, setDialog] = useState<DialogModalState>({
    isOpen: false,
    title: "",
    description: "",
  });

  const showNoticeModal = (title: string, description: string) => {
    setDialog({ isOpen: true, title, description });
  };

  const loadData = useCallback(async () => {
    const boot = await fetchPortalBootstrap();
    setPortalData(boot);
    setRelVersion(boot.latest_release.version);
    setRelFilename(boot.latest_release.filename);
    setRelFallbackUrl(boot.latest_release.fallback_cdn_url);
    setRelNotes(boot.latest_release.release_notes);
    try {
      const rpcStats = await callAdminRpc<StatsSummaryResult>("stats.summary");
      if (rpcStats) setStats(rpcStats);
    } catch {
      // 오프라인 시 기본 상태 유지
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await loginAdminApi(username, password);
      setToken(res.access_token);
      showNoticeModal(
        "관리자 인증 완료",
        `${res.username} 계정으로 관리자 CMS 권한이 활성화되었습니다.`
      );
    } catch (err) {
      showNoticeModal(
        "로그인 실패",
        err instanceof Error ? err.message : "인증 정보를 확인해 주세요."
      );
    }
  };

  const handleUpsertGame = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      showNoticeModal("권한 필요", "우측 상단에서 관리자 로그인을 먼저 진행해 주세요.");
      return;
    }
    try {
      await callAdminRpc(
        "game.upsert",
        {
          game_code: gameCode,
          title: gameTitle,
          genre: gameGenre,
          support_status: gameStatus,
          badge_label: gameBadge,
          benefit_summary: gameBenefit,
        },
        token
      );
      await loadData();
      setGameTitle("");
      showNoticeModal(
        "서비스 게임 저장 완료",
        `${gameCode} (${gameTitle}) 항목이 포털 카탈로그에 즉시 반영되었습니다.`
      );
    } catch (err) {
      showNoticeModal(
        "저장 오류",
        err instanceof Error ? err.message : "게임 저장 중 오류가 발생했습니다."
      );
    }
  };

  const handleUpdateRelease = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      showNoticeModal("권한 필요", "관리자 로그인 후 릴리스 정보를 변경할 수 있습니다.");
      return;
    }
    try {
      await callAdminRpc(
        "release.update",
        {
          version: relVersion,
          filename: relFilename,
          fallback_cdn_url: relFallbackUrl,
          release_notes: relNotes,
        },
        token
      );
      await loadData();
      showNoticeModal(
        "접속기 릴리스 업데이트 완료",
        `접속기 배포 버전이 ${relVersion} (${relFilename})으로 갱신되었습니다.`
      );
    } catch (err) {
      showNoticeModal(
        "업데이트 오류",
        err instanceof Error ? err.message : "릴리스 갱신 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* 상단 관리자 바 */}
      <header className="border-b border-[#00E5FF]/25 bg-[#101019] py-4">
        <div className="mx-auto flex max-w-340 flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-[#C4CAD9] transition hover:border-[#00E5FF] hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>포털 메인으로 돌아가기</span>
            </Link>
            <div>
              <span className="font-mono text-[10px] font-bold text-[#00E5FF]">
                ADMINISTRATION // JSON-RPC 2.0 CMS
              </span>
              <h1 className="text-lg font-extrabold text-white">
                {portalData.site_config.brand_name} 운영 관리 센터
              </h1>
            </div>
          </div>

          {/* 우측 관리자 인증 폼 또는 인증 배지 */}
          {token ? (
            <div className="flex items-center gap-3">
              <span className="border border-[#B4FF39]/40 bg-[#B4FF39]/10 px-3 py-1.5 font-mono text-xs font-bold text-[#B4FF39]">
                ADMIN AUTHENTICATED ({username})
              </span>
              <button
                type="button"
                onClick={() => setToken("")}
                className="border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-[#C4CAD9] hover:text-white"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="관리자 ID"
                aria-label="관리자 아이디"
                className="w-28 border border-white/20 bg-[#0A0A0F] px-2.5 py-1.5 text-xs text-white"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 (unplug2026!@)"
                aria-label="관리자 비밀번호"
                className="w-40 border border-white/20 bg-[#0A0A0F] px-2.5 py-1.5 text-xs text-white"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-[#00E5FF] px-3.5 py-1.5 text-xs font-extrabold text-[#05080F] hover:bg-[#4DF0FF]"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>관리자 로그인</span>
              </button>
            </form>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-340 px-4 py-8 sm:px-6 lg:px-8">
        {/* 상단 요약 카드 3종 + 엑셀 다운로드 */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border border-white/10 bg-[#101019] p-5">
            <p className="font-mono text-xs text-[#8E95A9]">TOTAL DOWNLOAD CLICKS</p>
            <p className="mt-2 font-display text-3xl font-black text-[#00E5FF]">
              {stats.total_downloads}건
            </p>
            <p className="mt-1 text-xs text-[#C4CAD9]">누적 접속기 다운로드 전환</p>
          </div>

          <div className="border border-white/10 bg-[#101019] p-5">
            <p className="font-mono text-xs text-[#8E95A9]">ACTIVE GAMES</p>
            <p className="mt-2 font-display text-3xl font-black text-white">
              {portalData.games.length}종
            </p>
            <p className="mt-1 text-xs text-[#C4CAD9]">카탈로그 등록 서비스 게임</p>
          </div>

          <div className="border border-white/10 bg-[#101019] p-5">
            <p className="font-mono text-xs text-[#8E95A9]">LATEST CLIENT RELEASE</p>
            <p className="mt-2 font-display text-2xl font-black text-[#B4FF39]">
              {portalData.latest_release.version}
            </p>
            <p className="mt-1 font-mono text-xs text-[#C4CAD9]">
              {portalData.latest_release.filename}
            </p>
          </div>

          <div className="flex flex-col justify-between border border-[#00E5FF]/35 bg-[#101019] p-5">
            <div>
              <p className="font-mono text-xs font-bold text-[#00E5FF]">
                EXCEL REPORT // OPENPYXL
              </p>
              <p className="mt-1 text-xs text-[#C4CAD9]">
                다운로드 전환 로그 및 전체 게임 목록 엑셀 다운로드
              </p>
            </div>
            <a
              href="/api/downloads/stats.xlsx"
              download="stats.xlsx"
              className="mt-3 inline-flex items-center justify-center gap-2 bg-[#00E5FF] py-2.5 text-xs font-extrabold text-[#05080F] transition hover:bg-[#4DF0FF]"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>통계 엑셀(.xlsx) 다운로드</span>
            </a>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("stats")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold ${
                activeTab === "stats"
                  ? "bg-[#00E5FF] text-[#05080F]"
                  : "border border-white/15 bg-[#101019] text-[#C4CAD9]"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>다운로드 전환 로그</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("games")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold ${
                activeTab === "games"
                  ? "bg-[#00E5FF] text-[#05080F]"
                  : "border border-white/15 bg-[#101019] text-[#C4CAD9]"
              }`}
            >
              <Gamepad2 className="h-4 w-4" />
              <span>서비스 게임 추가·관리</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("release")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold ${
                activeTab === "release"
                  ? "bg-[#00E5FF] text-[#05080F]"
                  : "border border-white/15 bg-[#101019] text-[#C4CAD9]"
              }`}
            >
              <PackageCheck className="h-4 w-4" />
              <span>접속기 릴리스 버전 관리</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => void loadData()}
            className="inline-flex items-center gap-1.5 border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-[#C4CAD9] hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>데이터 새로고침</span>
          </button>
        </div>

        {/* 탭 1: 다운로드 로그 */}
        {activeTab === "stats" && (
          <div className="border border-white/10 bg-[#101019] p-6">
            <h2 className="mb-4 text-base font-extrabold text-white">
              최근 접속기 다운로드 클릭 전환 이력 (최근 25건)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#00E5FF]">
                    <th className="py-2.5 pr-4">번호</th>
                    <th className="py-2.5 pr-4">클릭 발생 섹션</th>
                    <th className="py-2.5 pr-4">릴리스 버전</th>
                    <th className="py-2.5 pr-4">마스킹 IP</th>
                    <th className="py-2.5">발생 일시</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-[#C4CAD9]">
                  {stats.recent_logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[#8E95A9]">
                        아직 기록된 다운로드 클릭 이벤트가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    stats.recent_logs.map((row) => (
                      <tr key={row.id}>
                        <td className="py-2.5 pr-4 font-mono">#{row.id}</td>
                        <td className="py-2.5 pr-4 font-semibold text-white">
                          {row.trigger_section}
                        </td>
                        <td className="py-2.5 pr-4 font-mono text-[#B4FF39]">
                          {row.release_version}
                        </td>
                        <td className="py-2.5 pr-4 font-mono">
                          {row.client_ip_masked}
                        </td>
                        <td className="py-2.5 font-mono">
                          {formatKoreanDateTime(row.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 탭 2: 서비스 게임 추가/수정 */}
        {activeTab === "games" && (
          <div className="border border-white/10 bg-[#101019] p-6">
            <h2 className="mb-4 text-base font-extrabold text-white">
              신규 서비스 게임 등록 또는 기존 코드 업데이트 (game.upsert)
            </h2>
            <form
              onSubmit={handleUpsertGame}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <div>
                <label className="block text-xs text-[#8E95A9]">게임 코드</label>
                <input
                  type="text"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value)}
                  required
                  className="mt-1 w-full border border-white/20 bg-[#0A0A0F] px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8E95A9]">게임명</label>
                <input
                  type="text"
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="예: 삼국지 전략판"
                  required
                  className="mt-1 w-full border border-white/20 bg-[#0A0A0F] px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8E95A9]">장르</label>
                <select
                  value={gameGenre}
                  onChange={(e) =>
                    setGameGenre(e.target.value as Exclude<GameGenreType, "전체">)
                  }
                  className="mt-1 w-full border border-white/20 bg-[#0A0A0F] px-3 py-2 text-xs text-white"
                >
                  <option value="MMORPG">MMORPG</option>
                  <option value="스포츠/FPS">스포츠/FPS</option>
                  <option value="액션/기타">액션/기타</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#8E95A9]">지원 상태</label>
                <select
                  value={gameStatus}
                  onChange={(e) =>
                    setGameStatus(e.target.value as GameSupportStatus)
                  }
                  className="mt-1 w-full border border-white/20 bg-[#0A0A0F] px-3 py-2 text-xs text-white"
                >
                  <option value="available">지원 가능 (available)</option>
                  <option value="direct">바로접속 강조 (direct)</option>
                  <option value="restricted">이용 제한 고지 (restricted)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#8E95A9]">배지 라벨</label>
                <input
                  type="text"
                  value={gameBadge}
                  onChange={(e) => setGameBadge(e.target.value)}
                  className="mt-1 w-full border border-white/20 bg-[#0A0A0F] px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8E95A9]">PC방 혜택 설명</label>
                <input
                  type="text"
                  value={gameBenefit}
                  onChange={(e) => setGameBenefit(e.target.value)}
                  className="mt-1 w-full border border-white/20 bg-[#0A0A0F] px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#00E5FF] px-6 py-2.5 text-xs font-extrabold text-[#05080F] hover:bg-[#4DF0FF]"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>게임 카탈로그에 즉시 반영</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 탭 3: 접속기 릴리스 관리 */}
        {activeTab === "release" && (
          <div className="border border-white/10 bg-[#101019] p-6">
            <h2 className="mb-4 text-base font-extrabold text-white">
              접속기 패키지 버전 및 배포 URL 설정 (release.update)
            </h2>
            <form
              onSubmit={handleUpdateRelease}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <div>
                <label className="block text-xs text-[#8E95A9]">릴리스 버전</label>
                <input
                  type="text"
                  value={relVersion}
                  onChange={(e) => setRelVersion(e.target.value)}
                  className="mt-1 w-full border border-white/20 bg-[#0A0A0F] px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8E95A9]">설치 파일명</label>
                <input
                  type="text"
                  value={relFilename}
                  onChange={(e) => setRelFilename(e.target.value)}
                  className="mt-1 w-full border border-white/20 bg-[#0A0A0F] px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-[#8E95A9]">
                  외부 CDN 미러 다운로드 URL
                </label>
                <input
                  type="url"
                  value={relFallbackUrl}
                  onChange={(e) => setRelFallbackUrl(e.target.value)}
                  className="mt-1 w-full border border-white/20 bg-[#0A0A0F] px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-[#8E95A9]">릴리스 노트</label>
                <input
                  type="text"
                  value={relNotes}
                  onChange={(e) => setRelNotes(e.target.value)}
                  className="mt-1 w-full border border-white/20 bg-[#0A0A0F] px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#00E5FF] px-6 py-2.5 text-xs font-extrabold text-[#05080F] hover:bg-[#4DF0FF]"
                >
                  <PackageCheck className="h-4 w-4" />
                  <span>릴리스 정보 저장</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <AppDialogModal
        modal={dialog}
        onClose={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

