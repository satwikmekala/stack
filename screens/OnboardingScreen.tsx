import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { useApp } from '@/context/AppContext';
import { UserProfile } from '@/types';
import { generateSplit } from '@/utils/workoutUtils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const OnboardingScreen = () => {
  const { dispatch } = useApp();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [formData, setFormData] = useState({
    name: '',
    experience: '' as 'beginner' | 'intermediate' | 'advanced' | '',
    daysPerWeek: 3,
    intensity: '' as 'easy' | 'moderate' | 'hard' | '',
    goal: '' as 'muscle' | 'strength' | 'fitness' | '',
  });

  // Animate progress bar on screen load
  useEffect(() => {
    // Progress starts at 0% for first screen, then 20% per completed step
    const targetProgress = currentStep / 5; // currentStep 0 = 0%, 1 = 20%, 2 = 40%, etc.
    Animated.timing(progressAnim, {
      toValue: targetProgress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  // Progress Bar Component
  const ProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    const userProfile: UserProfile = {
      name: formData.name,
      experience: formData.experience as 'beginner' | 'intermediate' | 'advanced',
      daysPerWeek: formData.daysPerWeek,
      intensity: formData.intensity as 'easy' | 'moderate' | 'hard',
      goal: formData.goal as 'muscle' | 'strength' | 'fitness',
      startDate: new Date().toISOString(),
      currentSplit: generateSplit(formData.daysPerWeek),
      hasCompletedOnboarding: true,
    };

    dispatch({ type: 'SET_USER', payload: userProfile });

    // Navigate to the main app tabs after onboarding is complete
    router.replace('/(tabs)');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.singlePrompt}>
              what should{'\n'}we call you ?
            </Text>
            <Input
              value={formData.name}
              onChangeText={(name) => setFormData({ ...formData, name })}
              placeholder="Enter your name"
              variant="underline"
              style={styles.underlineInput}
              autoFocus={true}
            />
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Experience Level</Text>
            <Text style={styles.question}>How long have you been training?</Text>
            <View style={styles.optionsContainer}>
              {[
                { value: 'beginner', label: 'Just started', desc: 'Less than 6 months' },
                { value: 'intermediate', label: 'Few months', desc: '6 months - 2 years' },
                { value: 'advanced', label: 'Over a year', desc: '2+ years' },
              ].map((option) => (
                <Card key={option.value} style={styles.optionCard}>
                  <Button
                    title={option.label}
                    onPress={() => setFormData({ ...formData, experience: option.value as any })}
                    variant={formData.experience === option.value ? 'primary' : 'outline'}
                  />
                  <Text style={styles.optionDesc}>{option.desc}</Text>
                </Card>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Training Frequency</Text>
            <Text style={styles.question}>How many days can you train per week?</Text>
            <View style={styles.numberPicker}>
              {[2, 3, 4, 5, 6].map((num) => (
                <Button
                  key={num}
                  title={num.toString()}
                  onPress={() => setFormData({ ...formData, daysPerWeek: num })}
                  variant={formData.daysPerWeek === num ? 'primary' : 'outline'}
                  style={styles.numberButton}
                />
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Training Intensity</Text>
            <Text style={styles.question}>How hard do you want to push?</Text>
            <View style={styles.optionsContainer}>
              {[
                { value: 'easy', label: 'Take it easy', desc: 'Focus on form and consistency' },
                { value: 'moderate', label: 'Moderate effort', desc: 'Balanced approach' },
                { value: 'hard', label: 'Push hard', desc: 'Maximum gains' },
              ].map((option) => (
                <Card key={option.value} style={styles.optionCard}>
                  <Button
                    title={option.label}
                    onPress={() => setFormData({ ...formData, intensity: option.value as any })}
                    variant={formData.intensity === option.value ? 'primary' : 'outline'}
                  />
                  <Text style={styles.optionDesc}>{option.desc}</Text>
                </Card>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Primary Goal</Text>
            <Text style={styles.question}>What's your main focus?</Text>
            <View style={styles.optionsContainer}>
              {[
                { value: 'muscle', label: 'Build muscle', desc: 'Hypertrophy focused' },
                { value: 'strength', label: 'Get stronger', desc: 'Strength focused' },
                { value: 'fitness', label: 'General fitness', desc: 'Overall health' },
              ].map((option) => (
                <Card key={option.value} style={styles.optionCard}>
                  <Button
                    title={option.label}
                    onPress={() => setFormData({ ...formData, goal: option.value as any })}
                    variant={formData.goal === option.value ? 'primary' : 'outline'}
                  />
                  <Text style={styles.optionDesc}>{option.desc}</Text>
                </Card>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.name.trim().length > 0;
      case 1: return formData.experience !== '';
      case 2: return formData.daysPerWeek > 0;
      case 3: return formData.intensity !== '';
      case 4: return formData.goal !== '';
      default: return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderStep()}
        {currentStep === 0 ? (
          // FAB for first step only
          <TouchableOpacity
            style={[styles.fab, !canProceed() && styles.fabDisabled]}
            onPress={handleNext}
            disabled={!canProceed()}
            accessibilityLabel="Continue to next step"
            accessibilityRole="button"
          >
            <Ionicons 
              name="arrow-forward" 
              size={24} 
              color={!canProceed() ? '#8E8E93' : '#000000'} 
            />
          </TouchableOpacity>
        ) : (
          // Regular button for other steps
          <View style={styles.buttonContainer}>
            <Button
              title={currentStep === 4 ? "Let's Go!" : 'Continue'}
              onPress={handleNext}
              disabled={!canProceed()}
              size="large"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  progressContainer: {
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 16,
  },
  progressTrack: {
    height: 2,
    backgroundColor: '#333333',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#EBEBF5',
    textAlign: 'center',
    marginBottom: 32,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginHorizontal: 16,
  },
  underlineInput: {
    marginTop: 16,
    marginBottom: 80,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    gap: 8,
  },
  optionDesc: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  numberPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  numberButton: {
    minWidth: 60,
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: 16,
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
  },
  singlePrompt: {
    fontSize: 48,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 40,
    lineHeight: 56,
  },
  fab: {
    position: 'absolute',
    bottom: 56,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabDisabled: {
    backgroundColor: '#2C2C2E',
    elevation: 4,
    shadowOpacity: 0.1,
  },
});

export default OnboardingScreen;