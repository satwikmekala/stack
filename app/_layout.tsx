import { Stack } from 'expo-router';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from '@/context/AppContext';
import { View, Text, StyleSheet } from 'react-native';

// Navigation component that switches between onboarding and main app
function AppNavigator() {
  const { state } = useApp();

  // Show loading screen while checking onboarding status
  if (state.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Ensure we have a valid user state before proceeding
  if (!state.user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  // If onboarding not completed, show ONLY onboarding stack (no tabs)
  if (!state.user.hasCompletedOnboarding) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
      </Stack>
    );
  }

  // If onboarding completed, show ONLY main app with tabs
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="workout" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <AppNavigator />
      <StatusBar style="light" />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});