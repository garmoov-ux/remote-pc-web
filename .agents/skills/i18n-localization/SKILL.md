---
name: i18n-localization
description: >-
  Chrome extension internationalization, multi-language dictionary, and error code masking.
---

# i18n Localization Skill

## 1. 다국어 사전 일관성
- ko, n, ja, zh 등 지원하는 모든 로케일 파일에 동일한 키 구조가 유지되어야 합니다.
- 번역 누락 시 기본 언어(ko 또는 en)로 안전하게 폴백되도록 설계합니다.

## 2. 에러 코드 마스킹
- 브라우저 영문 에러는 ERR_* 코드로 매핑하여 UI에 친절한 지역화 문자열로 노출합니다.
