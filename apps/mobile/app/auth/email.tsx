import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function EmailScreen() {
  const [email, setEmail] = useState('');
  
  const handleContinue = () => {
    if (email.trim()) {
      router.push('/auth/verify-email');
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your email</Text>
      <Text style={styles.description}>
        We&apos;ll send you a verification code to sign in to your account
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      
      <TouchableOpacity 
        style={[styles.button, !email.trim() && styles.buttonDisabled]} 
        onPress={handleContinue}
        disabled={!email.trim()}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#F9B24E',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#F9B24E80',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});