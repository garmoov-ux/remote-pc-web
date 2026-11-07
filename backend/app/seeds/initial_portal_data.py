"""
벤치마크 사이트(원격플러그인피시.kr 및 unplug.co.kr)에서 추출한 초기 시드 데이터 모듈입니다.
50종 서비스 게임, 4단계 이용 순서, 3대 핵심 경쟁력, 4대 전담팀, 3대 필수 공지(정상 종료 2단계/20분 의무사용/AnyDesk), 7대 FAQ를 포함합니다.
"""

from typing import Any

# 1. 원격PC방 4단계 이용 순서 가이드 (#how)
HOW_TO_USE_STEPS: list[dict[str, str]] = [
    {
        "step_no": "01",
        "badge": "STEP 01 // INSTALL & CHARGE",
        "title": "접속기 설치 및 충전",
        "description": "접속기를 다운로드하여 설치한 뒤 프로그램 내에서 간편 회원가입 후 원하는 시간만큼 충전합니다.",
        "image_url": "/images/steps/step-01.jpg",
    },
    {
        "step_no": "02",
        "badge": "STEP 02 // AUTO MATCHING",
        "title": "좌석 자동 연결",
        "description": "전국 70여 개 제휴 PC방의 빈 좌석 중 가장 쾌적한 고사양 PC로 대기 없이 자동 연결됩니다.",
        "image_url": "/images/steps/step-02.jpg",
    },
    {
        "step_no": "03",
        "badge": "STEP 03 // REMOTE PLAY",
        "title": "집에서 원격 플레이",
        "description": "PC방 프리미엄 혜택과 고사양 그래픽 환경 그대로 집이나 노트북에서 쾌적하게 게임을 즐깁니다.",
        "image_url": "/images/steps/step-03.jpg",
    },
    {
        "step_no": "04",
        "badge": "STEP 04 // MINUTE BILLING",
        "title": "분 단위 자동 차감",
        "description": "원격창 종료 후 접속기에서 로그아웃 버튼을 누르면 사용한 시간만 분 단위로 정확히 차감되고 남은 시간은 보존됩니다.",
        "image_url": "/images/steps/step-04.jpg",
    },
]

# 2. 서비스 특징 3대 핵심 경쟁력 (#why)
WHY_CHOOSE_FEATURES: list[dict[str, str]] = [
    {
        "num": "01",
        "title": "자체 기술팀 직접 개발·운영",
        "description": "외주 솔루션에 의존하지 않고 자체 엔지니어링 팀이 접속기와 스트리밍 엔진을 직접 개발·관리하여 즉각적인 업데이트와 안정성을 보장합니다.",
        "highlight": "IN-HOUSE ENGINE",
    },
    {
        "num": "02",
        "title": "365일 24시간 실시간 상담",
        "description": "새벽이나 주말·공휴일에도 전문 운영팀이 상시 대기하며 전화, 문자, 카카오톡, AnyDesk 원격지원으로 문제를 즉시 해결합니다.",
        "highlight": "24/7 LIVE CARE",
    },
    {
        "num": "03",
        "title": "렉 없는 자체 스트리밍 최적화",
        "description": "초저지연 화면 전송 프로토콜과 전국 70+ 지점 전용망 분산 라우팅으로 프레임 드랍과 입력 지연을 극한까지 줄였습니다.",
        "highlight": "ZERO-LAG STREAM",
    },
]

