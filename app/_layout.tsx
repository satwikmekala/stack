import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/context/AppContext';
import { useApp } from '@/context/AppContext';

// Separate navigator so we can access context (hooks must be inside a provider)
function RootNavigator() {
  const {
    state: { user, isLoading },
  } = useApp();

  // While loading persisted data, avoid rendering a screen (could render a splash)
  if (isLoading) {
    return null;
  }

  const hasCompletedOnboarding = user?.hasCompletedOnboarding;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {hasCompletedOnboarding ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="workout" options={{ headerShown: false }} />
        </>
      ) : (
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AppProvider>
      <RootNavigator />
      <StatusBar style="light" />
    </AppProvider>
  );
}