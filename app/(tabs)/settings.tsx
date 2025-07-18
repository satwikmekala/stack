import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useApp } from '@/context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function SettingsScreen() {
  const { state, dispatch } = useApp();

  const resetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your workout history and reset the app. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              dispatch({ type: 'SET_USER', payload: null as any });
              dispatch({ type: 'SET_WORKOUT_HISTORY', payload: [] });
            } catch (error) {
              Alert.alert('Error', 'Failed to reset data');
            }
          },
        },
      ]
    );
  };

  const exportData = () => {
    const exportData = {
      user: state.user,
      workoutHistory: state.workoutHistory,
      exportDate: new Date().toISOString(),
    };

    Alert.alert(
      'Export Data',
      'Your workout data would be exported as JSON. In a full app, this would save to your device or cloud storage.',
      [{ text: 'OK' }]
    );
  };

  if (!state.user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Please complete onboarding first</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatSplit = (split: string[]) => {
    return split.map(day => 
      day.charAt(0).toUpperCase() + day.slice(1)
    ).join(', ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.profileCard}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{state.user.name}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Experience</Text>
            <Text style={styles.value}>{state.user.experience}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Training Days</Text>
            <Text style={styles.value}>{state.user.daysPerWeek} days/week</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Intensity</Text>
            <Text style={styles.value}>{state.user.intensity}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Goal</Text>
            <Text style={styles.value}>{state.user.goal}</Text>
          </View>
        </Card>

        <Card style={styles.routineCard}>
          <Text style={styles.sectionTitle}>Current Split</Text>
          <Text style={styles.splitText}>{formatSplit(state.user.currentSplit)}</Text>
        </Card>

        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Total Workouts</Text>
            <Text style={styles.value}>{state.workoutHistory.length}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Days Training</Text>
            <Text style={styles.value}>
              {Math.floor((Date.now() - new Date(state.user.startDate).getTime()) / (1000 * 60 * 60 * 24))}
            </Text>
          </View>
        </Card>

        <View style={styles.actionsSection}>
          <Button
            title="Export Data"
            onPress={exportData}
            variant="outline"
            style={styles.actionButton}
          />
          
          <Button
            title="Reset All Data"
            onPress={resetData}
            variant="outline"
            style={[styles.actionButton, styles.dangerButton]}
            textStyle={styles.dangerText}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Stack v1.0.0</Text>
          <Text style={styles.footerText}>
            Built for serious lifters who value utility over engagement
          </Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#8E8E93',
  },
  profileCard: {
    marginBottom: 16,
  },
  routineCard: {
    marginBottom: 16,
  },
  statsCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#EBEBF5',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  splitText: {
    fontSize: 16,
    color: '#30D158',
    textAlign: 'center',
  },
  actionsSection: {
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    marginBottom: 0,
  },
  dangerButton: {
    borderColor: '#FF3B30',
  },
  dangerText: {
    color: '#FF3B30',
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});