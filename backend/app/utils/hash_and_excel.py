"""
클라이언트 설치 파일 SHA-256 무결성 검증 및 openpyxl 기반 엑셀(.xlsx) 리포트 생성 유틸리티 모듈입니다.
"""

import hashlib
from io import BytesIO
from pathlib import Path
from typing import Any

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill


def compute_file_sha256(file_path: str | Path, fallback_hash: str) -> str:
    """로컬 설치 파일이 존재할 경우 실제 SHA-256 해시를 계산하고, 없으면 설정된 기본 해시를 반환합니다."""
    path = Path(file_path)
    if not path.is_file():
        return fallback_hash
    sha256 = hashlib.sha256()
    with path.open("rb") as fp:
        for chunk in iter(lambda: fp.read(65536), b""):
            sha256.update(chunk)
    return sha256.hexdigest()


def build_download_stats_workbook(
    logs: list[dict[str, Any]],
    games: list[dict[str, Any]],
) -> bytes:
    """접속기 다운로드 전환 로그와 서비스 게임 목록을 포함한 2개 시트 엑셀(.xlsx) 바이너리를 생성합니다."""
    wb = Workbook()

    # 시트 1: 접속기 다운로드 로그
    ws_logs = wb.active
    ws_logs.title = "접속기_다운로드_로그"

    header_fill = PatternFill(start_color="101019", end_color="101019", fill_type="solid")
    header_font = Font(name="맑은 고딕", size=11, bold=True, color="00E5FF")
    body_font = Font(name="맑은 고딕", size=10)

    log_headers = ["번호", "클릭 섹션", "릴리스 버전", "마스킹 IP", "유입 경로(Referrer)", "발생 일시(UTC)"]
    ws_logs.append(log_headers)

    for col_idx in range(1, len(log_headers) + 1):
        cell = ws_logs.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center")

    for row in logs:
        ws_logs.append(
            [
                row.get("id", ""),
                row.get("trigger_section", ""),
                row.get("release_version", ""),
                row.get("client_ip_masked", ""),
                row.get("referrer", ""),
                str(row.get("created_at", "")),
            ]
        )

    for row_cells in ws_logs.iter_rows(min_row=2):
        for cell in row_cells:
            cell.font = body_font

    for col in ws_logs.columns:
        max_len = max(len(str(c.value or "")) for c in col)
        ws_logs.column_dimensions[col[0].column_letter].width = max(max_len + 5, 16)

    # 시트 2: 서비스 게임 카탈로그
    ws_games = wb.create_sheet(title="서비스_게임_카탈로그")
    game_headers = ["게임코드", "게임명", "장르", "지원상태", "배지라벨", "PC방 혜택 요약"]
    ws_games.append(game_headers)

    for col_idx in range(1, len(game_headers) + 1):
        cell = ws_games.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center")

    for game in games:
        ws_games.append(
            [
                game.get("game_code", ""),
                game.get("title", ""),
                game.get("genre", ""),
                game.get("support_status", ""),
                game.get("badge_label", ""),
                game.get("benefit_summary", ""),
            ]
        )

    for row_cells in ws_games.iter_rows(min_row=2):
        for cell in row_cells:
            cell.font = body_font

    for col in ws_games.columns:
        max_len = max(len(str(c.value or "")) for c in col)
        ws_games.column_dimensions[col[0].column_letter].width = max(max_len + 5, 18)

    stream = BytesIO()
    wb.save(stream)
    return stream.getvalue()
