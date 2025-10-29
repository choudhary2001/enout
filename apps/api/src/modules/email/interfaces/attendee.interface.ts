export interface TaskStatus {
  completed: boolean;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface AttendeeWithEvent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tasksJson: Record<string, TaskStatus>;
  event: {
    id: string;
    name: string;
    startDate: Date;
    location: string;
  };
}
