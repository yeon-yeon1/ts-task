import express from "express";
import fs from "fs";
import cors from "cors";
import axios from "axios";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3001;

// 미들웨어
app.use(cors());
app.use(express.json());

// 업로드 폴더 설정
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 🎿 음성 인식 요청 처리 + 키워드 추출
app.post("/api/stt", upload.single("audio"), async (req, res) => {
  const audioPath = req.file.path;

  try {
    const audioBuffer = fs.readFileSync(audioPath);

    const response = await axios.post("https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor", audioBuffer, {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.CSR_API_KEY_ID,
        "X-NCP-APIGW-API-KEY": process.env.CSR_API_KEY,
        "Content-Type": "application/octet-stream",
      },
    });

    fs.unlinkSync(audioPath); // 파일 삭제

    const recognizedText = response.data.text;

    res.json({
      recognizedText,
    });
  } catch (error) {
    console.log("🔑 KEY_ID:", process.env.CSR_API_KEY_ID);
    console.log("🔑 KEY:", process.env.CSR_API_KEY);
    console.error("STT 오류:", error.message);
    res.status(500).json({ error: "STT 요청 실패" });
  }
});

// ✉️ Chatbot용 API (uc9c0금은 비활성화 가능)
app.post("/api/chat", async (req, res) => {
  const userText = req.body.text;

  try {
    const response = await axios.post(
      `https://clovachatbot.naverncp.com/openapi/v1/domain/${process.env.CLOVA_CHATBOT_DOMAIN_ID}/chat`,
      {
        userId: "test-user-001",
        userInput: userText,
        result: {
          systemText: true,
          scenario: true,
        },
      },
      {
        headers: {
          "X-NCP-APIGW-API-KEY-ID": process.env.CLOVA_CHATBOT_CLIENT_ID,
          "X-NCP-APIGW-API-KEY": process.env.CLOVA_CHATBOT_CLIENT_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ response: response.data });
  } catch (err) {
    console.error("CLOVA 오류:", err.response?.data || err.message);
    res.status(500).json({ error: "CLOVA 요청 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
});
