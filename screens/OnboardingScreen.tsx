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
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [planMode, setPlanMode] = useState<'auto' | 'split' | 'flex' | null>(null);
  const [phase, setPhase] = useState<'plan' | 'splitPicker'>('plan');
  const [splitType, setSplitType] = useState<'ppl' | 'upperLower' | 'fullBody' | 'bro' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    experience: '' as 'beginner' | 'intermediate' | 'advanced' | '',
    daysPerWeek: 0,
    intensity: '' as 'easy' | 'moderate' | 'hard' | '',
    goal: '' as 'muscle' | 'strength' | 'fitness' | '',
  });

  console.log('planMode', planMode);
  console.log('splitType', splitType);

  const getProgressTarget = (): number => {
    const base = Math.min(currentStep, 4) * 0.2;
    if (currentStep === 4) {
      return phase === 'splitPicker' ? 0.9 : 0.8;
    }
    return base;
  };

  // Animate progress bar on screen load
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: getProgressTarget(),
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [currentStep, phase]);

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

  // Unified Back Button (minimal chevron, grey tone, no background circle)
  const BackButton = ({ onPress, testID = 'onboarding-back' }: { onPress: () => void; testID?: string }) => (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel="Go back"
      accessibilityRole="button"
      testID={testID}
      style={styles.backMinimal}
      hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}
    >
      <Ionicons name="chevron-back" size={24} color="#8E8E93" />
    </TouchableOpacity>
  );

  const handleBack = () => {
    if (currentStep === 4 && phase === 'splitPicker') {
      Animated.timing(progressAnim, {
        toValue: 0.8,
        duration: 800,
        useNativeDriver: false,
      }).start();
      setPhase('plan');
      return;
    }
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }
    // Step 5 branching (plan mode)
    if (currentStep === 4) {
      if (!planMode) return;

      // Persist planMode to context immediately
      dispatch({ type: 'SET_USER', payload: { ...state.user, planMode } as any });

      if (planMode === 'split') {
        // animate to 90% and reveal inline split picker
        Animated.timing(progressAnim, {
          toValue: 0.9,
          duration: 800,
          useNativeDriver: false,
        }).start();
        setPhase('splitPicker');
        return;
      }
      // auto or flex → animate to 100% then complete
      Animated.timing(progressAnim, {
        toValue: 1.0,
        duration: 800,
        useNativeDriver: false,
      }).start();
      completeOnboarding();
      return;
    }
    // Fallback
    completeOnboarding();
  };

  const completeOnboarding = () => {
    const userProfile: UserProfile = {
      name: formData.name,
      experience: formData.experience as 'beginner' | 'intermediate' | 'advanced',
      daysPerWeek: formData.daysPerWeek,
      intensity: formData.intensity as 'easy' | 'moderate' | 'hard',
      goal: (formData.goal || 'fitness') as 'muscle' | 'strength' | 'fitness',
      planMode: (planMode || 'auto') as any,
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
            {phase === 'plan' ? (
              <>
                <Text style={styles.planModePrompt}>
                  How should we build{`\n`}your plan?
                </Text>
                <View style={styles.pillContainer}>
                  {[
                    { value: 'auto', label: 'Auto (recommended)', subtitle: 'Pick the best split for me.' },
                    { value: 'split', label: 'I already follow a split', subtitle: 'Match my current style.' },
                    { value: 'flex', label: 'Flexible', subtitle: 'Rotate focus so it never feels stale.' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.pillButton,
                        planMode === (option.value as any) && styles.pillButtonSelected,
                      ]}
                      onPress={() => setPlanMode(option.value as any)}
                    >
                      <Text style={[
                        styles.pillText,
                        planMode === (option.value as any) && styles.pillTextSelected,
                      ]}>
                        {option.label}
                      </Text>
                      <Text style={styles.optionDesc}>
                        {option.subtitle}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.planModePrompt}>Which split do you follow?</Text>
                <View style={styles.pillContainer}>
                  {[
                    { value: 'ppl', label: 'Push / Pull / Legs' },
                    { value: 'upperLower', label: 'Upper / Lower' },
                    { value: 'fullBody', label: 'Full Body' },
                    { value: 'bro', label: 'Bro Split (Chest / Back / Shoulders / Arms / Legs)' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.pillButton,
                        splitType === (option.value as any) && styles.pillButtonSelected,
                      ]}
                      onPress={() => setSplitType(option.value as any)}
                    >
                      <Text style={[
                        styles.pillText,
                        splitType === (option.value as any) && styles.pillTextSelected,
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
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
      case 4: return phase === 'plan' ? planMode !== null : splitType !== null;
      default: return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderStep()}
        {currentStep === 0 || currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === 4 ? (
          // FAB for all onboarding steps
          <TouchableOpacity
            style={[styles.fab, !canProceed() && styles.fabDisabled]}
            onPress={handleNext}
            disabled={!canProceed()}
            accessibilityLabel="Continue to next step"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-forward" size={24} color={!canProceed() ? '#8E8E93' : '#000000'} />
          </TouchableOpacity>
        ) : null}
        {currentStep >= 1 ? (
          <BackButton onPress={handleBack} />
        ) : null}
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
    paddingTop: 48,
    paddingBottom: 16,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 0,
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
    marginTop: 28,
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
    fontSize: 38,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 28,
    lineHeight: 44,
  },
  experiencePrompt: {
    fontSize: 38,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 28,
    lineHeight: 44,
  },
  trainingPrompt: {
    fontSize: 38,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 28,
    lineHeight: 44,
  },
  intensityPrompt: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 28,
    lineHeight: 42,
  },
  structurePrompt: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 28,
    lineHeight: 42,
  },
  planModePrompt: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 28,
    lineHeight: 42,
  },
  // removed old top-left back arrow styles (now using unified bottom-left BackButton)
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabLeft: {
    right: undefined,
    left: 28,
  },
  backMinimal: {
    position: 'absolute',
    bottom: 56,
    left: 28,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backMinimalText: {
    color: '#8E8E93',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 30,
  },
  fabDisabled: {
    backgroundColor: '#2C2C2E',
    elevation: 4,
    shadowOpacity: 0.1,
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
    marginTop: 0,
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