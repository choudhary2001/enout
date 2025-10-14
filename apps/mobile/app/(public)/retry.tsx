import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '../../src/lib/api';

export default function RetryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string }>();
  const [isResending, setIsResending] = useState(false);

  const handleResendOtp = async () => {
    setIsResending(true);
    
    try {
      const response = await api.resendOtp({ email: params.email || '' });
      
      if (response.ok) {
        Alert.alert('Success', 'OTP resent to your email', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to OTP screen
              router.replace({
                pathname: '/(public)/otp',
                params: { email: params.email },
              });
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Could not resend OTP. Please try another email.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleUseAnotherEmail = () => {
    router.replace('/(public)/email');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📧</Text>
        </View>

        <Text style={styles.title}>Email Not Found</Text>
        <Text style={styles.subtitle}>
          We couldn&apos;t find an invitation for
        </Text>
        <Text style={styles.email}>{params.email}</Text>

        <Text style={styles.description}>
          This email address doesn&apos;t appear to be on our invite list. 
          Please check with your event organizer or try a different email.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, isResending && styles.buttonDisabled]}
            onPress={handleResendOtp}
            disabled={isResending}
          >
            {isResending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Resend OTP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleUseAnotherEmail}
          >
            <Text style={styles.secondaryButtonText}>Use Another Email</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>
          Tip: For testing, use an email ending with @brevo.com
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
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9B24E',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#F9B24E',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F9B24E',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#F9B24E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
});
