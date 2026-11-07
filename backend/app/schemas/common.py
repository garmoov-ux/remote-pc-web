"""
표준 API 응답 엔벨로프(ApiResponse) 및 JSON-RPC 2.0 프로토콜 스키마 모듈입니다.
"""

from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class ErrorDetail(BaseModel):
    """오류 발생 시 상세 코드 및 한글 메시지를 담는 스키마입니다."""

    code: str = Field(..., description="표준 에러 코드")
    message: str = Field(..., description="사용자 및 관리자용 한글 에러 메시지")
    details: dict[str, Any] | None = Field(default=None, description="추가 에러 상세 정보")


class ApiResponse(BaseModel, Generic[T]):
    """모든 REST API가 공통으로 반환하는 최상위 응답 엔벨로프입니다."""

    success: bool = Field(default=True, description="요청 처리 성공 여부")
    data: T | None = Field(default=None, description="실제 응답 페이로드 데이터")
    error: ErrorDetail | None = Field(default=None, description="실패 시 에러 객체")
    meta: dict[str, Any] = Field(default_factory=dict, description="메타 정보")


class JsonRpcRequest(BaseModel):
    """관리자 CMS(`/api/rpc`) 전용 JSON-RPC 2.0 요청 스키마입니다."""

    jsonrpc: str = Field(default="2.0", description="JSON-RPC 버전")
    method: str = Field(..., description="실행할 도메인 메서드 (예: game.upsert)")
    params: dict[str, Any] = Field(default_factory=dict, description="메서드 인자")
    id: str | int | None = Field(default=1, description="요청 식별자")


class JsonRpcResponse(BaseModel):
    """관리자 CMS(`/api/rpc`) 전용 JSON-RPC 2.0 응답 스키마입니다."""

    jsonrpc: str = Field(default="2.0", description="JSON-RPC 버전")
    result: Any | None = Field(default=None, description="성공 결과 데이터")
    error: dict[str, Any] | None = Field(default=None, description="JSON-RPC 에러 객체")
    id: str | int | None = Field(default=1, description="요청 식별자")
