import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useApp } from '@/context/AppContext';
import OnboardingScreen from '@/screens/OnboardingScreen';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getWorkoutDisplayName, getMuscleGroups, getEstimatedDuration, createWorkoutSession, getNextWorkout } from '@/utils/workoutUtils';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { state, dispatch } = useApp();
  const router = useRouter();

  if (state.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!state.user?.hasCompletedOnboarding) {
    return <OnboardingScreen />;
  }

  const nextWorkout = getNextWorkout(state.user.currentSplit, state.workoutHistory);
  const recentWorkouts = state.workoutHistory.slice(-3).reverse();

  const startWorkout = (workoutType: string) => {
    const workoutSession = createWorkoutSession(workoutType as any);
    dispatch({ type: 'START_WORKOUT', payload: workoutSession });
    router.push('/workout');
  };

  const renderWorkoutCard = (workoutType: string, isRecommended = false) => (
    <Card key={workoutType} style={[styles.workoutCard, isRecommended && styles.recommendedCard]}>
      <View style={styles.workoutHeader}>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutName}>{getWorkoutDisplayName(workoutType as any)}</Text>
          <Text style={styles.muscleGroups}>{getMuscleGroups(workoutType as any)}</Text>
          <Text style={styles.duration}>{getEstimatedDuration(workoutType as any)}</Text>
        </View>
        {isRecommended && (
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>Next</Text>
          </View>
        )}
      </View>
      <Button
        title="Start Workout"
        onPress={() => startWorkout(workoutType)}
        variant={isRecommended ? 'primary' : 'outline'}
        style={styles.startButton}
      />
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back, {state.user.name}</Text>
          <Text style={styles.subtitle}>What do you want to train today?</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          {renderWorkoutCard(nextWorkout, true)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Workouts</Text>
          {state.user.currentSplit.map(workoutType => 
            workoutType !== nextWorkout ? renderWorkoutCard(workoutType) : null
          )}
        </View>

        {recentWorkouts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            {recentWorkouts.map((workout, index) => (
              <Card key={workout.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyWorkout}>
                    {getWorkoutDisplayName(workout.workoutType)}
                  </Text>
                  <Text style={styles.historyDate}>
                    {new Date(workout.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.historyDuration}>
                  {Math.round(workout.duration / 60)} minutes • {workout.exercises.length} exercises
                </Text>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
    marginTop: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#EBEBF5',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  workoutCard: {
    marginBottom: 12,
  },
  recommendedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  muscleGroups: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: '#30D158',
  },
  recommendedBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  startButton: {
    marginTop: 8,
  },
  historyCard: {
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyWorkout: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  historyDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  historyDuration: {
    fontSize: 14,
    color: '#EBEBF5',
  },
});