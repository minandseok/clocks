"use client";

import { useEffect, useMemo, useState } from "react";

type Stopwatch = {
  id: string;
  label: string;
  elapsedMs: number;
  runningSince: number | null;
};

const pad2 = (value: number) => value.toString().padStart(2, "0");

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  return `${pad2(minutes)}:${pad2(seconds)}.${pad2(centiseconds)}`;
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sw-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createStopwatch = (index: number): Stopwatch => ({
  id: createId(),
  label: `Stopwatch ${index}`,
  elapsedMs: 0,
  runningSince: null,
});

export default function Home() {
  const [stopwatches, setStopwatches] = useState<Stopwatch[]>(() => [
    createStopwatch(1),
  ]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const totalElapsedMs = useMemo(() => {
    return stopwatches.reduce((total, stopwatch) => {
      const runningDelta =
        stopwatch.runningSince === null ? 0 : now - stopwatch.runningSince;
      return total + stopwatch.elapsedMs + runningDelta;
    }, 0);
  }, [now, stopwatches]);

  const addStopwatch = () => {
    setStopwatches((prev) => [
      ...prev,
      createStopwatch(prev.length + 1),
    ]);
  };

  const toggleRunning = (id: string) => {
    const timestamp = Date.now();
    setStopwatches((prev) =>
      prev.map((stopwatch) => {
        if (stopwatch.id !== id) {
          return stopwatch;
        }

        if (stopwatch.runningSince === null) {
          return { ...stopwatch, runningSince: timestamp };
        }

        const nextElapsed =
          stopwatch.elapsedMs + (timestamp - stopwatch.runningSince);
        return { ...stopwatch, elapsedMs: nextElapsed, runningSince: null };
      })
    );
  };

  const resetStopwatch = (id: string) => {
    setStopwatches((prev) =>
      prev.map((stopwatch) =>
        stopwatch.id === id
          ? { ...stopwatch, elapsedMs: 0, runningSince: null }
          : stopwatch
      )
    );
  };

  const removeStopwatch = (id: string) => {
    setStopwatches((prev) => prev.filter((stopwatch) => stopwatch.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Multi Stopwatch
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                스톱워치 합산 대시보드
              </h1>
              <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                스톱워치를 추가하고, 모든 시간을 합산해 확인하세요.
              </p>
            </div>
            <button
              type="button"
              onClick={addStopwatch}
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              + 스톱워치 추가
            </button>
          </div>
        </header>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              총 누적 시간
            </span>
            <span className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              {formatTime(totalElapsedMs)}
            </span>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {stopwatches.length === 0 ? (
            <article className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
              모든 스톱워치가 제거되었습니다. 상단의 버튼으로 새로 추가하세요.
            </article>
          ) : (
            stopwatches.map((stopwatch, index) => {
              const runningDelta =
                stopwatch.runningSince === null
                  ? 0
                  : now - stopwatch.runningSince;
              const displayMs = stopwatch.elapsedMs + runningDelta;
              const isRunning = stopwatch.runningSince !== null;

              return (
                <article
                  key={stopwatch.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {stopwatch.label}
                      </h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        #{pad2(index + 1)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isRunning
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        {isRunning ? "RUNNING" : "PAUSED"}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeStopwatch(stopwatch.id)}
                        className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-500 transition hover:border-red-200 hover:text-red-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-red-500/50 dark:hover:text-red-300"
                      >
                        제거
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 text-3xl font-semibold tracking-tight">
                    {formatTime(displayMs)}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRunning(stopwatch.id)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isRunning
                          ? "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                          : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                      }`}
                    >
                      {isRunning ? "일시정지" : "시작"}
                    </button>
                    <button
                      type="button"
                      onClick={() => resetStopwatch(stopwatch.id)}
                      className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
                    >
                      초기화
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}
