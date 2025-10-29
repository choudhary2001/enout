import { Stack } from 'expo-router';

export default function TasksLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F9B24E',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Registration Tasks',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="id" 
        options={{ 
          title: 'Upload ID',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="form" 
        options={{ 
          title: 'Registration Form',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="phone-input" 
        options={{ 
          title: 'Phone Number',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="phone" 
        options={{ 
          title: 'Verify Phone',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}
