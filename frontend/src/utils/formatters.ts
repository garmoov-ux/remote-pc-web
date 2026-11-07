/**
 * 전화번호, 시간, 해시 문자열, 날짜 포맷팅을 담당하는 유틸리티 모듈입니다.
 */

/**
 * 전화번호를 하이픈 표준 포맷으로 정리하고 tel: 링크용 문자열을 반환합니다.
 */
export function toTelHref(phone: string): string {
  const digits = phone.replace(/[^0-9+]/g, "");
  return `tel:${digits}`;
}

/**
 * 전화번호에 문자(SMS) 발송 링크를 생성합니다.
 */
export function toSmsHref(phone: string): string {
  const digits = phone.replace(/[^0-9+]/g, "");
  return `sms:${digits}`;
}

/**
 * 긴 SHA-256 해시 문자열을 앞 10자리와 뒤 8자리로 축약하여 표시합니다.
 */
export function shortenSha256(hash: string): string {
  if (!hash || hash.length <= 22) {
    return hash;
  }
  return `${hash.slice(0, 12)}...${hash.slice(-8)}`;
}

/**
 * ISO 날짜 문자열을 한국어 일시 표기로 변환합니다.
 */
export function formatKoreanDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return isoString;
    }
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return isoString;
  }
}
