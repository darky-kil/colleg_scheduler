export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface ClassSession {
  id: string;
  subject: string;
  startTime: string; // "HH:MM" 24h format
  endTime: string;   // "HH:MM" 24h format
  type: 'Lecture' | 'Lab';
}

export interface ScheduleDay {
  day: DayOfWeek;
  sessions: ClassSession[];
}

export interface BreakBlock {
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'Study' | 'Assignment' | 'Personal';
  createdAt: number;
}