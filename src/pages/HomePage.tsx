import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { recordAudio } from "../utils/startRecording";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 40px;
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = React.useState(false);

  const handleRecord = async () => {
    setIsListening(true);
    try {
      const audioBlob = await recordAudio();
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const response = await fetch("http://localhost:3001/api/stt", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("📦 서버 응답 데이터:", data);
      const recognizedText = data.recognizedText || "";
      console.log("📝 인식된 문장:", recognizedText);

      navigate("/loading", { state: { recognizedText } });
    } catch (err) {
      console.error("❌ 음성 인식 실패:", err);
      navigate("/loading", { state: { recognizedText: "" } });
    } finally {
      setIsListening(false);
    }
  };

  return (
    <Container>
      <Title>{isListening ? "🎙️ 음성 인식 중입니다..." : "오늘 특가 음성을 들려주세요"}</Title>
      <button onClick={handleRecord} disabled={isListening}>
        {isListening ? "녹음 중..." : "녹음 시작"}
      </button>
    </Container>
  );
};

export default HomePage;
