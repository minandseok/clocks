"use client";

type TotalElapsedCardProps = {
  displayTime: string;
};

export function TotalElapsedCard({ displayTime }: TotalElapsedCardProps) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-2">
        <span className="text-4xl font-semibold tracking-tight text-zinc-900 tabular-nums dark:text-white">
          {displayTime}
        </span>
      </div>
    </section>
  );
}
