export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  createdAt: Date;
  activities: string[]; // IDs das atividades relacionadas
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  goalId: string;
  frequency: number[]; // Dias da semana (0-6, domingo-sábado)
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
}

export interface ReflectionSession {
  id: string;
  date: Date;
  questions: ReflectionQuestion[];
  answers: ReflectionAnswer[];
  completed: boolean;
}

export interface ReflectionQuestion {
  id: string;
  question: string;
  type: 'text' | 'rating' | 'multiple_choice';
  options?: string[];
}

export interface ReflectionAnswer {
  questionId: string;
  answer: string | number;
}
