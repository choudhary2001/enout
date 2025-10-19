import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface RegistrationFormData {
  name: string;
  surname: string;
  workEmail: string;
  location: string;
  mealPreference: string;
  gender: string;
}

interface RegistrationFormProps {
  control: Control<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
}

export function RegistrationForm({ control, errors }: RegistrationFormProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.fieldContainer, styles.halfWidth]}>
          <Text style={styles.label}>Name *</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter your name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>

        <View style={[styles.fieldContainer, styles.halfWidth]}>
          <Text style={styles.label}>Surname *</Text>
          <Controller
            control={control}
            name="surname"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.surname && styles.inputError]}
                placeholder="Enter your surname"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
              />
            )}
          />
          {errors.surname && (
            <Text style={styles.errorText}>{errors.surname.message}</Text>
          )}
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Work Email *</Text>
        <Controller
          control={control}
          name="workEmail"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.workEmail && styles.inputError]}
              placeholder="Enter your work email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.workEmail && (
          <Text style={styles.errorText}>{errors.workEmail.message}</Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Location *</Text>
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.location && styles.inputError]}
              placeholder="Enter your location"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
            />
          )}
        />
        {errors.location && (
          <Text style={styles.errorText}>{errors.location.message}</Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Meal Preference *</Text>
        <Controller
          control={control}
          name="mealPreference"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.radioContainer}>
              {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Halal', 'Kosher'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioOption}
                  onPress={() => onChange(option)}
                >
                  <View style={styles.radioCircle}>
                    {value === option && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
        {errors.mealPreference && (
          <Text style={styles.errorText}>{errors.mealPreference.message}</Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Gender *</Text>
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.radioContainer}>
              {['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioOption}
                  onPress={() => onChange(option)}
                >
                  <View style={styles.radioCircle}>
                    {value === option && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
        {errors.gender && (
          <Text style={styles.errorText}>{errors.gender.message}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: '45%',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#059669',
  },
  radioLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});
