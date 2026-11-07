"""
관리자 CMS 인증(`/api/auth/login`, `/api/auth/me`) 라우터 모듈입니다.
"""

from typing import Any

from fastapi import APIRouter, Header, HTTPException, status

from app.schemas.common import ApiResponse, ErrorDetail
from app.schemas.portal import AdminLoginRequest, AdminLoginResponse
from app.services.admin_service import (
    create_admin_jwt_token,
    verify_admin_credentials,
    verify_admin_jwt_token,
)

router = APIRouter(prefix="/api/auth", tags=["관리자 인증 API"])


@router.post(
    "/login",
    response_model=ApiResponse[AdminLoginResponse],
    summary="관리자 로그인 및 JWT 액세스 토큰 발급",
    description="관리자 아이디와 비밀번호를 검증하고 관리자 CMS 전용 JWT 토큰을 발급합니다.",
)
async def login_admin(body: AdminLoginRequest) -> ApiResponse[AdminLoginResponse]:
    """관리자 자격증명을 확인하고 JWT 토큰을 반환합니다."""
    if not verify_admin_credentials(body.username, body.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ErrorDetail(
                code="AUTH_INVALID_CREDENTIALS",
                message="관리자 아이디 또는 비밀번호가 일치하지 않습니다.",
            ).model_dump(),
        )
    token_data = create_admin_jwt_token(body.username.strip())
    return ApiResponse(success=True, data=token_data)


@router.get(
    "/me",
    response_model=ApiResponse[dict[str, Any]],
    summary="현재 로그인된 관리자 토큰 검증",
    description="Authorization Bearer 토큰의 유효성을 확인하고 관리자 프로필을 반환합니다.",
)
async def get_current_admin(
    authorization: str | None = Header(default=None),
) -> ApiResponse[dict[str, Any]]:
    """현재 관리자 세션 정보를 반환합니다."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 토큰이 필요합니다.",
        )
    raw_token = authorization.split(" ", 1)[1].strip()
    decoded = verify_admin_jwt_token(raw_token)
    if not decoded:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="만료되었거나 유효하지 않은 관리자 토큰입니다.",
        )
    return ApiResponse(
        success=True,
        data={"username": decoded.get("sub"), "role": decoded.get("role")},
    )

