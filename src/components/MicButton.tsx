// components/MicButton.tsx
import React from "react";
import styled from "styled-components";
import { recordAudio } from "../utils/startRecording";
// import { sendToClova } from "../utils/sendToClova";

const MicButtonWrapper = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 14px 28px;
  font-size: 16px;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

type Props = {
  onRecognize: (keywords: string[]) => void;
  isListening: boolean;
  setIsListening: React.Dispatch<React.SetStateAction<boolean>>;
};

const MicButton: React.FC<Props> = ({ onRecognize, isListening, setIsListening }) => {
  const handleClick = async () => {
    try {
      console.log("🎤 음성 인식 시작");
      setIsListening(true); // 인식 시작

      const audio = await recordAudio();
      console.log("🎧 녹음 완료, 파일 준비됨:", audio);

      const formData = new FormData();
      formData.append("audio", audio);

      console.log("📡 서버로 전송 중...");
      const response = await fetch("http://localhost:3001/api/stt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`STT API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log("📝 음성 인식 결과 수신:", data);

      const { recognizedText, extracted } = data;
      console.log("📝 음성 인식 결과:", recognizedText);
      console.log("🔍 추출된 키워드:", extracted);

      onRecognize(extracted ? [extracted] : []);
    } catch (err) {
      alert("음성 인식 중 오류 발생");
      console.error("❌ 에러 발생:", err);
    } finally {
      setIsListening(false); // 인식 종료
      console.log("🛑 음성 인식 종료");
    }
  };

  return <MicButtonWrapper onClick={handleClick}>{isListening ? "🎙️ 인식 중..." : "🎤 인식 시작"}</MicButtonWrapper>;
};

export default MicButton;
