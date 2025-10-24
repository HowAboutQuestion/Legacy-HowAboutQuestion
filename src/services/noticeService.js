/**
 * @fileoverview 
 * 현재 문제어때의 버전을 가져오는 서비스
 * - LocalStorage에 버전 별 키를 만들어 공지사항 확인 여부를 판단
 * 
 * * @module noticeService
*/

// 문제어때 현재 버전 가져오기
export async function getAppVersion() {
  if (!window.electronAPI || typeof window.electronAPI.getAppVersion !== 'function') {
    throw new Error('electronAPI.getAppVersion is not available (check preload expose & restart app)');
  }
  return await window.electronAPI.getAppVersion();
}

/**
 * 현재 버전을 로컬 스토리이지 키 네이밍으로 지정
 * @param  version 추출한 현재 버전
 * @returns notice_seen_현재 버전
 */
export function storageKey(version) {
    return `notice_seen_${version}`;
}

/**
 * 공지사항 봤는지 안봤는지 체크
 * @param version 추출한 현재 버전
 * @returns 공지사항 봤는지 안봤는지 여부
 */
export function hasSeen(version) {
    return localStorage.getItem(storageKey(version)) === "true";
}

/**
 * 공지사항을 읽으면 true 처리
 * @param version 추출한 현재 버전
 * @returns 로컬 스토리지에 저정된 현재 버전 공지사항 읽음처리(true)
 */
export function markSeen(version) {
    localStorage.setItem(storageKey(version), "true");
}
