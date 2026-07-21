'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CreateStudyLogRequest } from '@/types/study-log';
import NavigationBar from '../components/NavigationBar';
import StarCanvas from '../components/StarCanvas';

const MODES = ['timer', 'stopwatch', 'pomodoro'] as const;
type TimerMode = (typeof MODES)[number];

const MODE_LABELS: Record<TimerMode, string> = {
  timer: 'タイマー',
  stopwatch: 'ストップウォッチ',
  pomodoro: 'ポモドーロ',
};

const WORK_DURATION_SECONDS = 25 * 60;
const BREAK_DURATION_SECONDS = 5 * 60;
const MAX_INPUT_MINUTES = 999;

function toBoundedInteger(value: string, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(Math.max(Math.trunc(parsed), 0), max);
}

function formatTime(totalSeconds: number, showHours: boolean) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (showHours) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${Math.floor(totalSeconds / 60).toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

export default function StudyPage() {
  const [mode, setMode] = useState<TimerMode>('stopwatch');
  const [time, setTime] = useState(0);
  const [measuredSeconds, setMeasuredSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [subject, setSubject] = useState('');
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);
  const [sessionEndedAt, setSessionEndedAt] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const timeRef = useRef(0);
  const measuredSecondsRef = useRef(0);
  const clientSessionIdRef = useRef<string | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const configuredTimerDuration = inputMinutes * 60 + inputSeconds;

  const updateTime = useCallback((seconds: number) => {
    timeRef.current = seconds;
    setTime(seconds);
  }, []);

  const updateMeasuredSeconds = useCallback((seconds: number) => {
    measuredSecondsRef.current = seconds;
    setMeasuredSeconds(seconds);
  }, []);

  const playAlarm = useCallback(() => {
    const alarm = alarmRef.current;
    if (!alarm) return;

    alarm.currentTime = 0;
    void alarm.play().catch((error: unknown) => {
      console.warn('アラーム音を再生できませんでした:', error);
    });
  }, []);

  useEffect(() => {
    const alarm = new Audio('/_sounds/alarm.mp3');
    alarm.preload = 'auto';
    alarmRef.current = alarm;

    return () => {
      alarm.pause();
      alarmRef.current = null;
    };
  }, []);

  useEffect(() => {
    setIsRunning(false);
    setIsBreak(false);
    updateMeasuredSeconds(0);
    setSessionStartedAt(null);
    setSessionEndedAt(null);
    clientSessionIdRef.current = null;
    setSaveStatus('idle');

    if (mode === 'timer') {
      updateTime(configuredTimerDuration);
    } else if (mode === 'pomodoro') {
      updateTime(WORK_DURATION_SECONDS);
    } else {
      updateTime(0);
    }
  }, [configuredTimerDuration, mode, updateMeasuredSeconds, updateTime]);

  useEffect(() => {
    if (!isRunning) return;

    const initialTime = timeRef.current;
    const initialMeasuredSeconds = measuredSecondsRef.current;
    const runStartedAt = performance.now();
    let completed = false;

    const tick = () => {
      const elapsedSeconds = Math.floor((performance.now() - runStartedAt) / 1000);
      if (mode !== 'pomodoro' || !isBreak) {
        updateMeasuredSeconds(initialMeasuredSeconds + elapsedSeconds);
      }

      if (mode === 'stopwatch') {
        updateTime(initialTime + elapsedSeconds);
        return;
      }

      const remainingSeconds = Math.max(initialTime - elapsedSeconds, 0);
      updateTime(remainingSeconds);

      if (remainingSeconds > 0 || completed) return;
      completed = true;
      playAlarm();

      if (mode === 'timer') {
        updateMeasuredSeconds(initialMeasuredSeconds + initialTime);
        setSessionEndedAt(new Date().toISOString());
        setIsRunning(false);
        return;
      }

      const nextIsBreak = !isBreak;
      setIsBreak(nextIsBreak);
      updateTime(nextIsBreak ? BREAK_DURATION_SECONDS : WORK_DURATION_SECONDS);
    };

    tick();
    const intervalId = window.setInterval(tick, 250);
    return () => window.clearInterval(intervalId);
  }, [isBreak, isRunning, mode, playAlarm, updateMeasuredSeconds, updateTime]);

  const handleStart = () => {
    if (isRunning) return;

    if (mode === 'timer' && timeRef.current === 0) {
      if (configuredTimerDuration === 0) return;
      updateTime(configuredTimerDuration);
      updateMeasuredSeconds(0);
      setSessionStartedAt(new Date().toISOString());
      clientSessionIdRef.current = crypto.randomUUID();
    } else if (!sessionStartedAt) {
      setSessionStartedAt(new Date().toISOString());
      clientSessionIdRef.current = crypto.randomUUID();
    }

    setSessionEndedAt(null);
    setSaveStatus('idle');
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setSessionEndedAt(new Date().toISOString());
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    updateMeasuredSeconds(0);
    setSessionStartedAt(null);
    setSessionEndedAt(null);
    clientSessionIdRef.current = null;
    setSaveStatus('idle');

    if (mode === 'timer') {
      updateTime(configuredTimerDuration);
    } else if (mode === 'pomodoro') {
      updateTime(WORK_DURATION_SECONDS);
    } else {
      updateTime(0);
    }
  };

  const handleSave = async () => {
    const normalizedSubject = subject.trim();
    if (!normalizedSubject || measuredSeconds <= 0 || isRunning || !sessionStartedAt) return;
    const clientSessionId = clientSessionIdRef.current ?? crypto.randomUUID();
    clientSessionIdRef.current = clientSessionId;

    const payload: CreateStudyLogRequest = {
      clientSessionId,
      subject: normalizedSubject,
      durationSeconds: measuredSeconds,
      startedAt: sessionStartedAt,
      endedAt: sessionEndedAt ?? new Date().toISOString(),
    };

    setSaveStatus('saving');
    try {
      const response = await fetch('/api/study-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`学習記録の保存に失敗しました (${response.status})`);
      }

      setIsRunning(false);
      setIsBreak(false);
      updateMeasuredSeconds(0);
      setSessionStartedAt(null);
      setSessionEndedAt(null);
      clientSessionIdRef.current = null;
      if (mode === 'timer') {
        updateTime(configuredTimerDuration);
      } else if (mode === 'pomodoro') {
        updateTime(WORK_DURATION_SECONDS);
      } else {
        updateTime(0);
      }
      setSaveStatus('success');
    } catch (error) {
      console.error('Failed to save study log:', error);
      setSaveStatus('error');
    }
  };

  const startDisabled = isRunning || (mode === 'timer' && time === 0 && configuredTimerDuration === 0);
  const saveDisabled =
    isRunning ||
    measuredSeconds <= 0 ||
    subject.trim().length === 0 ||
    saveStatus === 'saving' ||
    saveStatus === 'success';

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 text-white pt-20 p-10 flex flex-col items-center">
      <NavigationBar />
      <StarCanvas />

      <h1 className="text-3xl font-bold text-center tracking-wide mt-8 mb-4">学習時間記録</h1>
      <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6 gap-5 w-full max-w-md flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-3">
          {MODES.map((timerMode) => (
            <button
              key={timerMode}
              type="button"
              disabled={isRunning}
              onClick={() => setMode(timerMode)}
              className={`px-4 py-2 rounded disabled:cursor-not-allowed disabled:opacity-50 ${
                mode === timerMode ? 'bg-indigo-950 text-white' : 'bg-gray-200'
              }`}
            >
              {MODE_LABELS[timerMode]}
            </button>
          ))}
        </div>

        {mode === 'timer' && (
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="timer-minutes">分</label>
            <input
              id="timer-minutes"
              type="number"
              min="0"
              max={MAX_INPUT_MINUTES}
              disabled={isRunning}
              value={inputMinutes}
              onChange={(event) => setInputMinutes(toBoundedInteger(event.target.value, MAX_INPUT_MINUTES))}
              className="w-24 rounded border px-2 py-1 text-center disabled:bg-gray-100"
            />
            <span aria-hidden="true">分</span>
            <label className="sr-only" htmlFor="timer-seconds">秒</label>
            <input
              id="timer-seconds"
              type="number"
              min="0"
              max="59"
              disabled={isRunning}
              value={inputSeconds}
              onChange={(event) => setInputSeconds(toBoundedInteger(event.target.value, 59))}
              className="w-20 rounded border px-2 py-1 text-center disabled:bg-gray-100"
            />
            <span aria-hidden="true">秒</span>
          </div>
        )}

        {mode === 'pomodoro' && (
          <div className="text-lg font-semibold">{isBreak ? '休憩中' : '作業中'}</div>
        )}

        <div className="font-mono text-5xl" role="timer" aria-live="off">
          {formatTime(time, mode !== 'pomodoro')}
        </div>

        <p className="text-sm text-gray-500">今回の計測時間: {formatTime(measuredSeconds, true)}</p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={startDisabled}
            onClick={handleStart}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRunning ? '実行中' : measuredSeconds > 0 ? '再開' : 'スタート'}
          </button>
          <button
            type="button"
            disabled={!isRunning}
            onClick={handleStop}
            className="rounded bg-red-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            ストップ
          </button>
          <button type="button" onClick={handleReset} className="rounded bg-gray-500 px-4 py-2 text-white">
            リセット
          </button>
        </div>

        <div className="w-full border-t pt-4">
          <label className="mb-1 block text-sm font-semibold" htmlFor="study-subject">学習科目</label>
          <input
            id="study-subject"
            type="text"
            maxLength={100}
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              if (saveStatus === 'error') setSaveStatus('idle');
            }}
            placeholder="例: Next.js"
            className="mb-3 w-full rounded border px-3 py-2"
          />
          <button
            type="button"
            disabled={saveDisabled}
            onClick={() => void handleSave()}
            className="w-full rounded bg-green-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saveStatus === 'saving' ? '保存中...' : '記録を保存'}
          </button>
          {saveStatus === 'success' && <p className="mt-2 text-sm text-green-700">学習記録を保存しました。</p>}
          {saveStatus === 'error' && (
            <p className="mt-2 text-sm text-red-600" role="alert">保存に失敗しました。時間をおいて再試行してください。</p>
          )}
        </div>
      </div>
    </main>
  );
}
