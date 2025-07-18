import { Exercise, WorkoutType } from '@/types';

export const exerciseDatabase: Record<WorkoutType, Exercise[]> = {
  push: [
    {
      id: 'flat_bench_press',
      name: 'Flat Bench Press',
      muscleGroup: 'Chest',
      repRange: [8, 15],
      notes: 'Focus on controlled movement',
      equipment: 'Barbell'
    },
    {
      id: 'incline_dumbbell_press',
      name: 'Incline Dumbbell Press',
      muscleGroup: 'Chest',
      repRange: [8, 15],
      notes: 'Upper chest focus',
      equipment: 'Dumbbells'
    },
    {
      id: 'chest_machine_flyes',
      name: 'Chest Machine Flyes',
      muscleGroup: 'Chest',
      repRange: [8, 15],
      notes: 'Stretch at bottom',
      equipment: 'Machine'
    },
    {
      id: 'dumbbell_shoulder_press',
      name: 'Dumbbell Shoulder Press',
      muscleGroup: 'Shoulders',
      repRange: [8, 15],
      notes: 'Control the negative',
      equipment: 'Dumbbells'
    },
    {
      id: 'dumbbell_lateral_raises',
      name: 'Dumbbell Lateral Raises',
      muscleGroup: 'Shoulders',
      repRange: [12, 20],
      notes: 'Light weight, focus on form',
      equipment: 'Dumbbells'
    },
    {
      id: 'single_arm_tricep_extension',
      name: 'Single Arm Tricep Extension',
      muscleGroup: 'Triceps',
      repRange: [8, 15],
      notes: 'Keep elbow stable',
      equipment: 'Dumbbell'
    },
    {
      id: 'skull_crushers',
      name: 'Skull Crushers',
      muscleGroup: 'Triceps',
      repRange: [8, 12],
      notes: 'Lower to forehead',
      equipment: 'EZ Bar'
    }
  ],
  pull: [
    {
      id: 'lat_pulldown',
      name: 'Shoulder Grip Lat Pulldown',
      muscleGroup: 'Lats',
      repRange: [8, 15],
      notes: 'Shoulder-width grip',
      equipment: 'Cable machine'
    },
    {
      id: 'machine_rowing',
      name: 'Machine Rowing',
      muscleGroup: 'Back',
      repRange: [8, 15],
      notes: 'Squeeze shoulder blades',
      equipment: 'Machine'
    },
    {
      id: 'single_arm_dumbbell_rows',
      name: 'Single Arm Dumbbell Rows',
      muscleGroup: 'Back',
      repRange: [12, 12],
      notes: 'Support with bench',
      equipment: 'Dumbbell'
    },
    {
      id: 'reverse_pec_dec',
      name: 'Reverse Pec Dec',
      muscleGroup: 'Rear Delts',
      repRange: [8, 15],
      notes: 'Light weight, focus on rear delts',
      equipment: 'Machine'
    },
    {
      id: 'face_pulls',
      name: 'Face Pulls',
      muscleGroup: 'Rear Delts',
      repRange: [8, 15],
      notes: 'Pull to face level',
      equipment: 'Cable'
    },
    {
      id: 'supinated_bicep_curls',
      name: 'Supinated Alternating Bicep Curls',
      muscleGroup: 'Biceps',
      repRange: [8, 15],
      notes: 'Rotate as you curl',
      equipment: 'Dumbbells'
    },
    {
      id: 'bicep_preacher_curl',
      name: 'Bicep Preacher Curl',
      muscleGroup: 'Biceps',
      repRange: [8, 12],
      notes: 'Control the negative',
      equipment: 'Preacher bench'
    }
  ],
  legs: [
    {
      id: 'squats',
      name: 'Squats',
      muscleGroup: 'Legs',
      repRange: [10, 15],
      notes: 'Depth below parallel',
      equipment: 'Barbell'
    },
    {
      id: 'machine_leg_extensions',
      name: 'Machine Leg Extensions',
      muscleGroup: 'Quadriceps',
      repRange: [12, 20],
      notes: 'Squeeze at top',
      equipment: 'Machine'
    },
    {
      id: 'machine_hamstring_curls',
      name: 'Machine Hamstring Curls',
      muscleGroup: 'Hamstrings',
      repRange: [10, 15],
      notes: 'Full range of motion',
      equipment: 'Machine'
    },
    {
      id: 'leg_press',
      name: 'Leg Press',
      muscleGroup: 'Legs',
      repRange: [10, 20],
      notes: 'Control the weight',
      equipment: 'Machine'
    },
    {
      id: 'weighted_cable_crunches',
      name: 'Weighted Cable Crunches',
      muscleGroup: 'Abs',
      repRange: [10, 15],
      notes: 'Crunch down',
      equipment: 'Cable'
    },
    {
      id: 'leg_raises',
      name: 'Leg Raises',
      muscleGroup: 'Abs',
      repRange: [8, 12],
      notes: 'Control the movement',
      equipment: 'None'
    }
  ],
  arms: [
    {
      id: 'ez_bar_bicep_curls',
      name: 'EZ Bar Bicep Curls',
      muscleGroup: 'Biceps',
      repRange: [8, 12],
      notes: 'Go heavy',
      equipment: 'EZ Bar'
    },
    {
      id: 'incline_dumbbell_curls',
      name: 'Incline Dumbbell Curls',
      muscleGroup: 'Biceps',
      repRange: [10, 15],
      notes: 'Focus on reps',
      equipment: 'Dumbbells'
    },
    {
      id: 'tricep_pushdowns',
      name: 'Tricep Pushdowns',
      muscleGroup: 'Triceps',
      repRange: [8, 15],
      notes: 'Keep elbows at sides',
      equipment: 'Cable'
    },
    {
      id: 'overhead_cable_tricep_extensions',
      name: 'Overhead Cable Tricep Extensions',
      muscleGroup: 'Triceps',
      repRange: [8, 15],
      notes: 'Keep elbows up',
      equipment: 'Cable'
    },
    {
      id: 'wrist_curls',
      name: 'Wrist Curls',
      muscleGroup: 'Forearms',
      repRange: [15, 30],
      notes: 'Light weight, high reps',
      equipment: 'Dumbbells'
    },
    {
      id: 'hammer_curls',
      name: 'Hammer Curls',
      muscleGroup: 'Biceps',
      repRange: [8, 12],
      notes: 'Neutral grip',
      equipment: 'Dumbbells'
    }
  ],
  upper: [
    {
      id: 'weighted_dips',
      name: 'Weighted Dips',
      muscleGroup: 'Chest/Triceps',
      repRange: [8, 12],
      notes: 'Lean forward for chest',
      equipment: 'Dip station'
    },
    {
      id: 'cable_crossovers',
      name: 'Cable Crossovers',
      muscleGroup: 'Chest',
      repRange: [8, 15],
      notes: 'Squeeze at center',
      equipment: 'Cable'
    },
    {
      id: 'pull_ups',
      name: 'Pull-ups',
      muscleGroup: 'Back',
      repRange: [8, 12],
      notes: 'Full range of motion',
      equipment: 'Pull-up bar'
    },
    {
      id: 'barbell_rowing',
      name: 'Barbell Rowing',
      muscleGroup: 'Back',
      repRange: [8, 15],
      notes: 'Row to lower chest',
      equipment: 'Barbell'
    },
    {
      id: 'cable_lateral_raises',
      name: 'Cable Lateral Raises',
      muscleGroup: 'Shoulders',
      repRange: [10, 20],
      notes: 'Constant tension',
      equipment: 'Cable'
    },
    {
      id: 'shrugs',
      name: 'Shrugs',
      muscleGroup: 'Traps',
      repRange: [10, 20],
      notes: 'Squeeze at top',
      equipment: 'Dumbbells'
    }
  ],
  lower: [
    {
      id: 'hamstring_curls_lower',
      name: 'Hamstring Curls',
      muscleGroup: 'Hamstrings',
      repRange: [8, 15],
      notes: 'Slow eccentric',
      equipment: 'Machine'
    },
    {
      id: 'hip_thrusts',
      name: 'Hip Thrusts',
      muscleGroup: 'Glutes',
      repRange: [8, 15],
      notes: 'Squeeze glutes at top',
      equipment: 'Barbell'
    },
    {
      id: 'calf_raises',
      name: 'Calf Raises',
      muscleGroup: 'Calves',
      repRange: [10, 20],
      notes: 'Full stretch and contraction',
      equipment: 'Machine'
    },
    {
      id: 'russian_splits',
      name: 'Russian Splits',
      muscleGroup: 'Legs',
      repRange: [8, 15],
      notes: 'Control the descent',
      equipment: 'Dumbbells'
    },
    {
      id: 'planks',
      name: 'Planks',
      muscleGroup: 'Core',
      repRange: [60, 180],
      notes: '1 minute × 3 sets',
      equipment: 'None'
    },
    {
      id: 'dumbbell_pullovers',
      name: 'Dumbbell Pullovers',
      muscleGroup: 'Lats/Chest',
      repRange: [8, 15],
      notes: 'Feel the stretch',
      equipment: 'Dumbbell'
    }
  ]
};

export const getExerciseById = (exerciseId: string): Exercise | undefined => {
  for (const workoutType of Object.values(exerciseDatabase)) {
    const exercise = workoutType.find(ex => ex.id === exerciseId);
    if (exercise) return exercise;
  }
  return undefined;
};