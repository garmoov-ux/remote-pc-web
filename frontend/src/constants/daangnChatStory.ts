/**
 * 당근마켓(RTX 5070 Ti) 채팅 상대방인 "당근양파"님을 위해 구성된
 * 버튼별("접속기 설치", "카카오톡", "우측하단 연락처") 맞춤형 AI 시대 핵심 브리핑 데이터 모듈입니다.
 */

export type ActionModalCategory =
  | "client_download"
  | "kakao_consult"
  | "phone_contact";

export interface DaangnStorySection {
  stepCode: string;
  title: string;
  body: string;
}

export interface DaangnModalScenario {
  category: ActionModalCategory;
  tabLabel: string;
  badgeText: string;
  headline: string;
  subHeadline: string;
  chatContextSummary: string;
  sections: DaangnStorySection[];
  techNoteTitle: string;
  techNoteBody: string;
  closingQuote: string;
}

export const DAANGN_MODAL_SCENARIOS: Record<
  ActionModalCategory,
  DaangnModalScenario
> = {
  client_download: {
    category: "client_download",
    tabLabel: "접속기 설치 · 기술 데모",
    badgeText: "FOR. 당근양파님 // CLIENT ARCHITECTURE & 30-MIN AI BUILD",
    headline:
      "당근양파님, 채팅 나누며 30분 만에 구현한 원격PC방 풀스택 데모입니다",
    subHeadline:
      "손코딩으로 6개월 걸리던 시스템을 AI 에이전트로 단시간에 구축하는 시대가 왔습니다. 비전공자도 지금 바로 시작하셔야 합니다.",
    chatContextSummary:
      "[당근 채팅 요약] 조택 RTX 5070 Ti 구매 문의로 시작해 당근양파님께서 공유해주신 원격PC방(지피방) 링크를 보고, 'AI를 다루면 똑같은 시스템도 30분 안에 설계·구현할 수 있다'는 것을 직접 보여드리기 위해 실시간으로 제작했습니다.",
    sections: [
      {
        stepCode: "TECH // 01",
        title: "테스트 데모 안내: 실제 접속기 코어는 구현 완료 (배포만 패스)",
        body: "원격PC방의 핵심은 오픈소스 초저지연 스트리밍(Sunshine · Moonlight 프로토콜) 기반 접속기 클라이언트입니다. 실제 접속기 제어 및 좌석 매칭 엔진 구현은 이미 완료되어 있으나, 본 사이트는 당근양파님께 AI 개발 속도를 보여드리기 위한 시연용 테스트이므로 실제 .exe 설치 파일 배포만 패스 처리했습니다.",
      },
      {
        stepCode: "BIZ // 02",
        title: "PC방 가맹 제휴 계약이 결합되어야 완성되는 비즈니스 구조",
        body: "기술적으로는 집의 고사양 PC나 매장 PC에 스트리밍 호스트 서버를 세팅하면 고물 노트북에서도 즉시 고사양 게임이 돌아갑니다. 다만 실제 상용 원격PC방 사업은 전국 PC방 매장들과 정식 제휴 계약을 맺고 좌석마다 에이전트를 설치하는 오프라인 제휴·영업이 함께 이루어져야 가동됩니다.",
      },
      {
        stepCode: "AI ERA // 03",
        title: "인공지능 시대, 왜 지금 무조건 배워야 하는가",
        body: "예전에는 개발자 팀이 반년 동안 매달려야 했던 웹서비스·업무자동화·구독 결제 시스템을 이제는 AI를 지휘해 며칠, 몇 시간 만에 만들어낼 수 있습니다. 지금 시작하느냐 1년 뒤에 시작하느냐의 격차는 상상을 초월합니다.",
      },
    ],
    techNoteTitle: "시스템 구현 상태 요약 (Full-Stack Ready)",
    techNoteBody:
      "Next.js 15 프론트엔드 + FastAPI 비동기 백엔드 + 50종 게임 초성 검색 + 관리자 CMS(/admin) + 엑셀 통계 출력까지 100% 실제 작동하도록 구현되어 있습니다.",
    closingQuote:
      "컴퓨터와 AI는 자주 다뤄볼수록 하나씩 늘게 되어 있습니다. 방향만 잡으면 당근양파님도 충분히 만드실 수 있습니다.",
  },

  kakao_consult: {
    category: "kakao_consult",
    tabLabel: "카카오톡 · AI 자동화 부업",
    badgeText: "FOR. 당근양파님 // AI AGENT & AUTOMATION SIDE-HUSTLE",
    headline:
      "단순 유료 강의에 머물지 마시고, 내 밑에 'AI 직원 20명'을 두는 기술을 배우세요",
    subHeadline:
      "쿠팡파트너스·쇼츠·블로그 자동화를 넘어, 내가 없는 시간에도 스스로 일하는 AI 에이전트 파이프라인을 구축할 수 있습니다.",
    chatContextSummary:
      "[당근 채팅 요약] 집에서 AI를 활용해 월 300만 원 수준의 부업을 꿈꾸며 책도 구매하시고, 배우자분께서도 ChatGPT 유료 버전과 영상 자동화 프로그램을 활용 중이시라는 이야기를 나누었습니다.",
    sections: [
      {
        stepCode: "INSIGHT // 01",
        title: "시중 기초 강의의 한계와 진짜 자동화의 차이",
        body: "시중의 많은 유료 강의나 전자책은 누구나 할 수 있다는 마케팅으로 기초만 훑는 경우가 많습니다. 남들이 다 쓰는 똑같은 템플릿 영상만 올리기보다, 고객이 진짜 필요로 하는 프로그램이나 서비스·마케팅이 결합된 자동화 구조를 직접 다룰 줄 알아야 수익으로 이어집니다.",
      },
      {
        stepCode: "AGENT // 02",
        title: "오픈클로(OpenClaw) · 헤르메스 등 AI 직원 군단 활용하기",
        body: "이제는 챗봇과 대화만 하는 단계를 넘어 법무·개발·마케팅·리서치·편집을 담당하는 AI 직원 10~20명을 내 컴퓨터와 서버에 세팅해 두는 시대입니다. 규칙만 정해주면 당근 알림 분석부터 영상 편집·업로드·보고서 정리까지 24시간 자동으로 돌아갑니다.",
      },
      {
        stepCode: "PROTO // 03",
        title: "접속기 테스트 패스 및 실서비스 제휴 안내",
        body: "클릭하신 카카오톡 실시간 상담 버튼 역시 실제 고객 전환용 퍼널로 구현된 기능입니다. 본 프로젝트는 시연 목적이라 접속기 배포는 패스했으며, 실제 PC방 제휴만 연결하면 즉시 상용 서비스가 가능한 수준으로 제작되었습니다.",
      },
    ],
    techNoteTitle: "부업 월 300만 원 이상을 향한 현실적 로드맵",
    techNoteBody:
      "처음부터 비싼 요금제를 쓸 필요 없이, 무료 오픈소스와 기본 AI 도구로 6개월~1년간 여러 자동화 프로그램을 직접 만들어보며 감을 익히시는 것을 강력히 추천합니다.",
    closingQuote:
      "배우자분과 호흡이 좋으시니, 당근양파님께서 AI 자동화 기술 방향만 잡으시면 직장인 월급 이상의 기회를 충분히 잡으실 수 있습니다.",
  },

  phone_contact: {
    category: "phone_contact",
    tabLabel: "우측하단 연락처 · 현장과 AI",
    badgeText: "FOR. 당근양파님 // 12-YEAR FIELD ENGINEER MEETS AI",
    headline:
      "12년차 설비보전 과장님의 '고장 원인 해결 루프'는 AI 개발과 100% 똑같습니다",
    subHeadline:
      "두 돌 첫째 아이와 내년 초 태어날 쌍둥이를 위해, 현장 기술자의 문제 해결력에 AI라는 강력한 무기를 더해보세요.",
    chatContextSummary:
      "[당근 채팅 요약] 92년생 부산 출신으로 제주에서 15년부터 12년째 제품검사·설비보전 과장으로 근무하시며, 두 돌 첫째와 내년 초 쌍둥이 출산을 앞둔 책임감 강한 가장이신 당근양파님과의 대화를 담았습니다.",
    sections: [
      {
        stepCode: "MINDSET // 01",
        title: "'찾아보고 -> 시도하고 -> 안 되면 다시 찾아 해결한다'의 힘",
        body: "공장 설비가 고장 났을 때 증상을 보고 원인을 찾아 고치는 과정이나, IT·인공지능으로 프로그램을 만드는 과정이나 본질은 완전히 같습니다. 이미 현장에서 12년간 체득하신 '스터디 -> 실행 반복' 습관이 있으시기에 AI 기술도 누구보다 빠르게 흡수하실 수 있습니다.",
      },
      {
        stepCode: "FUTURE // 02",
        title: "현장직이 가장 마지막에 대체되지만, AI를 먼저 배우면 상위 5%가 됩니다",
        body: "노래·영상·디자인·코딩·번역까지 AI가 빠르게 대체하고 있습니다. 현장은 가장 마지막까지 남겠지만, 현장 도메인 지식을 가진 분이 보고서 자동화·설비 데이터 관리·웹서비스 구축까지 다룰 줄 알면 30대에 쌓은 기술이 40대 연봉과 사업의 든든한 밑바탕이 됩니다.",
      },
      {
        stepCode: "DEMO // 03",
        title: "테스트 데모(접속기 패스 · 제휴 필요) 및 오프라인 티타임 안내",
        body: "우측 하단 연락처·원격지원 버튼은 실제 24시 고객센터 구성을 시연한 것입니다(핵심 접속기는 구현 완료 후 테스트라 패스, 상용화는 PC방 제휴 계약 필요). 야간근무 후 쉬시는 날 연동이나 오라오거리 스타벅스에서 차 한잔 나누며 언제든 공부 방향을 잡아드리겠습니다.",
      },
    ],
    techNoteTitle: "당근양파님을 위한 응원 메시지",
    techNoteBody:
      "아이들이 자라는 동안 포기하지 않고 하루 1~2시간씩만 AI와 자동화를 익히셔도, 몇 년 뒤 '그때 시작하길 정말 잘했다'고 느끼실 것입니다.",
    closingQuote:
      "화려한 자격증보다 중요한 것은 실제 문제를 해결하는 기술과 AI의 융합입니다. 언제든 편하게 연락 주세요!",
  },
};
