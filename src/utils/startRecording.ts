// utils/startRecording.ts
//기록 시간 바꿀 수 있음 현재 10초
export async function recordAudio(duration = 10000): Promise<Blob> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];

  return new Promise((resolve) => {
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/wav" });
      resolve(audioBlob);
    };

    recorder.start();
    setTimeout(() => {
      recorder.stop();
      stream.getTracks().forEach((t) => t.stop());
    }, duration);
  });
}
