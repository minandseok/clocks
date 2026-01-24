import type { Stopwatch } from "../types/stopwatch";

const pad2 = (value: number) => value.toString().padStart(2, "0");

export const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}.${pad2(
    centiseconds
  )}`;
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sw-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const createStopwatch = (index: number): Stopwatch => ({
  id: createId(),
  label: `${index}`,
  elapsedMs: 0,
  runningSince: null,
});

export const getDisplayMs = (stopwatch: Stopwatch, referenceTime: number) => {
  if (stopwatch.runningSince === null) {
    return stopwatch.elapsedMs;
  }
  return stopwatch.elapsedMs + (referenceTime - stopwatch.runningSince);
};

export const isStopwatchRunning = (stopwatch: Stopwatch) =>
  stopwatch.runningSince !== null;
