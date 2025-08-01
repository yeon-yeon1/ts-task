import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { inventoryData } from "../data/inventoryData";

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 24px;
`;

const LoadingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recognizedText = location.state?.recognizedText || "";

  useEffect(() => {
    if (!recognizedText) {
      navigate("/inventory", { state: { keywords: [] } });
      return;
    }

    function extractKeywordsFromText(text: string) {
      const productNames = inventoryData.map((item) => item.name);

      const foundKeywords: { product: string; price: string }[] = [];

      productNames.forEach((product) => {
        const regex = new RegExp(
          `${product}\\s*(을|를|은|는|이|가)?[^\\d일이삼사오육칠팔구십백천만억]{0,5}\\s*(([일이삼사오육칠팔구십백천만억]+\\s*)?(\\d{1,8}))\\s*(원|천원|만원|억원)?`,
          "g"
        );
        const matches = [...text.matchAll(regex)];

        matches.forEach((match) => {
          const rawPrice = match[2];
          const numericPrice = convertKoreanNumberToArabic(rawPrice);
          if (numericPrice > 0) {
            foundKeywords.push({ product, price: numericPrice.toString() });
          }
        });
      });

      return foundKeywords;
    }

    const keywords = extractKeywordsFromText(recognizedText);
    console.log("🔍 추출된 키워드:", keywords);
    navigate("/inventory", { state: { keywords } });
  }, [recognizedText, navigate]);

  function convertKoreanNumberToArabic(korean: string): number {
    korean = korean.replace(/\s+/g, "");

    // Handle mixed format like '만3333' or '만 3333'
    const mixedMatch = korean.match(/^([일이삼사오육칠팔구십백천만억]+)(\d{3,})$/);
    if (mixedMatch) {
      const unitPart = convertKoreanNumberToArabic(mixedMatch[1]);
      const digitPart = parseInt(mixedMatch[2], 10);
      return unitPart + digitPart;
    }

    if (/^\d+$/.test(korean)) {
      return parseInt(korean, 10);
    }

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

    let total = 0,
      current = 0,
      temp = 0;

    for (let i = 0; i < korean.length; i++) {
      const char = korean[i];
      if (numberMap[char] !== undefined) {
        temp = numberMap[char];
      } else if (unitMap[char] !== undefined) {
        if (unitMap[char] >= 10000) {
          total += (current + (temp || 1)) * unitMap[char];
          current = 0;
        } else {
          current += (temp || 1) * unitMap[char];
        }
        temp = 0;
      }
    }

    return total + current + temp;
  }

  return <LoadingContainer>분석 중입니다...</LoadingContainer>;
};

export default LoadingPage;
