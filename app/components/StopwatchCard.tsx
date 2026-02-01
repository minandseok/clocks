"use client";

import type { DragEvent } from "react";

import type { Stopwatch } from "../types/stopwatch";

type StopwatchCardProps = {
  stopwatch: Stopwatch;
  displayTime: string;
  isRunning: boolean;
  hasStarted: boolean;
  isDragging: boolean;
  onLabelChange: (id: string, label: string) => void;
  onRemove: (id: string) => void;
  onToggleRunning: (id: string) => void;
  onReset: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: (id: string) => void;
};

export function StopwatchCard({
  stopwatch,
  displayTime,
  isRunning,
  hasStarted,
  isDragging,
  onLabelChange,
  onRemove,
  onToggleRunning,
  onReset,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: StopwatchCardProps) {
  return (
    <article
      draggable
      onDragStart={() => onDragStart(stopwatch.id)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={() => onDrop(stopwatch.id)}
      className={`group cursor-grab rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:ring-2 hover:ring-zinc-300 active:cursor-grabbing dark:border-zinc-800 dark:bg-zinc-950 dark:hover:ring-zinc-700 ${
        isDragging ? "opacity-60 ring-2 ring-zinc-400" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <input
            value={stopwatch.label}
            onChange={(event) =>
              onLabelChange(stopwatch.id, event.target.value)
            }
            aria-label="스톱워치 라벨"
            className="w-full bg-transparent text-lg font-semibold text-zinc-900 outline-none transition dark:text-zinc-50"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
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
            onClick={() => onRemove(stopwatch.id)}
            className="whitespace-nowrap rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-500 transition hover:border-red-200 hover:text-red-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-red-500/50 dark:hover:text-red-300"
          >
            제거
          </button>
        </div>
      </div>

      <div className="mt-6 text-3xl font-semibold tracking-tight tabular-nums">
        {displayTime}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onToggleRunning(stopwatch.id)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            isRunning
              ? "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          }`}
        >
          {isRunning ? "일시정지" : "시작"}
        </button>
        {hasStarted ? (
          <button
            type="button"
            onClick={() => onReset(stopwatch.id)}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
          >
            초기화
          </button>
        ) : null}
      </div>
    </article>
  );
}
