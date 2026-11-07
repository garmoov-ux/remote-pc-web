"""
원격플러그인 피시 (UNPLUG 원격 PC방) 백엔드 API 통합 테스트 모듈입니다.
포털 부트스트랩, 게임 필터, 다운로드 리다이렉트 및 트래킹, 관리자 로그인 및 JSON-RPC, 엑셀 출력을 검증합니다.
"""

import pytest
from httpx import ASGITransport, AsyncClient

from app.config import get_settings
from app.main import app, lifespan

settings = get_settings()


@pytest.mark.asyncio
async def test_portal_fullstack_api_lifecycle() -> None:
    """포털 부트스트랩 조회부터 다운로드 트래킹, 관리자 RPC, 엑셀 추출까지 전 과정을 검증합니다."""
    async with lifespan(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(
            transport=transport, base_url="http://testserver"
        ) as client:
            # 1. 헬스체크 검증
            health_res = await client.get("/api/health")
            assert health_res.status_code == 200
            assert health_res.json()["success"] is True

            # 2. 포털 부트스트랩 단일 조회 검증
            boot_res = await client.get("/api/portal/bootstrap")
            assert boot_res.status_code == 200
            boot_body = boot_res.json()
            assert boot_body["success"] is True
            data = boot_body["data"]
            assert data["site_config"]["brand_name"] == "원격플러그인 피시"
            assert data["site_config"]["business_reg_no"] == "240-18-02372"
            assert len(data["games"]) >= 50
            assert len(data["how_to_steps"]) == 4
            assert len(data["notices"]) == 3
            assert len(data["faqs"]) == 7

            # 3. 서비스 게임 장르 필터 조회 검증
            games_res = await client.get(
                "/api/portal/games", params={"genre": "MMORPG", "keyword": "로스트"}
            )
            assert games_res.status_code == 200
            games_list = games_res.json()["data"]
            assert len(games_list) >= 1
            assert games_list[0]["title"] == "로스트아크"

            # 4. 접속기 다운로드 전환 트래킹 및 리다이렉트 검증
            track_res = await client.post(
                "/api/downloads/track",
                json={"trigger_section": "hero_cta", "referrer": "https://search.naver.com"},
            )
            assert track_res.status_code == 200
            assert track_res.json()["data"]["trigger_section"] == "hero_cta"

            dl_res = await client.get(
                "/api/downloads/client",
                params={"source": "header_nav"},
                follow_redirects=False,
            )
            assert dl_res.status_code == 307
            assert "unplug_setup.exe" in dl_res.headers["location"]

            # 5. 관리자 로그인 및 JSON-RPC 게임 등록 검증
            login_res = await client.post(
                "/api/auth/login",
                json={
                    "username": settings.admin_initial_username,
                    "password": settings.admin_initial_password,
                },
            )
            assert login_res.status_code == 200
            token = login_res.json()["data"]["access_token"]

            rpc_res = await client.post(
                "/api/rpc",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "jsonrpc": "2.0",
                    "method": "game.upsert",
                    "params": {
                        "game_code": "G-99",
                        "title": "아이온 클래식",
                        "genre": "MMORPG",
                        "support_status": "available",
                        "badge_label": "PC방 프리미엄",
                        "benefit_summary": "전용 인던 및 경험치 혜택",
                    },
                    "id": 101,
                },
            )
            assert rpc_res.status_code == 200
            assert rpc_res.json()["result"]["game_code"] == "G-99"

            # 6. 엑셀(.xlsx) 리포트 다운로드 검증
            excel_res = await client.get("/api/downloads/stats.xlsx")
            assert excel_res.status_code == 200
            assert (
                excel_res.headers["content-type"]
                == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
            assert len(excel_res.content) > 1000
