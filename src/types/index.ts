export type TaskStatus = 'To-Do' | 'In-Progress' | 'Done';

export interface Task {
  id: string;
  task: string;
  shipmentId: string;
  deadline: string; // YYYY-MM-DD
  dependencies: string[];
  assignee: string;
  status: TaskStatus;
  priority?: number;
  explanation?: string;
}
