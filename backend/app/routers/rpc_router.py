"""
관리자 CMS 전용 JSON-RPC 2.0 단일 엔드포인트(`/api/rpc`) 라우터 모듈입니다.
게임 추가/수정/삭제, 공지사항/FAQ 관리, 릴리스 정보 갱신, 다운로드 통계 요약 조회를 처리합니다.
"""

from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db_session
from app.schemas.common import JsonRpcRequest, JsonRpcResponse
from app.services.admin_service import (
    execute_admin_rpc_method,
    verify_admin_jwt_token,
)

router = APIRouter(prefix="/api/rpc", tags=["관리자 JSON-RPC 2.0 API"])

PUBLIC_READONLY_METHODS = {"stats.summary"}


@router.post(
    "",
    response_model=JsonRpcResponse,
    summary="관리자 CMS JSON-RPC 2.0 디스패처",
    description="method 필드(stats.summary, game.upsert, game.delete, release.update, config.update, faq.upsert, notice.upsert)에 따라 작업을 수행합니다.",
)
async def handle_json_rpc(
    rpc_req: JsonRpcRequest,
    authorization: str | None = Header(default=None),
    session: AsyncSession = Depends(get_db_session),
) -> JsonRpcResponse:
    """JSON-RPC 2.0 요청을 검증하고 해당하는 도메인 서비스 메서드를 실행합니다."""
    if rpc_req.method not in PUBLIC_READONLY_METHODS:
        token = ""
        if authorization and authorization.lower().startswith("bearer "):
            token = authorization.split(" ", 1)[1].strip()
        if not token or not verify_admin_jwt_token(token):
            return JsonRpcResponse(
                id=rpc_req.id,
                error={
                    "code": -32001,
                    "message": "관리자 인증이 필요한 작업입니다. 먼저 로그인해 주세요.",
                },
            )

    try:
        result = await execute_admin_rpc_method(
            session=session,
            method=rpc_req.method,
            params=rpc_req.params,
        )
        return JsonRpcResponse(id=rpc_req.id, result=result)
    except KeyError as exc:
        return JsonRpcResponse(
            id=rpc_req.id,
            error={"code": -32601, "message": str(exc)},
        )
    except ValueError as exc:
        return JsonRpcResponse(
            id=rpc_req.id,
            error={"code": -32602, "message": str(exc)},
        )
    except Exception as exc:
        return JsonRpcResponse(
            id=rpc_req.id,
            error={"code": -32603, "message": f"서버 내부 처리 오류: {exc}"},
        )

