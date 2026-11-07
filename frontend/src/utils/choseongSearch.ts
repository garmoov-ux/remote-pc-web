/**
 * 한글 초성 추출 및 초성·부분 문자열 통합 검색 유틸리티 모듈입니다.
 * 예: "ㄹㄴㅈ" -> "리니지", "ㄹㅇ" -> "로스트아크", "ㅁㅇㅍ" -> "메이플스토리", "ㅍㅍ" -> "FC 온라인 (피파온라인4)"
 */

const CHOSEONG_LIST = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
] as const;

const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;
const CHOSEONG_INTERVAL = 588;

/**
 * 주어진 문자열에서 한글 음절을 초성 문자열로 변환합니다.
 * 한글 음절이 아닌 영문·숫자·기호는 소문자로 그대로 유지합니다.
 */
export function extractChoseong(text: string): string {
  let result = "";
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    if (code >= HANGUL_BASE && code <= HANGUL_END) {
      const choseongIndex = Math.floor((code - HANGUL_BASE) / CHOSEONG_INTERVAL);
      result += CHOSEONG_LIST[choseongIndex] ?? text[i];
    } else {
      result += text[i].toLowerCase();
    }
  }
  return result;
}

/**
 * 대상 문자열(target)이 검색어(query)를 일반 부분 문자열 또는 한글 초성으로 포함하는지 판별합니다.
 */
export function matchesKoreanSearch(target: string, query: string): boolean {
  const cleanQuery = query.trim().toLowerCase().replace(/\s+/g, "");
  if (!cleanQuery) {
    return true;
  }
  const cleanTarget = target.toLowerCase().replace(/\s+/g, "");
  if (cleanTarget.includes(cleanQuery)) {
    return true;
  }
  const targetChoseong = extractChoseong(cleanTarget);
  return targetChoseong.includes(cleanQuery);
}