# 3. 개발·운영 전담팀 4대 파트 (#why)
TEAM_ROLES: list[dict[str, str]] = [
    {
        "role_code": "DEV // 01",
        "title": "서비스 개발",
        "subtitle": "Client & Core System",
        "description": "원격 접속기 클라이언트 개발, 자동 좌석 배정 알고리즘 및 보안 모듈 고도화 전담",
        "icon_url": "/images/team/team-service-development.svg",
    },
    {
        "role_code": "INFRA // 02",
        "title": "인프라·최적화",
        "subtitle": "Network & Hardware",
        "description": "전국 70+ 제휴 지점 네트워크 품질 모니터링, 초저지연 인코딩 및 고사양 하드웨어 최적화",
        "icon_url": "/images/team/team-infrastructure.svg",
    },
    {
        "role_code": "OPS // 03",
        "title": "서비스 운영",
        "subtitle": "Game Patch & Seat Ops",
        "description": "50여 종 인기 게임 상시 최신 패치 유지, 지점별 가용 좌석 밸런싱 및 무중단 관제",
        "icon_url": "/images/team/team-operations.svg",
    },
    {
        "role_code": "CARE // 04",
        "title": "고객 지원",
        "subtitle": "24/7 Concierge & AnyDesk",
        "description": "365일 24시간 전화·카카오톡 실시간 응대 및 AnyDesk 1:1 원격 기술 지원 전담",
        "icon_url": "/images/team/team-customer-support.svg",
    },
]

