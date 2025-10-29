import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../../../src/lib/api';
import { storage } from '../../../src/lib/storage';

interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
  workEmail?: string;
  company?: string;
  dietaryRequirements?: string;
  emergencyContact?: string;
  location?: string;
  gender?: string;
  idDocUrl?: string; // Note: API returns idDocUrl, not idCardUrl
  phoneVerified?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  // Refresh profile when screen comes into focus (e.g., after navigation back)
  useFocusEffect(
    useCallback(() => {
      // Add a small delay to avoid race conditions with the initial load
      const timer = setTimeout(() => {
        if (!loading && !profile) {
          loadProfile();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }, [loading, profile])
  );

  const loadProfile = async () => {
    try {
      console.log('Loading profile...');
      
      // Check if we have authentication token first
      const token = await storage.getItem('auth_token');
      console.log('Auth token exists:', !!token);
      
      if (!token) {
        console.log('No auth token found - redirecting to login');
        Alert.alert(
          'Authentication Required',
          'Please log in to view your profile.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/(public)/email');
              },
            },
          ]
        );
        setLoading(false);
        return;
      }
      
      const response = await api.getMe();
      
      console.log('Profile API response:', response);
      
      // Handle authentication errors - check status and message for auth issues
      if (response.status === 401 || response.message === 'Authentication required' || response.message?.includes('Authentication')) {
        console.log('Authentication required - redirecting to login');
        Alert.alert(
          'Authentication Required',
          'Please log in again to view your profile.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to email/login screen
                router.replace('/(public)/email');
              },
            },
          ]
        );
        return;
      }
      
      if (response.ok && response.data) {
        // New API format - map the response data properly
        const apiData = response.data as any;
        console.log('Profile data from API:', apiData);
        console.log('Response structure:', { ok: response.ok, hasData: !!response.data, dataType: typeof response.data });
        
        // Handle different response structures
        let profileData = apiData;
        
        // If the data is nested in another structure, try to extract it
        if (apiData && typeof apiData === 'object') {
          // Check if data is wrapped in another property
          if (apiData.data) {
            profileData = apiData.data;
          }
        }
        
        console.log('Final profile data to map:', profileData);
        
        // Ensure we have the required fields
        const mappedProfile: Profile = {
          id: profileData?.id || '',
          email: profileData?.email || '',
          firstName: profileData?.firstName || '',
          lastName: profileData?.lastName || '',
          phone: profileData?.phone,
          workEmail: profileData?.workEmail,
          location: profileData?.location,
          gender: profileData?.gender,
          dietaryRequirements: profileData?.dietaryRequirements,
          idDocUrl: profileData?.idDocUrl,
          phoneVerified: profileData?.phoneVerified,
          // Fields not in API - set defaults
          role: 'attendee',
          company: undefined,
          emergencyContact: undefined,
        };
        
        console.log('Mapped profile:', mappedProfile);
        setProfile(mappedProfile);
      } else {
        console.error('Profile API response not OK:', response);
        
        // Handle other error cases
        let errorMessage = 'Failed to load profile';
        if (response.message === 'Authentication required') {
          errorMessage = 'Please log in again';
          // Auto-redirect for auth errors
          setTimeout(() => {
            router.replace('/(public)/email');
          }, 1000);
        }
        
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      
      // Check if it's an authentication error
      if (error instanceof Error && error.message.includes('Authentication')) {
        Alert.alert(
          'Authentication Required',
          'Please log in again to continue.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/(public)/email');
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#febd59" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.firstName && profile.lastName 
              ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
              : profile.email 
                ? profile.email.charAt(0).toUpperCase()
                : '?'}
          </Text>
        </View>
        <Text style={styles.name}>
          {profile.firstName && profile.lastName 
            ? `${profile.firstName} ${profile.lastName}`
            : profile.email || 'User'}
        </Text>
        <Text style={styles.email}>{profile.email || 'Email not provided'}</Text>
        <Text style={styles.role}>{(profile.role || 'ATTENDEE').toUpperCase()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{profile.phone || 'Not provided'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Work Email</Text>
          <Text style={styles.infoValue}>{profile.workEmail || 'Not provided'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{profile.location || 'Not provided'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Company</Text>
          <Text style={styles.infoValue}>{profile.company || 'Not provided'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>{profile.gender || 'Not provided'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Meal Preference</Text>
          <Text style={styles.infoValue}>
            {profile.dietaryRequirements || 'Not provided'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Emergency Contact</Text>
          <Text style={styles.infoValue}>
            {profile.emergencyContact || 'Not provided'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>ID Card</Text>
          <Text style={styles.infoValue}>
            {profile.idDocUrl ? '✅ Uploaded' : '❌ Not uploaded'}
          </Text>
        </View>
      </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(app)/inbox')}
        >
          <Text style={styles.navIcon}>✉️</Text>
          <Text style={styles.navLabel}>Mail</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(app)/schedule')}
        >
          <Text style={styles.navIcon}>🕐</Text>
          <Text style={styles.navLabel}>Schedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#febd59',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#febd59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  topHeader: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a202c',
    letterSpacing: -0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 10,
  },
  header: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#febd59',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#febd59',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 8,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  email: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  role: {
    fontSize: 14,
    color: '#febd59',
    fontWeight: '700',
    letterSpacing: 1.2,
    backgroundColor: 'rgba(254, 189, 89, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    textTransform: 'uppercase',
  },
  section: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 20,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 15,
    color: '#64748b',
    flex: 1,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  infoValue: {
    fontSize: 15,
    color: '#1a202c',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
    letterSpacing: 0.1,
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#febd59',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f59e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  navLabel: {
    fontSize: 13,
    color: '#2d3748',
    fontWeight: '600',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  activeNavLabel: {
    color: '#1a202c',
    fontWeight: '700',
    fontSize: 14,
  },
});
