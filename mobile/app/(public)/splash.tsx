import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to email screen after a small timeout
    const timer = setTimeout(() => {
      router.replace('/(public)/email');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>Enout</Text>
        <Text style={styles.tagline}>Your Event Companion</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9B24E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
});
