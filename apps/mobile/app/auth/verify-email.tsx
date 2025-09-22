import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function VerifyEmailScreen() {
  const [code, setCode] = useState('');
  
  const handleVerify = () => {
    if (code.trim()) {
      // In a real app, this would verify the code with the API
      router.replace('/');
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.description}>
        Enter the verification code we sent to your email
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Verification code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        autoCapitalize="none"
      />
      
      <TouchableOpacity 
        style={[styles.button, !code.trim() && styles.buttonDisabled]} 
        onPress={handleVerify}
        disabled={!code.trim()}
      >
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.resendButton}>
        <Text style={styles.resendButtonText}>Resend code</Text>
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
  resendButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#F9B24E',
    fontSize: 16,
  },
});
