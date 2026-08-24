import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { useApp } from '@/context/AppContext';
import { getWorkoutDisplayName } from '@/utils/workoutUtils';
import Card from '@/components/ui/Card';
import { WorkoutSession, ExerciseSession } from '@/types';

export default function CalendarScreen() {
  const { state } = useApp();

  const getWorkoutsByDate = () => {
    const workoutsByDate: { [date: string]: WorkoutSession[] } = {};
    
    state.workoutHistory.forEach(workout => {
      const date = new Date(workout.date).toDateString();
      if (!workoutsByDate[date]) {
        workoutsByDate[date] = [];
      }
      workoutsByDate[date].push(workout);
    });

    return Object.entries(workoutsByDate)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 30); // Show last 30 days with workouts
  };

  const workoutDays = getWorkoutsByDate();

  const renderWorkoutDay = ({ item }: { item: [string, WorkoutSession[]] }) => {
    const [dateString, workouts] = item;
    const date = new Date(dateString);
    
    return (
      <Card style={styles.dayCard}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayDate}>
            {date.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
          <Text style={styles.workoutCount}>
            {workouts.length} workout{workouts.length > 1 ? 's' : ''}
          </Text>
        </View>
        
        {workouts.map(workout => (
          <View key={workout.id} style={styles.workoutSummary}>
            <Text style={styles.workoutName}>
              {getWorkoutDisplayName(workout.workoutType)}
            </Text>
            <View style={styles.workoutStats}>
              <Text style={styles.workoutStat}>
                {Math.round(workout.duration / 60)} min
              </Text>
              <Text style={styles.workoutStat}>
                {workout.exercises.length} exercises
              </Text>
              <Text style={styles.workoutStat}>
                {workout.exercises.reduce((total: number, ex: ExerciseSession) => total + ex.sets.length, 0)} sets
              </Text>
            </View>
          </View>
        ))}
      </Card>
    );
  };

  const getTotalStats = () => {
    const totalWorkouts = state.workoutHistory.length;
    const totalSets = state.workoutHistory.reduce(
      (total, workout) => total + workout.exercises.reduce(
        (exerciseTotal, exercise) => exerciseTotal + exercise.sets.length, 0
      ), 0
    );
    const totalMinutes = state.workoutHistory.reduce(
      (total, workout) => total + workout.duration, 0
    );

    return { totalWorkouts, totalSets, totalMinutes: Math.round(totalMinutes / 60) };
  };

  const stats = getTotalStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout History</Text>
      </View>

      <Card style={styles.statsCard}>
        <Text style={styles.statsTitle}>All Time Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalSets}</Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>
      </Card>

      {workoutDays.length > 0 ? (
        <FlatList
          data={workoutDays}
          renderItem={renderWorkoutDay}
          keyExtractor={([date]) => date}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No workouts yet</Text>
          <Text style={styles.emptySubtitle}>
            Start your first workout to see your progress here
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#30D158',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  dayCard: {
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  workoutCount: {
    fontSize: 14,
    color: '#8E8E93',
  },
  workoutSummary: {
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
  },
  workoutStat: {
    fontSize: 14,
    color: '#EBEBF5',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});