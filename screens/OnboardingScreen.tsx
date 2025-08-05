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
    // Progress: 0% on first screen, 40% on second, 60% on third, 80% on fourth, 100% on final
    let targetProgress;
    if (currentStep === 0) {
      targetProgress = 0; // 0% on first screen
    } else if (currentStep === 1) {
      targetProgress = 0.4; // 40% on second screen
    } else if (currentStep === 2) {
      targetProgress = 0.6; // 60% on third screen
    } else if (currentStep === 3) {
      targetProgress = 0.8; // 80% on fourth screen
    } else {
      targetProgress = 1.0; // 100% on final screen
    }
    
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
            <Text style={styles.experiencePrompt}>
              How long have{'\n'}you been lifting?
            </Text>
            <View style={styles.pillContainer}>
              {[
                { value: 'beginner', label: 'Just getting started' },
                { value: 'intermediate', label: 'Been training for a bit' },
                { value: 'advanced', label: "It's a lifestyle now" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.pillButton,
                    formData.experience === option.value && styles.pillButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, experience: option.value as any })}
                >
                  <Text style={[
                    styles.pillText,
                    formData.experience === option.value && styles.pillTextSelected,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.trainingPrompt}>
              How many days{'\n'}do you train?
            </Text>
            <View style={styles.numberSelectionContainer}>
              <View style={styles.numberRow}>
                {[1, 2, 3, 4].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.numberButton,
                      formData.daysPerWeek === num && styles.numberButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, daysPerWeek: num })}
                  >
                    <Text style={[
                      styles.numberText,
                      formData.daysPerWeek === num && styles.numberTextSelected,
                    ]}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.numberRow}>
                {[5, 6, 7].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.numberButton,
                      formData.daysPerWeek === num && styles.numberButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, daysPerWeek: num })}
                  >
                    <Text style={[
                      styles.numberText,
                      formData.daysPerWeek === num && styles.numberTextSelected,
                    ]}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.intensityPrompt}>
              How hard do you{'\n'}want to train?
            </Text>
            <View style={styles.pillContainer}>
              {[
                { value: 'easy', label: "I'm just easing in" },
                { value: 'moderate', label: "I'll give it a fair shot" },
                { value: 'hard', label: "I'm all in, let's go!" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.pillButton,
                    formData.intensity === option.value && styles.pillButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, intensity: option.value as any })}
                >
                  <Text style={[
                    styles.pillText,
                    formData.intensity === option.value && styles.pillTextSelected,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
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
        {currentStep === 0 || currentStep === 1 || currentStep === 2 || currentStep === 3 ? (
          // FAB for first four steps
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
    paddingHorizontal: 38,
    paddingTop: 64,
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
    paddingTop: 20,
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
    marginBottom: 24,
    lineHeight: 52,
  },
  experiencePrompt: {
    fontSize: 42,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 32,
    lineHeight: 48,
  },
  trainingPrompt: {
    fontSize: 38,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 32,
    lineHeight: 44,
  },
  intensityPrompt: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 32,
    lineHeight: 42,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
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
  pillContainer: {
    gap: 24,
    marginTop: 4,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  numberSelectionContainer: {
    marginTop: 8,
    marginBottom: 56,
    gap: 16,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  numberRowSingle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  numberButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButtonSelected: {
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  numberText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  numberTextSelected: {
    color: '#000000',
  },
});

export default OnboardingScreen;