"use client";

import { useEffect, useMemo, useState } from "react";

import { AddStopwatchSlot } from "@/app/components/AddStopwatchSlot";
import { StopwatchCard } from "@/app/components/StopwatchCard";
import { TotalElapsedCard } from "@/app/components/TotalElapsedCard";
import type { Stopwatch } from "@/app/types/stopwatch";
import {
  createStopwatch,
  formatTime,
  getDisplayMs,
  isStopwatchRunning,
} from "@/app/utils/stopwatch";

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
      return total + getDisplayMs(stopwatch, now);
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

  const updateStopwatchLabel = (id: string, label: string) => {
    setStopwatches((prev) =>
      prev.map((stopwatch) =>
        stopwatch.id === id ? { ...stopwatch, label } : stopwatch
      )
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <TotalElapsedCard displayTime={formatTime(totalElapsedMs)} />

        <section className="grid gap-4 md:grid-cols-2">
          {stopwatches.map((stopwatch) => {
            const displayMs = getDisplayMs(stopwatch, now);
            const isRunning = isStopwatchRunning(stopwatch);
            const hasStarted = displayMs > 0 || isRunning;

            return (
              <StopwatchCard
                key={stopwatch.id}
                stopwatch={stopwatch}
                displayTime={formatTime(displayMs)}
                isRunning={isRunning}
                hasStarted={hasStarted}
                onLabelChange={updateStopwatchLabel}
                onRemove={removeStopwatch}
                onToggleRunning={toggleRunning}
                onReset={resetStopwatch}
              />
            );
          })}
          <AddStopwatchSlot onAdd={addStopwatch} />
        </section>
      </main>
    </div>
  );
}
