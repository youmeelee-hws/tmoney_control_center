// 영문 문자열의 맨 앞글자만 대문자로 변환
export function capitalizeFirstLetter(str) {
  if (!str) return str // 빈 문자열, null, undefined 방어
  return str.charAt(0).toUpperCase() + str.slice(1)
}
