import { useEffect, useState } from "react";

export function useVideoPlayer({ durations }: { durations: Record<string, number> }) {
  const [currentScene, setCurrentScene] = useState(0);
  useEffect(() => { const recordingWindow = window as unknown as Window & { startRecording?: () => void }; recordingWindow.startRecording?.(); }, []);
  useEffect(() => { const sceneKeys = Object.keys(durations); const currentDuration = durations[sceneKeys[currentScene]]; const timer = setTimeout(() => { if (currentScene < sceneKeys.length - 1) setCurrentScene((previous) => previous + 1); else { const recordingWindow = window as Window & { stopRecording?: () => void; _hasStopped?: boolean }; if (typeof window !== "undefined" && recordingWindow.stopRecording && !recordingWindow._hasStopped) { recordingWindow.stopRecording(); recordingWindow._hasStopped = true; } setCurrentScene(0); } }, currentDuration); return () => clearTimeout(timer); }, [currentScene, durations]);
  return { currentScene };
}
