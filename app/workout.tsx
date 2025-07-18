import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'expo-router';
import { exerciseDatabase, getExerciseById } from '@/data/exercises';
import { calculateProgression, getLastWorkoutData, formatWeight } from '@/utils/workoutUtils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import { Set } from '@/types';

export default function WorkoutScreen() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentWeight, setCurrentWeight] = useState('');
  const [currentReps, setCurrentReps] = useState('');
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!state.currentWorkout) {
      router.replace('/');
    }
  }, [state.currentWorkout]);

  if (!state.currentWorkout) {
    return null;
  }

  const currentExercise = state.currentWorkout.exercises[currentExerciseIndex];
  const exerciseData = getExerciseById(currentExercise.exerciseId);
  const exerciseList = exerciseDatabase[state.currentWorkout.workoutType];
  const isLastExercise = currentExerciseIndex === exerciseList.length - 1;

  // Get progression suggestion
  const lastWorkoutData = getLastWorkoutData(state.workoutHistory, currentExercise.exerciseId);
  const progression = calculateProgression(lastWorkoutData, exerciseData);

  const addSet = () => {
    const weight = parseFloat(currentWeight) || 0;
    const reps = parseInt(currentReps) || 0;

    if (weight <= 0 || reps <= 0) {
      Alert.alert('Invalid Input', 'Please enter valid weight and reps');
      return;
    }

    const newSet: Set = {
      weight,
      reps,
      completed: true,
    };

    const updatedWorkout = { ...state.currentWorkout! };
    updatedWorkout.exercises[currentExerciseIndex].sets.push(newSet);

    dispatch({ type: 'UPDATE_CURRENT_WORKOUT', payload: updatedWorkout });
    setCurrentReps('');
  };

  const nextExercise = () => {
    if (currentExercise.sets.length === 0) {
      Alert.alert('No Sets Logged', 'Please log at least one set before moving on');
      return;
    }

    if (isLastExercise) {
      finishWorkout();
    } else {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentWeight('');
      setCurrentReps('');
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setCurrentWeight('');
      setCurrentReps('');
    }
  };

  const finishWorkout = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const completedWorkout = {
      ...state.currentWorkout!,
      duration,
      completed: true,
    };

    dispatch({ type: 'UPDATE_CURRENT_WORKOUT', payload: completedWorkout });
    dispatch({ type: 'COMPLETE_WORKOUT' });
    
    Alert.alert(
      'Workout Complete!',
      `Great job! You finished your ${state.currentWorkout.workoutType} workout in ${Math.round(duration / 60)} minutes.`,
      [{ text: 'OK', onPress: () => router.replace('/') }]
    );
  };

  const removeSet = (setIndex: number) => {
    const updatedWorkout = { ...state.currentWorkout! };
    updatedWorkout.exercises[currentExerciseIndex].sets.splice(setIndex, 1);
    dispatch({ type: 'UPDATE_CURRENT_WORKOUT', payload: updatedWorkout });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="End Workout"
          onPress={() => router.back()}
          variant="outline"
          size="small"
        />
        <Text style={styles.progress}>
          {currentExerciseIndex + 1} / {exerciseList.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{exerciseData?.name}</Text>
          <Text style={styles.muscleGroup}>{exerciseData?.muscleGroup}</Text>
          <Text style={styles.repRange}>
            Target: 3 sets × {exerciseData?.repRange[0]}-{exerciseData?.repRange[1]} reps
          </Text>
          {exerciseData?.notes && (
            <Text style={styles.notes}>{exerciseData.notes}</Text>
          )}
        </Card>

        {lastWorkoutData.length > 0 && (
          <Card style={styles.lastWorkoutCard}>
            <Text style={styles.lastWorkoutTitle}>Previous Performance</Text>
            {lastWorkoutData.map((set, index) => (
              <Text key={index} style={styles.lastWorkoutData}>
                Set {index + 1}: {formatWeight(set.weight)}kg × {set.reps} reps
              </Text>
            ))}
            <Text style={styles.suggestion}>
              Try: {formatWeight(progression.weight)}kg × {progression.reps} reps
            </Text>
          </Card>
        )}

        <Card style={styles.inputCard}>
          <Text style={styles.inputTitle}>Log Set</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <Input
                value={currentWeight}
                onChangeText={setCurrentWeight}
                placeholder={progression.weight.toString()}
                keyboardType="numeric"
                variant="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reps</Text>
              <Input
                value={currentReps}
                onChangeText={setCurrentReps}
                placeholder={progression.reps.toString()}
                keyboardType="numeric"
                variant="numeric"
              />
            </View>
          </View>
          <Button
            title="Add Set"
            onPress={addSet}
            variant="secondary"
            style={styles.addSetButton}
          />
        </Card>

        {currentExercise.sets.length > 0 && (
          <Card style={styles.setsCard}>
            <Text style={styles.setsTitle}>Completed Sets</Text>
            {currentExercise.sets.map((set, index) => (
              <View key={index} style={styles.setRow}>
                <Text style={styles.setData}>
                  Set {index + 1}: {formatWeight(set.weight)}kg × {set.reps} reps
                </Text>
                <Button
                  title="Remove"
                  onPress={() => removeSet(index)}
                  variant="outline"
                  size="small"
                />
              </View>
            ))}
          </Card>
        )}
      </ScrollView>

      <View style={styles.navigation}>
        <Button
          title="Previous"
          onPress={previousExercise}
          variant="outline"
          disabled={currentExerciseIndex === 0}
          style={styles.navButton}
        />
        <Button
          title={isLastExercise ? 'Finish Workout' : 'Next Exercise'}
          onPress={nextExercise}
          variant="primary"
          style={styles.navButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  progress: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  exerciseCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  muscleGroup: {
    fontSize: 16,
    color: '#30D158',
    marginBottom: 8,
  },
  repRange: {
    fontSize: 16,
    color: '#EBEBF5',
    marginBottom: 8,
  },
  notes: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  lastWorkoutCard: {
    marginBottom: 16,
  },
  lastWorkoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  lastWorkoutData: {
    fontSize: 14,
    color: '#EBEBF5',
    marginBottom: 4,
  },
  suggestion: {
    fontSize: 14,
    color: '#30D158',
    fontWeight: '600',
    marginTop: 8,
  },
  inputCard: {
    marginBottom: 16,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: '#EBEBF5',
    marginBottom: 8,
    textAlign: 'center',
  },
  addSetButton: {
    marginTop: 8,
  },
  setsCard: {
    marginBottom: 16,
  },
  setsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  setData: {
    fontSize: 16,
    color: '#EBEBF5',
    fontWeight: '500',
  },
  navigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  navButton: {
    flex: 1,
  },
});