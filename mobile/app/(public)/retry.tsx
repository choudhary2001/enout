import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function RetryScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();


  const handleUseAnotherEmail = () => {
    router.push('/(public)/email');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Email Not Found</Text>
        <Text style={styles.subtitle}>
          The email <Text style={styles.email}>{email}</Text> is not in our invite list.
        </Text>

        <View style={styles.options}>
          <TouchableOpacity style={styles.button} onPress={handleUseAnotherEmail}>
            <Text style={styles.buttonText}>Use Another Email</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          If you believe this is an error, please contact support.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  email: {
    fontWeight: 'bold',
    color: '#F9B24E',
  },
  options: {
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#F9B24E',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },
});
