"use client";

type AddStopwatchSlotProps = {
  onAdd: () => void;
};

export function AddStopwatchSlot({ onAdd }: AddStopwatchSlotProps) {
  return (
    <article className="group flex min-h-[200px] items-center justify-center">
      <button
        type="button"
        onClick={onAdd}
        aria-label="스톱워치 추가"
        className="inline-flex h-14 w-14 items-center justify-center text-2xl font-semibold text-zinc-500 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 dark:text-zinc-300"
      >
        +
      </button>
    </article>
  );
}
