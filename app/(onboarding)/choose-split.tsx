import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';

export default function ChooseSplitScreen() {
  const router = useRouter();
  const { dispatch } = useApp();
  const params = useLocalSearchParams();
  const [selected, setSelected] = useState<'' | 'ppl' | 'upperLower' | 'fullBody' | 'bro'>('');

  const canProceed = selected !== '';

  const handleNext = () => {
    if (!canProceed) return;
    // Build user profile from params + selected split
    try {
      const name = String(params.name || '');
      const experience = String(params.experience || 'beginner') as any;
      const daysPerWeek = Number(params.daysPerWeek || 3);
      const intensity = String(params.intensity || 'moderate') as any;
      const goal = String(params.goal || 'fitness') as any;

      const user = {
        name,
        experience,
        daysPerWeek,
        intensity,
        goal,
        planMode: 'split' as const,
        splitType: selected,
        startDate: new Date().toISOString(),
        currentSplit: [],
        hasCompletedOnboarding: true,
      };

      dispatch({ type: 'SET_USER', payload: user as any });
      router.replace('/(tabs)');
    } catch {
      // Fallback: go back if something went wrong
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Which split do you follow?</Text>

        <View style={styles.pillContainer}>
          {[
            { value: 'ppl', label: 'Push / Pull / Legs' },
            { value: 'upperLower', label: 'Upper / Lower' },
            { value: 'fullBody', label: 'Full Body' },
            { value: 'bro', label: 'Bro Split (Chest / Back / Shoulders / Arms / Legs)' },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.pillButton,
                selected === (opt.value as any) && styles.pillButtonSelected,
              ]}
              onPress={() => setSelected(opt.value as any)}
            >
              <Text
                style={[
                  styles.pillText,
                  selected === (opt.value as any) && styles.pillTextSelected,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, !canProceed && styles.fabDisabled]}
        disabled={!canProceed}
        onPress={handleNext}
        accessibilityLabel="Continue to next step"
        accessibilityRole="button"
      >
        <Text style={styles.fabArrow}>{'>'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 100,
  },
  heading: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 28,
    lineHeight: 42,
  },
  pillContainer: {
    gap: 24,
    marginTop: 0,
    marginBottom: 56,
  },
  pillButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  pillButtonSelected: {
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pillText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  pillTextSelected: {
    color: '#000000',
  },
  fab: {
    position: 'absolute',
    bottom: 56,
    right: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabDisabled: {
    backgroundColor: '#2C2C2E',
    elevation: 4,
    shadowOpacity: 0.1,
  },
  fabArrow: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '600',
  },
});


