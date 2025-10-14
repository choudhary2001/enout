import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="inbox" />
      <Stack.Screen name="schedule" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
