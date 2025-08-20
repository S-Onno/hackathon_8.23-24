"use client";

import { useState, useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import StarCanvas from "../components/StarCanvas";
import BackToTopButton from "../components/BackTop";

export default function StudyPage() {
  // タイマー or ストップウォッチのモードを管理
  const [mode, setMode] = useState<"timer" | "stopwatch">("stopwatch");

  // 表示される時間（秒単位）
  const [time, setTime] = useState(0);

  // タイマーが動いているかどうか
  const [isRunning, setIsRunning] = useState(false);

  // ユーザーが入力する分・秒（タイマー用）
  const [inputMinutes, setInputMinutes] = useState(30);
  const [inputSeconds, setInputSeconds] = useState(0);

  // タイマー／ストップウォッチの動作処理
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) =>
          mode === "stopwatch" ? prev + 1 : Math.max(prev - 1, 0)
        );
      }, 1000); // 1秒ごとに更新
    }
    return () => clearInterval(interval); // コンポーネントのアンマウント時にクリア
  }, [isRunning, mode]);

  // スタートボタン：タイマーなら入力値から時間を設定
  const handleStart = () => {
    if (mode === "timer") {
      setTime(inputMinutes * 60 + inputSeconds);
    }
    setIsRunning(true);
  };

  // ストップボタン：動作停止
  const handleStop = () => setIsRunning(false);

  // リセットボタン：初期状態に戻す
  const handleReset = () => {
    setIsRunning(false);
    setTime(mode === "timer" ? inputMinutes * 60 + inputSeconds : 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 text-white pt-20 p-10 flex flex-col items-center">
      {/* ナビゲーションバーと星背景 */}
      <NavigationBar />
      <StarCanvas />

      {/* メインのタイマーUI */}
      <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 gap-4 w-full max-w-md flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">学習時間記録</h2>

        {/* モード切り替えボタン */}
        <div className="flex gap-4 mb-20">
          <button
            onClick={() => setMode("timer")}
            className={`px-4 py-2 rounded ${
              mode === "timer" ? "bg-indigo-950 text-white" : "bg-gray-200"
            }`}
          >
            タイマー
          </button>
          <button
            onClick={() => setMode("stopwatch")}
            className={`px-4 py-2 rounded ${
              mode === "stopwatch" ? "bg-indigo-950 text-white" : "bg-gray-200"
            }`}
          >
            ストップウォッチ
          </button>
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

        {/* 時間表示（mm:ss形式） */}
        <div className="text-5xl font-mono mb-40">
          {Math.floor(time / 60).toString().padStart(2, "0")}:
          {(time % 60).toString().padStart(2, "0")}
        </div>

        {/* 操作ボタン群 */}
        <div className="flex gap-2">
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            スタート
          </button>
          <button
            onClick={handleStop}
            className="px-4 py-2 bg-red-400 text-white rounded"
          >
            ストップ
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            リセット
          </button>
        </div>
      </div>

      {/* ページトップに戻るボタン */}
      <div className="mb-8 w-full flex justify-start">
        <BackToTopButton />
      </div>
    </div>
  );
}