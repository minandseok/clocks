export type Stopwatch = {
  id: string;
  label: string;
  elapsedMs: number;
  runningSince: number | null;
};
