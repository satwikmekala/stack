export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  repRange: [number, number];
  notes?: string;
  equipment: string;
}

export interface Set {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface ExerciseSession {
  exerciseId: string;
  sets: Set[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  workoutType: WorkoutType;
  exercises: ExerciseSession[];
  duration: number;
  completed: boolean;
}

export interface UserProfile {
  name: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  intensity: 'easy' | 'moderate' | 'hard';
  goal: 'muscle' | 'strength' | 'fitness';
  startDate: string;
  currentSplit: WorkoutType[];
  hasCompletedOnboarding: boolean;
}

export type WorkoutType = 'push' | 'pull' | 'legs' | 'arms' | 'upper' | 'lower';

export interface ProgressionSuggestion {
  weight: number;
  reps: number;
}