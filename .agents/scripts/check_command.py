"""
에이전트 명령어 실행 전 위험 명령어(DROP TABLE, TRUNCATE, rm -rf 등)를 사전 차단하는 PreToolUse 안전 훅 스크립트입니다.
"""

import json
import sys


def main() -> None:
    """표준 입력으로 전달된 도구 호출 인자를 검사하여 허용(allow) 또는 차단(deny)을 반환합니다."""
    try:
        payload = json.load(sys.stdin)
    except Exception:
        print(json.dumps({"decision": "allow"}))
        return

    command_line = (
        payload.get("toolCall", {})
        .get("args", {})
        .get("CommandLine", "")
        .lower()
    )

    dangerous_patterns = [
        "drop table",
        "drop database",
        "truncate table",
        "rm -rf /",
        "format c:",
        "git push --force origin main",
        "git push -f origin main",
    ]

    for pattern in dangerous_patterns:
        if pattern in command_line:
            print(
                json.dumps(
                    {
                        "decision": "deny",
                        "reason": f"보안 및 데이터 보호 규칙에 의해 위험 명령어 패턴({pattern}) 실행이 차단되었습니다.",
                    },
                    ensure_ascii=False,
                )
            )
            return

    print(json.dumps({"decision": "allow"}))


if __name__ == "__main__":
    main()

