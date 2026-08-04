type PriorityStatistics = {
  low: number;
  medium: number;
  high: number;
  critical: number;
};

export type DashboardData = {
  projects?: {
    total: number;
    active: number;
    completed: number;
    byPriority: PriorityStatistics;
  };

  tasks?: {
    total: number;
    todo: number;
    inProgress: number;
    inReview: number;
    done: number;
    overdue: number;
    byPriority: PriorityStatistics;
  };

  users?: {
    total: number;
    admins: number;
    managers: number;
    workers: number;
    active: number;
  };
};
