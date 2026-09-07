export type CurrentFocus = {
  title: string;
  durationMinutes: number;
};

export type Task = {
  title: string;
  durationMinutes: number;
};

export type TimeBlock = {
  startTime: string;
  endTime: string;
  title: string;
};

export type PlanningWarning = {
  message: string;
};

export type DailyPlan = {
  currentFocus: CurrentFocus;
  priorities: Task[];
  timeline: TimeBlock[];
  warnings: PlanningWarning[];
};
