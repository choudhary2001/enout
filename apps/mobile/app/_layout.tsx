import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulate loading resources or checking auth state
    setTimeout(() => {
      setReady(true);
    }, 500);
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#F9B24E',
          },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/email"
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen
          name="auth/verify-email"
          options={{ title: 'Verify Email' }}
        />
        <Stack.Screen
          name="invite/index"
          options={{ title: 'Event Invitation' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
