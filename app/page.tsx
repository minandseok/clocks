"use client";

import type { DragEvent } from "react";
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

const STORAGE_KEY = "clocks.stopwatches";

const createDefaultStopwatches = () => [createStopwatch(1)];

const isValidStopwatch = (value: unknown): value is Stopwatch => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Stopwatch;
  const hasValidId = typeof candidate.id === "string";
  const hasValidLabel = typeof candidate.label === "string";
  const hasValidElapsedMs = typeof candidate.elapsedMs === "number";
  const hasValidRunningSince =
    candidate.runningSince === null ||
    typeof candidate.runningSince === "number";

  return (
    hasValidId && hasValidLabel && hasValidElapsedMs && hasValidRunningSince
  );
};

const loadStopwatches = () => {
  if (typeof window === "undefined") {
    return createDefaultStopwatches();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultStopwatches();
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return createDefaultStopwatches();
    }
    if (parsed.every(isValidStopwatch)) {
      return parsed;
    }
    const validStopwatches = parsed.filter(isValidStopwatch);
    return validStopwatches.length > 0
      ? validStopwatches
      : createDefaultStopwatches();
  } catch {
    return createDefaultStopwatches();
  }
};

export default function Home() {
  const [stopwatches, setStopwatches] = useState<Stopwatch[]>(() =>
    loadStopwatches()
  );
  const [now, setNow] = useState(() => Date.now());
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stopwatches));
  }, [stopwatches]);

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

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    setStopwatches((prev) => {
      if (!draggingId || draggingId === targetId) {
        return prev;
      }

      const fromIndex = prev.findIndex((item) => item.id === draggingId);
      const toIndex = prev.findIndex((item) => item.id === targetId);

      if (fromIndex === -1 || toIndex === -1) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
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
                isDragging={draggingId === stopwatch.id}
                onLabelChange={updateStopwatchLabel}
                onRemove={removeStopwatch}
                onToggleRunning={toggleRunning}
                onReset={resetStopwatch}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            );
          })}
          <AddStopwatchSlot onAdd={addStopwatch} />
        </section>
      </main>
    </div>
  );
}