# 4. 서비스 게임 50종 초기 시드 (#games) - 대표 12종(실제 추출 썸네일) + 확장 38종
INITIAL_GAMES: list[dict[str, Any]] = [
    {"game_code": "G-01", "title": "리니지", "genre": "MMORPG", "thumbnail_url": "/images/games/game-01.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 던전 및 날이 빠진 무기 혜택 적용", "is_featured": True, "display_order": 1},
    {"game_code": "G-02", "title": "FC 온라인 (피파온라인4)", "genre": "스포츠/FPS", "thumbnail_url": "/images/games/game-02.jpg", "support_status": "direct", "badge_label": "인기 1위 · 바로접속", "benefit_summary": "이적시장 수수료 30% 할인 및 PC방 전용 접속 보상", "is_featured": True, "display_order": 2},
    {"game_code": "G-03", "title": "메이플스토리", "genre": "MMORPG", "thumbnail_url": "/images/games/game-03.png", "support_status": "direct", "badge_label": "원격PC방 바로접속", "benefit_summary": "프리미엄 PC방 접속 시간 누적 보상 및 추가 경험치", "is_featured": True, "display_order": 3},
    {"game_code": "G-04", "title": "로스트아크", "genre": "MMORPG", "thumbnail_url": "/images/games/game-04.png", "support_status": "direct", "badge_label": "원격PC방 바로접속", "benefit_summary": "PC방 토큰 및 접속 시간별 프리미엄 아바타/강화 재료", "is_featured": True, "display_order": 4},
    {"game_code": "G-05", "title": "스페셜포스", "genre": "스포츠/FPS", "thumbnail_url": "/images/games/game-05.jpg", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 총기 지급 및 추가 SP/경험치 보너스", "is_featured": True, "display_order": 5},
    {"game_code": "G-06", "title": "서든어택", "genre": "스포츠/FPS", "thumbnail_url": "/images/games/game-06.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 무기 프리셋 및 접속 시간 게이지 보상", "is_featured": True, "display_order": 6},
    {"game_code": "G-07", "title": "슬러거", "genre": "스포츠/FPS", "thumbnail_url": "/images/games/game-07.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 드래프트권 및 경기 보상 캣 추가 지급", "is_featured": True, "display_order": 7},
    {"game_code": "G-08", "title": "마비노기", "genre": "MMORPG", "thumbnail_url": "/images/games/game-08.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 인벤토리 및 전투 경험치 2배 혜택", "is_featured": True, "display_order": 8},
    {"game_code": "G-09", "title": "검은사막", "genre": "MMORPG", "thumbnail_url": "/images/games/game-09.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "가방/창고 확장, 아이템 획득 확률 증가 및 전용 장비", "is_featured": True, "display_order": 9},
    {"game_code": "G-10", "title": "디아블로 4", "genre": "액션/기타", "thumbnail_url": "/images/games/game-10.png", "support_status": "available", "badge_label": "배틀넷 프리미엄", "benefit_summary": "경험치·골드·은화 보너스 및 사망 시 장비 내구도 무료 수리", "is_featured": True, "display_order": 10},
    {"game_code": "G-11", "title": "오버워치 2", "genre": "스포츠/FPS", "thumbnail_url": "/images/games/game-11.png", "support_status": "available", "badge_label": "배틀넷 프리미엄", "benefit_summary": "전체 영웅 즉시 해금, 신화 프리즘 및 배틀패스 경험치 +20%", "is_featured": True, "display_order": 11},
    {"game_code": "G-12", "title": "바람의나라", "genre": "MMORPG", "thumbnail_url": "/images/games/game-12.jpg", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 사냥터 및 출석 누적 프리미엄 보상", "is_featured": True, "display_order": 12},
    # 확장 카탈로그 (G-13 ~ G-50)
    {"game_code": "G-13", "title": "리니지2", "genre": "MMORPG", "thumbnail_url": "/images/games/game-01.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 포인트 획득 및 전용 버프 지원", "is_featured": False, "display_order": 13},
    {"game_code": "G-14", "title": "아이온 (AION)", "genre": "MMORPG", "thumbnail_url": "/images/games/game-08.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 인던 추가 입장 및 주화 보상", "is_featured": False, "display_order": 14},
    {"game_code": "G-15", "title": "블레이드 앤 소울", "genre": "MMORPG", "thumbnail_url": "/images/games/game-09.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 소울 멤버십 포인트 적립", "is_featured": False, "display_order": 15},
    {"game_code": "G-16", "title": "쓰론 앤 리버티 (TL)", "genre": "MMORPG", "thumbnail_url": "/images/games/game-04.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "심연 포인트 및 계약의 증표 추가 충전 혜택", "is_featured": False, "display_order": 16},
    {"game_code": "G-17", "title": "거상", "genre": "MMORPG", "thumbnail_url": "/images/games/game-12.jpg", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 일일 퀘스트 및 추가 경험치", "is_featured": False, "display_order": 17},
    {"game_code": "G-18", "title": "뮤 온라인 (MU)", "genre": "MMORPG", "thumbnail_url": "/images/games/game-01.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "드랍률 상승 및 PC방 전용 버프 스크롤", "is_featured": False, "display_order": 18},
    {"game_code": "G-19", "title": "R2 (Reign of Revolution)", "genre": "MMORPG", "thumbnail_url": "/images/games/game-09.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 사냥터 및 변신 버프 제공", "is_featured": False, "display_order": 19},
    {"game_code": "G-20", "title": "열혈강호 온라인", "genre": "MMORPG", "thumbnail_url": "/images/games/game-12.jpg", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "기연 및 경험치 보너스 상시 적용", "is_featured": False, "display_order": 20},
    {"game_code": "G-21", "title": "마비노기 영웅전", "genre": "액션/기타", "thumbnail_url": "/images/games/game-08.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "피로도 무제한 지원 및 출정 횟수 추가", "is_featured": False, "display_order": 21},
    {"game_code": "G-22", "title": "테일즈위버", "genre": "MMORPG", "thumbnail_url": "/images/games/game-03.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "레어 드랍률 상승 및 PC방 전용 버프", "is_featured": False, "display_order": 22},
    {"game_code": "G-23", "title": "어둠의전설", "genre": "MMORPG", "thumbnail_url": "/images/games/game-12.jpg", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "획득 경험치 및 어빌리티 경험치 보너스", "is_featured": False, "display_order": 23},
    {"game_code": "G-24", "title": "일랜시아", "genre": "MMORPG", "thumbnail_url": "/images/games/game-12.jpg", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "성향치 유지 및 PC방 접속 혜택", "is_featured": False, "display_order": 24},
    {"game_code": "G-25", "title": "아스가르드", "genre": "MMORPG", "thumbnail_url": "/images/games/game-08.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "선악 경험치 및 지상계 경험치 증가", "is_featured": False, "display_order": 25},
    {"game_code": "G-26", "title": "크레이지아케이드", "genre": "액션/기타", "thumbnail_url": "/images/games/game-03.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 치장 아이템 및 루찌 보너스", "is_featured": False, "display_order": 26},
    {"game_code": "G-27", "title": "카트라이더 드리프트", "genre": "스포츠/FPS", "thumbnail_url": "/images/games/game-02.jpg", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 카트바디 및 루찌/숙련도 +50%", "is_featured": False, "display_order": 27},
    {"game_code": "G-28", "title": "버블파이터", "genre": "스포츠/FPS", "thumbnail_url": "/images/games/game-06.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "전용 무기 무제한 대여 및 루찌 보너스", "is_featured": False, "display_order": 28},
    {"game_code": "G-29", "title": "카운터스트라이크 온라인", "genre": "스포츠/FPS", "thumbnail_url": "/images/games/game-05.jpg", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "초월 무기 PC방 무료 사용 및 해독기 보상", "is_featured": False, "display_order": 29},
    {"game_code": "G-30", "title": "프리스타일 2", "genre": "스포츠/FPS", "thumbnail_url": "/images/games/game-07.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "전용 의상 슬롯 및 경기 포인트 추가 지급", "is_featured": False, "display_order": 30},
    {"game_code": "G-31", "title": "마구마구 리마스터", "genre": "스포츠/FPS", "thumbnail_url": "/images/games/game-07.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 선수팩 및 거니 추가 획득", "is_featured": False, "display_order": 31},
    {"game_code": "G-32", "title": "배틀그라운드 (PUBG)", "genre": "스포츠/FPS", "thumbnail_url": "/images/games/game-06.png", "support_status": "available", "badge_label": "카카오/스팀 PC방", "benefit_summary": "PC방 전용 상자 및 접속 시간 포인트 교환", "is_featured": False, "display_order": 32},
    {"game_code": "G-33", "title": "패스 오브 엑자일 (POE)", "genre": "액션/기타", "thumbnail_url": "/images/games/game-10.png", "support_status": "available", "badge_label": "카카오 PC방", "benefit_summary": "PC방 전용 보관함 탭 및 코스메틱 이펙트 지원", "is_featured": False, "display_order": 33},
    {"game_code": "G-34", "title": "이터널 리턴", "genre": "액션/기타", "thumbnail_url": "/images/games/game-11.png", "support_status": "available", "badge_label": "카카오 PC방", "benefit_summary": "전체 실험체 무료 오픈 및 스킨 사용 지원", "is_featured": False, "display_order": 34},
    {"game_code": "G-35", "title": "오딘: 발할라 라이징", "genre": "MMORPG", "thumbnail_url": "/images/games/game-04.png", "support_status": "available", "badge_label": "고사양 최적화", "benefit_summary": "24시간 무중단 방치 사냥 및 발열/배터리 소모 제로", "is_featured": False, "display_order": 35},
    {"game_code": "G-36", "title": "나이트 크로우", "genre": "MMORPG", "thumbnail_url": "/images/games/game-09.png", "support_status": "available", "badge_label": "고사양 최적화", "benefit_summary": "언리얼5 최고 옵션 장시간 원격 구동 지원", "is_featured": False, "display_order": 36},
    {"game_code": "G-37", "title": "아키에이지 워", "genre": "MMORPG", "thumbnail_url": "/images/games/game-01.png", "support_status": "available", "badge_label": "고사양 최적화", "benefit_summary": "다중 클라이언트 및 원격 모니터링 최적화", "is_featured": False, "display_order": 37},
    {"game_code": "G-38", "title": "프라시아 전기", "genre": "MMORPG", "thumbnail_url": "/images/games/game-04.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "넥슨 PC방 전용 버프 및 골드 획득량 증가", "is_featured": False, "display_order": 38},
    {"game_code": "G-39", "title": "히트2 (HIT2)", "genre": "MMORPG", "thumbnail_url": "/images/games/game-08.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "넥슨 프리미엄 PC방 전용 컬렉션 버프 적용", "is_featured": False, "display_order": 39},
    {"game_code": "G-40", "title": "V4", "genre": "MMORPG", "thumbnail_url": "/images/games/game-09.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 탈것/소환수 및 경험치 혜택", "is_featured": False, "display_order": 40},
    {"game_code": "G-41", "title": "디아블로 2: 레저렉션", "genre": "액션/기타", "thumbnail_url": "/images/games/game-10.png", "support_status": "available", "badge_label": "배틀넷 프리미엄", "benefit_summary": "배틀넷 PC방 혜택 및 고해상도 60FPS 스트리밍", "is_featured": False, "display_order": 41},
    {"game_code": "G-42", "title": "월드 오브 워크래프트 (WoW)", "genre": "MMORPG", "thumbnail_url": "/images/games/game-10.png", "support_status": "available", "badge_label": "배틀넷 프리미엄", "benefit_summary": "개인 정액권 없이도 PC방 시간으로 즉시 접속", "is_featured": False, "display_order": 42},
    {"game_code": "G-43", "title": "스타크래프트 리마스터", "genre": "액션/기타", "thumbnail_url": "/images/games/game-11.png", "support_status": "available", "badge_label": "배틀넷 프리미엄", "benefit_summary": "리마스터 스킨 및 PC방 래더 보너스 자동 활성화", "is_featured": False, "display_order": 43},
    {"game_code": "G-44", "title": "하스스톤", "genre": "액션/기타", "thumbnail_url": "/images/games/game-11.png", "support_status": "available", "badge_label": "배틀넷 프리미엄", "benefit_summary": "와글와글 하스스톤 및 PC방 경험치 부스트", "is_featured": False, "display_order": 44},
    {"game_code": "G-45", "title": "라그나로크 온라인", "genre": "MMORPG", "thumbnail_url": "/images/games/game-03.png", "support_status": "available", "badge_label": "골드 PC방", "benefit_summary": "그라비티 골드 PC방 버프 및 경험치/드랍률 상승", "is_featured": False, "display_order": 45},
    {"game_code": "G-46", "title": "씰온라인", "genre": "MMORPG", "thumbnail_url": "/images/games/game-08.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 좌판 및 사냥 경험치 추가 제공", "is_featured": False, "display_order": 46},
    {"game_code": "G-47", "title": "로한 오리진", "genre": "MMORPG", "thumbnail_url": "/images/games/game-01.png", "support_status": "available", "badge_label": "PC방 프리미엄", "benefit_summary": "PC방 전용 탈리스만 및 조합 확률 보너스", "is_featured": False, "display_order": 47},
    {"game_code": "G-48", "title": "던전앤파이터 (이용제한 안내)", "genre": "액션/기타", "thumbnail_url": "/images/games/game-03.png", "support_status": "restricted", "badge_label": "보안정책 이용불가", "benefit_summary": "게임사 원격 접속 제한 정책으로 인해 이용이 불가합니다", "is_featured": False, "display_order": 48},
    {"game_code": "G-49", "title": "리그 오브 레전드 (이용제한 안내)", "genre": "액션/기타", "thumbnail_url": "/images/games/game-11.png", "support_status": "restricted", "badge_label": "뱅가드 이용불가", "benefit_summary": "Riot Vanguard 커널 보안 정책상 원격 환경 이용이 불가합니다", "is_featured": False, "display_order": 49},
    {"game_code": "G-50", "title": "발로란트 (이용제한 안내)", "genre": "스포츠/FPS", "thumbnail_url": "/images/games/game-06.png", "support_status": "restricted", "badge_label": "뱅가드 이용불가", "benefit_summary": "Riot Vanguard 커널 보안 정책상 원격 환경 이용이 불가합니다", "is_featured": False, "display_order": 50},
]

# 5. 공지사항 및 필수 주의사항 3대 수칙 (#notice)
INITIAL_NOTICES: list[dict[str, Any]] = [
    {
        "category": "exit_rule",
        "badge_text": "필독 // 정상 종료 수칙",
        "title": "접속기 정상 종료 방법 (2단계 필수 확인)",
        "summary": "원격창(게임 화면)만 닫으면 원격지 PC가 계속 켜져 있어 충전 시간이 차감됩니다. 반드시 아래 2단계를 순서대로 진행해 주세요.",
        "steps_json": [
            {
                "step_no": "STEP 01",
                "title": "원격PC 종료 및 원격창 닫기",
                "description": "플레이하던 게임을 먼저 안전하게 종료한 뒤 열려 있는 원격 화면 창을 닫습니다.",
            },
            {
                "step_no": "STEP 02",
                "title": "접속기에서 로그아웃 버튼 누르기",
                "description": "원격플러그인 피시 접속기 우측의 [로그아웃 / 사용종료] 버튼을 반드시 클릭해야 시간 차감이 즉시 멈춥니다.",
            },
        ],
        "cta_label": None,
        "cta_url": None,
        "is_pinned": True,
        "display_order": 1,
    },
    {
        "category": "mandatory_time",
        "badge_text": "필독 // 계정 보호 정책",
        "title": "20분 의무 사용 안내 (계정 보호 수칙)",
        "summary": "게임사 비정상 접속 탐지 예방 및 고객님의 소중한 계정 보호를 위해 1회 접속 시 권장 20분 이상 사용(최소 10분 이상 필수 유지)을 권장합니다.",
        "steps_json": [
            {
                "step_no": "RULE 01",
                "title": "권장 20분 이상 / 최소 10분 필수 유지",
                "description": "접속 직후 1~2분 내 반복적인 재접속은 게임사 보안 로직에 의해 비정상 접속으로 오인될 수 있으므로 최소 10분~20분 이상 유지해 주세요.",
            },
            {
                "step_no": "RULE 02",
                "title": "실행 중인 로컬 게임 종료 후 접속",
                "description": "내 집 PC에서 이미 동일한 게임을 실행한 상태로 원격 접속기를 켜면 중복 접속 오류가 발생할 수 있으니 로컬 게임을 먼저 종료해 주세요.",
            },
        ],
        "cta_label": None,
        "cta_url": None,
        "is_pinned": True,
        "display_order": 2,
    },
    {
        "category": "remote_support",
        "badge_text": "지원 // 1:1 원격 케어",
        "title": "원격지원 프로그램 (AnyDesk) 설치 안내",
        "summary": "설치나 접속 과정에서 어려움이 있으실 경우 AnyDesk(애니데스크)를 실행한 뒤 표시되는 9~10자리 워크스테이션 번호를 고객센터로 알려주시면 즉시 원격으로 해결해 드립니다.",
        "steps_json": [
            {
                "step_no": "CARE 01",
                "title": "AnyDesk 공식 다운로드 및 실행",
                "description": "별도 복잡한 설치 없이 다운로드 후 즉시 실행하여 좌측 상단의 9~10자리 숫자를 확인합니다.",
            },
            {
                "step_no": "CARE 02",
                "title": "24시 고객센터(010-3470-8716 / 카카오톡) 전달",
                "description": "상담원에게 번호를 전달하시면 1분 내로 원격 연결하여 사운드·해상도·접속 설정을 최적화해 드립니다.",
            },
        ],
        "cta_label": "AnyDesk 다운로드 바로가기",
        "cta_url": "https://anydesk.com/ko/downloads",
        "is_pinned": True,
        "display_order": 3,
    },
]

# 6. 자주 묻는 질문 7선 (#faq)
INITIAL_FAQS: list[dict[str, Any]] = [
    {
        "category": "시작/설치",
        "question": "상담이나 예약 없이 지금 바로 이용할 수 있나요?",
        "answer": "네, 가능합니다. 원격플러그인 피시는 별도의 사전 예약이나 상담 대기 없이 홈페이지에서 접속기(unplug_setup.exe)를 설치한 후, 프로그램 내에서 회원가입 및 시간 충전을 완료하면 24시간 언제든 빈 좌석으로 즉시 연결됩니다.",
        "display_order": 1,
    },
    {
        "category": "서비스원리",
        "question": "원격PC방(지피방)은 어떤 원리로 작동하나요?",
        "answer": "전국 70여 개 정식 가맹 PC방에 실제로 설치된 고사양 PC를 초저지연 스트리밍 기술로 내 집 PC나 노트북 화면에 그대로 연결하는 방식입니다. 실제 매장 좌석을 점유하므로 게임사 PC방 프리미엄 혜택이 100% 동일하게 적용됩니다.",
        "display_order": 2,
    },
    {
        "category": "성능/최적화",
        "question": "집 컴퓨터나 사무용 노트북 사양이 낮아도 고사양 게임이 돌아가나요?",
        "answer": "네, 완벽하게 작동합니다. 모든 게임 연산과 그래픽 렌더링은 원격지의 고사양 PC방 컴퓨터에서 처리되며, 내 컴퓨터는 화면 출력과 키보드·마우스 입력만 전달하므로 저사양 사무용 노트북에서도 로스트아크, FC온라인, 디아블로4 등을 최고 옵션으로 즐길 수 있습니다.",
        "display_order": 3,
    },
    {
        "category": "요금/시간",
        "question": "이용 요금과 시간 차감 방식은 어떻게 되나요?",
        "answer": "기본 요금은 1만 원 충전 기준 600분(10시간, 시간당 1,000원 수준)이며 대량 충전 시 추가 보너스 시간이 지급됩니다. 약정이나 유효기간 부담 없이 원격 접속을 종료하고 로그아웃 버튼을 누른 시점까지 사용한 시간만 분 단위로 정확히 차감됩니다.",
        "display_order": 4,
    },
    {
        "category": "이용주의",
        "question": "게임을 껐는데도 시간이 계속 차감되는 것 같아요. 어떻게 종료하나요?",
        "answer": "원격 화면 창(X 버튼)만 닫으실 경우 매장 PC가 켜진 상태로 유지되어 시간이 차감됩니다. 반드시 1단계: 게임 및 원격PC 종료 후 원격창 닫기 -> 2단계: 접속기 프로그램에서 [로그아웃] 버튼을 클릭하셔야 정상적으로 사용이 종료됩니다.",
        "display_order": 5,
    },
    {
        "category": "지원게임",
        "question": "메이플스토리, 로스트아크 바로접속과 이용 제한 게임은 무엇인가요?",
        "answer": "리니지, FC온라인, 메이플스토리, 로스트아크, 서든어택, 검은사막, 디아블로4, 오버워치2 등 50여 종의 인기 게임을 바로 접속하실 수 있습니다. 단, 게임사 커널 보안 정책상 던전앤파이터, 리그 오브 레전드(롤), 발로란트는 원격 환경 이용이 불가합니다.",
        "display_order": 6,
    },
    {
        "category": "고객지원",
        "question": "접속 중 화면이 끊기거나 소리가 안 날 때는 어떻게 해결하나요?",
        "answer": "365일 24시간 운영되는 고객센터(010-3470-8716) 또는 카카오톡 채널(https://pf.kakao.com/_Ypsan)로 문의해 주시고, AnyDesk 원격지원 번호를 알려주시면 전담 엔지니어가 즉시 원격으로 접속하여 해결해 드립니다.",
        "display_order": 7,
    },
]
