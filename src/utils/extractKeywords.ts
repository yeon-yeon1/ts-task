export interface Keyword {
  product: string;
  price: string;
}

export function extractKeywords(text: string): Keyword[] {
  const productList = ["상추", "계란", "딸기", "고구마", "우유", "삼겹살"];
  const priceRegex = /(\d{3,5}|[일이삼사오육칠팔구십백천만억]+)\s*(원|천원|만원)/g;

  const result: Keyword[] = [];

  for (const product of productList) {
    const index = text.indexOf(product);
    if (index !== -1) {
      // 제품 이후부터 가격 검색
      const sliced = text.slice(index);
      const priceMatch = priceRegex.exec(sliced);
      if (priceMatch) {
        const rawPrice = priceMatch[1]; // 예: "6000" 또는 "사천"
        const price = convertKoreanNumberToArabic(rawPrice);
        result.push({ product, price: price.toString() });
      }
    }
  }

  return result;
}

// 💡 한글 숫자 → 숫자 변환 함수 (개선된 버전)
function convertKoreanNumberToArabic(korean: string): number {
  const numberMap: Record<string, number> = {
    일: 1,
    이: 2,
    삼: 3,
    사: 4,
    오: 5,
    육: 6,
    칠: 7,
    팔: 8,
    구: 9,
    영: 0,
  };

  const unitMap: Record<string, number> = {
    십: 10,
    백: 100,
    천: 1000,
    만: 10000,
    억: 100000000,
  };

  let total = 0;
  let current = 0;
  let temp = 0;

  for (const char of korean) {
    if (numberMap[char] !== undefined) {
      temp = numberMap[char];
    } else if (unitMap[char] !== undefined) {
      if (unitMap[char] >= 10000) {
        total += (current + temp) * unitMap[char];
        current = 0;
      } else {
        current += (temp || 1) * unitMap[char];
      }
      temp = 0;
    }
  }

  return total + current + temp;
}
