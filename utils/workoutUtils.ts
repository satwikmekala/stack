import { WorkoutType, UserProfile, WorkoutSession, ExerciseSession, Set, ProgressionSuggestion } from '@/types';
import { exerciseDatabase, getExerciseById } from '@/data/exercises';

export const generateSplit = (daysPerWeek: number): WorkoutType[] => {
  switch (daysPerWeek) {
    case 2:
    case 3:
      return ['push', 'pull', 'legs'];
    case 4:
      return ['push', 'pull', 'legs', 'arms'];
    case 5:
      return ['push', 'pull', 'legs', 'arms', 'upper'];
    case 6:
      return ['push', 'pull', 'legs', 'arms', 'upper', 'lower'];
    default:
      return ['push', 'pull', 'legs'];
  }
};

export const getWorkoutDisplayName = (workoutType: WorkoutType): string => {
  const names: Record<WorkoutType, string> = {
    push: 'Push Day',
    pull: 'Pull Day',
    legs: 'Legs & Abs',
    arms: 'Arms Day',
    upper: 'Upper Body',
    lower: 'Lower Body & Abs'
  };
  return names[workoutType];
};

export const getMuscleGroups = (workoutType: WorkoutType): string => {
  const groups: Record<WorkoutType, string> = {
    push: 'Chest, Shoulders, Triceps',
    pull: 'Back, Biceps, Rear Delts',
    legs: 'Quads, Hamstrings, Glutes, Abs',
    arms: 'Biceps, Triceps, Forearms',
    upper: 'Chest, Back, Shoulders',
    lower: 'Glutes, Hamstrings, Calves, Core'
  };
  return groups[workoutType];
};

export const getEstimatedDuration = (workoutType: WorkoutType): string => {
  const exercises = exerciseDatabase[workoutType];
  const minutes = exercises.length * 8; // Roughly 8 minutes per exercise
  return `${minutes - 10}-${minutes + 10} min`;
};

export const createWorkoutSession = (workoutType: WorkoutType): WorkoutSession => {
  const exercises = exerciseDatabase[workoutType];
  const exerciseSessions: ExerciseSession[] = exercises.map(exercise => ({
    exerciseId: exercise.id,
    sets: []
  }));

  return {
    id: `workout_${Date.now()}`,
    date: new Date().toISOString(),
    workoutType,
    exercises: exerciseSessions,
    duration: 0,
    completed: false
  };
};

export const calculateProgression = (
  lastSession: Set[],
  exercise: any
): ProgressionSuggestion => {
  if (!lastSession.length) {
    // First time doing this exercise, suggest starting weight
    return { weight: 20, reps: exercise.repRange[0] };
  }

  const lastSet = lastSession[lastSession.length - 1];
  const { weight, reps } = lastSet;
  const { repRange } = exercise;

  // If user hit upper rep range on last set, suggest weight increase
  if (reps >= repRange[1]) {
    return { weight: weight + 2.5, reps: repRange[0] };
  }

  // If user is in middle range, suggest rep increase
  if (reps >= repRange[0] && reps < repRange[1]) {
    return { weight: weight, reps: Math.min(reps + 1, repRange[1]) };
  }

  // If user couldn't hit lower range, suggest weight decrease
  if (reps < repRange[0]) {
    return { weight: Math.max(weight - 2.5, 0), reps: repRange[0] };
  }

  return { weight, reps };
};

export const getLastWorkoutData = (
  workoutHistory: WorkoutSession[],
  exerciseId: string
): Set[] => {
  // Find most recent workout that included this exercise
  for (let i = workoutHistory.length - 1; i >= 0; i--) {
    const workout = workoutHistory[i];
    const exerciseSession = workout.exercises.find(ex => ex.exerciseId === exerciseId);
    if (exerciseSession && exerciseSession.sets.length > 0) {
      return exerciseSession.sets.filter(set => set.completed);
    }
  }
  return [];
};

export const formatWeight = (weight: number): string => {
  return weight % 1 === 0 ? weight.toString() : weight.toFixed(1);
};

export const getNextWorkout = (
  userSplit: WorkoutType[],
  workoutHistory: WorkoutSession[]
): WorkoutType => {
  if (!workoutHistory.length) {
    return userSplit[0];
  }

  const lastWorkout = workoutHistory[workoutHistory.length - 1];
  const lastWorkoutIndex = userSplit.indexOf(lastWorkout.workoutType);
  
  // Get next workout in rotation
  const nextIndex = (lastWorkoutIndex + 1) % userSplit.length;
  return userSplit[nextIndex];
};