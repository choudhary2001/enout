import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface PhoneOtpFormData {
  code: string;
}

interface PhoneOtpFormProps {
  control: Control<PhoneOtpFormData>;
  errors: FieldErrors<PhoneOtpFormData>;
  phoneNumber?: string;
}

export function PhoneOtpForm({ control, errors, phoneNumber }: PhoneOtpFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Phone Number</Text>
      {phoneNumber && (
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{'\n'}
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </Text>
      )}

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Enter 6-digit code</Text>
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.code && styles.inputError]}
              placeholder="000000"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
              maxLength={6}
              autoFocus
            />
          )}
        />
        {errors.code && (
          <Text style={styles.errorText}>{errors.code.message}</Text>
        )}
      </View>

      <Text style={styles.hint}>
        Tip: Use 654321 for testing
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  phoneNumber: {
    fontWeight: 'bold',
    color: '#F9B24E',
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 4,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  hint: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },
});
