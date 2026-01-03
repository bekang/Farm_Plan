import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CHOSEONG_MAP: { [key: string]: string } = {
  ㄱ: '가',
  ㄲ: '까',
  ㄴ: '나',
  ㄷ: '다',
  ㄸ: '따',
  ㄹ: '라',
  ㅁ: '마',
  ㅂ: '바',
  ㅃ: '빠',
  ㅅ: '사',
  ㅆ: '싸',
  ㅇ: '아',
  ㅈ: '자',
  ㅉ: '짜',
  ㅊ: '차',
  ㅋ: '카',
  ㅌ: '타',
  ㅍ: '파',
  ㅎ: '하',
};

const CHOSEONG_LIST = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

export function matchHangul(text: string, query: string): boolean {
  if (!query) return true;
  if (!text) return false;

  // 정규식 변환 (초성 검색 지원)
  const pattern = query
    .split('')
    .map((char) => {
      if (CHOSEONG_MAP[char]) {
        const begin = char.charCodeAt(0) - 12593;
        if (begin >= 0 && begin < CHOSEONG_LIST.length) {
          const base = 44032 + begin * 588;
          const end = base + 587;
          return `[${char}\\u${base.toString(16)}-\\u${end.toString(16)}]`;
        }
      }
      return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('');

  return new RegExp(pattern, 'i').test(text);
}
