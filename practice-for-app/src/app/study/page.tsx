"use client";

import { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import StarCanvas from "../components/StarCanvas"; 
import BackToTopButton from "../components/BackTop"; 

export default function StudyPage() {
  // タイマーのモードを管理（3種類：タイマー、ストップウォッチ、ポモドーロ）
  const [mode, setMode] = useState<"timer" | "stopwatch" | "pomodoro">("stopwatch");

  // 表示される時間（秒単位）
  const [time, setTime] = useState(0);

  // タイマーが動作中かどうか
  const [isRunning, setIsRunning] = useState(false);

  // タイマー用の分・秒入力（ユーザーが設定）
  const [inputMinutes, setInputMinutes] = useState(30);
  const [inputSeconds, setInputSeconds] = useState(0);

  // ポモドーロ用：作業中か休憩中かを管理
  const [isBreak, setIsBreak] = useState(false);

  // ポモドーロの作業時間と休憩時間（秒単位）
  const WORK_DURATION = 25 * 60;
  const BREAK_DURATION = 5 * 60;

  // タイマーの動作処理（1秒ごとに時間を更新）
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          // ストップウォッチ：時間を加算
          if (mode === "stopwatch") return prev + 1;

          // タイマー：時間を減算（0以下にならない）
          if (mode === "timer") return Math.max(prev - 1, 0);

          // ポモドーロ：時間を減算し、0になったら作業⇔休憩を切り替え
          if (mode === "pomodoro") {
            if (prev <= 1) {
              const nextIsBreak = !isBreak;
              setIsBreak(nextIsBreak);
              return nextIsBreak ? BREAK_DURATION : WORK_DURATION;
            }
            return prev - 1;
          }

          return prev;
        });
      }, 1000); // 1秒ごとに更新
    }

    // コンポーネントのアンマウント時にインターバルをクリア
    return () => clearInterval(interval);
  }, [isRunning, mode, isBreak]);

  // スタートボタンの処理
  const handleStart = () => {
    if (mode === "timer") {
      // タイマー：入力された分・秒を秒に変換してセット
      setTime(inputMinutes * 60 + inputSeconds);
    } else if (mode === "pomodoro") {
      // ポモドーロ：作業モードからスタート
      setIsBreak(false);
      setTime(WORK_DURATION);
    }
    setIsRunning(true);
  };

  // ストップボタンの処理：動作停止
  const handleStop = () => setIsRunning(false);

  // リセットボタンの処理：初期状態に戻す
  const handleReset = () => {
    setIsRunning(false);
    if (mode === "timer") {
      setTime(inputMinutes * 60 + inputSeconds);
    } else if (mode === "pomodoro") {
      setIsBreak(false);
      setTime(WORK_DURATION);
    } else {
      setTime(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 text-white pt-20 p-10 flex flex-col items-center">
      {/* ナビゲーションバーと星空背景 */}
      <NavigationBar />
      <StarCanvas />

      {/* タイマーUI本体 */}
      <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 gap-4 w-full max-w-md flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">学習時間記録</h2>

        {/* モード切り替えボタン（タイマー／ストップウォッチ／ポモドーロ） */}
        <div className="flex gap-4 mb-20">
          {["timer", "stopwatch", "pomodoro"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              className={`px-4 py-2 rounded ${
                mode === m ? "bg-indigo-950 text-white" : "bg-gray-200"
              }`}
            >
              {m === "timer" ? "タイマー" : m === "stopwatch" ? "ストップウォッチ" : "ポモドーロ"}
            </button>
          ))}
        </div>

        {/* タイマー用の時間入力欄（分・秒） */}
        {mode === "timer" && (
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              min="0"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded text-center"
              placeholder="分"
            />
            <span className="text-xl">:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={inputSeconds}
              onChange={(e) => setInputSeconds(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded text-center"
              placeholder="秒"
            />
          </div>
        )}

        {/* ポモドーロモードの状態表示（作業中／休憩中） */}
        {mode === "pomodoro" && (
          <div className="mb-4 text-lg font-semibold">
            {isBreak ? "休憩中 " : "作業中 "}
          </div>
        )}

        {/* 時間表示（mm:ss形式） */}
        <div className="text-5xl font-mono mb-40">
          {Math.floor(time / 60).toString().padStart(2, "0")}:
          {(time % 60).toString().padStart(2, "0")}
        </div>

        {/* 操作ボタン群（スタート／ストップ／リセット） */}
        <div className="flex gap-2">
          <button onClick={handleStart} className="px-4 py-2 bg-blue-600 text-white rounded">
            スタート
          </button>
          <button onClick={handleStop} className="px-4 py-2 bg-red-400 text-white rounded">
            ストップ
          </button>
          <button onClick={handleReset} className="px-4 py-2 bg-gray-400 text-white rounded">
            リセット
          </button>
        </div>
      </div>

      {/* ページトップに戻るボタン */}
      <div className="w-full flex justify-start">
        <BackToTopButton />
      </div>
    </div>
  );
}