import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '../../../src/lib/api';
import { formatTime, formatDate } from '../../../src/lib/time';
import { mockSchedule } from '../../../src/mocks/seeds';

interface SessionDetail {
  id: string;
  start: string;
  end: string;
  title: string;
  location: string;
  notes?: string;
  description?: string;
  imageUrl?: string;
}

export default function SessionDetailScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  const loadSession = async () => {
    try {
      // Find the session in the mock schedule
      const scheduleSession = mockSchedule.find(s => s.id === sessionId);
      
      if (!scheduleSession) {
        throw new Error('Session not found');
      }

      // Get appropriate image and description based on session type
      const getSessionDetails = (session: any) => {
        const sessionImages: { [key: string]: string } = {
          'session-1': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop', // Resort
          'session-2': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop', // Breakfast
          'session-3': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop', // Conference
          'session-4': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop', // Lunch
          'session-5': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', // Beach volleyball
          'session-6': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', // Beach activities
          'session-7': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', // Sunset cruise
          'session-8': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', // Yoga
          'session-9': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop', // Breakfast
          'session-10': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', // Island hopping
          'session-11': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', // Island lunch
          'session-12': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', // Snorkeling
          'session-13': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', // Return journey
          'session-14': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', // Cooking class
          'session-15': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', // Beach walk
          'session-16': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop', // Breakfast
          'session-17': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', // Temple visit
          'session-18': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop', // Local lunch
          'session-19': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop', // Reflection
          'session-20': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop', // Departure
        };

        const sessionDescriptions: { [key: string]: string } = {
          'session-1': 'Welcome to the beautiful Brevo Resort Phuket! Check in to your comfortable accommodations and get ready for an amazing 3-day offsite experience. Our resort offers stunning ocean views and world-class amenities.',
          'session-2': 'Start your day with a delicious traditional Thai breakfast while meeting your fellow Brevo team members. This is the perfect opportunity to connect and build relationships in a relaxed setting.',
          'session-3': 'Join us for an important session where we\'ll discuss Brevo\'s vision, goals, and strategic direction. This is a great opportunity to align as a team and understand our collective mission.',
          'session-4': 'Enjoy a relaxing lunch with stunning ocean views at our beachfront restaurant. Take this time to unwind and prepare for the exciting afternoon activities ahead.',
          'session-5': 'Get ready for some friendly competition! Our beach volleyball tournament is designed to build teamwork, communication, and camaraderie while having fun in the sun.',
          'session-6': 'Take some time to relax and enjoy the beautiful Phuket beach. Swim in the crystal-clear waters, play beach games, or simply soak up the sun and tropical atmosphere.',
          'session-7': 'End your first day with a magical sunset dinner cruise. Enjoy delicious Thai cuisine while watching the sun set over the Andaman Sea - a truly unforgettable experience.',
          'session-8': 'Start your second day with a peaceful yoga and meditation session on the beach. This mindful beginning will help you feel centered and ready for the day\'s adventures.',
          'session-9': 'Fuel up with a hearty breakfast while we go over the day\'s exciting agenda. Today we\'ll be exploring the famous Phi Phi Islands - one of Thailand\'s most beautiful destinations.',
          'session-10': 'Embark on an incredible island hopping adventure to the world-famous Phi Phi Islands. These stunning islands offer pristine beaches, crystal-clear waters, and breathtaking natural beauty.',
          'session-11': 'Enjoy a fresh seafood lunch on Phi Phi Don island. This is a perfect opportunity to relax and take in the incredible island scenery while enjoying authentic Thai cuisine.',
          'session-12': 'Dive into the crystal-clear waters of Maya Bay for an unforgettable snorkeling experience. Discover the vibrant marine life and coral reefs that make this area world-famous.',
          'session-13': 'Return to Phuket by speedboat, enjoying beautiful sunset views over the Andaman Sea. This scenic journey is the perfect end to an amazing day of island exploration.',
          'session-14': 'Learn to cook authentic Thai cuisine in our hands-on cooking class. Work together as a team to create delicious traditional dishes while learning about Thai culinary culture.',
          'session-15': 'Start your final day with a peaceful morning walk along the beach. This quiet time allows for reflection on the amazing experiences we\'ve shared together.',
          'session-16': 'Enjoy your final breakfast at the resort while we discuss the day\'s activities and departure information. Make sure to savor every moment of this last day together.',
          'session-17': 'Visit the iconic Big Buddha Temple, one of Phuket\'s most sacred and beautiful landmarks. Learn about Thai Buddhist culture and enjoy panoramic views of the island.',
          'session-18': 'Experience authentic Thai cuisine in the historic Phuket Old Town. This charming area is known for its beautiful Sino-Portuguese architecture and delicious local food.',
          'session-19': 'Come together for a meaningful reflection session where we\'ll discuss our experiences, share insights, and plan for the future. This is a time to celebrate our team\'s growth and connection.',
          'session-20': 'As our amazing offsite comes to an end, we\'ll gather for final goodbyes and prepare for departure. Thank you for being part of this unforgettable Brevo Phuket Offsite experience!',
        };

        return {
          imageUrl: sessionImages[session.id] || 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=300&fit=crop',
          description: sessionDescriptions[session.id] || 'Join us for this exciting session during the Brevo Phuket Offsite!'
        };
      };

      const { imageUrl, description } = getSessionDetails(scheduleSession);

      const sessionDetail: SessionDetail = {
        id: scheduleSession.id,
        start: scheduleSession.start,
        end: scheduleSession.end,
        title: scheduleSession.title,
        location: scheduleSession.location,
        notes: scheduleSession.notes,
        description: description,
        imageUrl: imageUrl,
      };
      
      setSession(sessionDetail);
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#febd59" />
        <Text style={styles.loadingText}>Loading session details...</Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Session not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back to Schedule</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Event Overview Card */}
        <View style={styles.eventCard}>
          <View style={styles.eventImageContainer}>
            <Image
              source={{ uri: session.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop' }}
              style={styles.eventImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.eventDetails}>
            <Text style={styles.eventTitle}>{session.title}</Text>
            <Text style={styles.eventDate}>{formatDate(session.start)}</Text>
            <Text style={styles.eventTime}>{formatTime(session.start)} - {formatTime(session.end)}</Text>
            <Text style={styles.eventHost}>Hosted By Enout</Text>
          </View>
        </View>

        {/* About the Event */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Event</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>
              {session.description || 'Join us for an amazing session that will provide valuable insights and networking opportunities.'}
            </Text>
          </View>
        </View>

        {/* Session Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Details</Text>
          <View style={styles.sectionContent}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duration:</Text>
              <Text style={styles.detailValue}>1 hour</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{session.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type:</Text>
              <Text style={styles.detailValue}>Keynote Session</Text>
            </View>
            {session.notes && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Notes:</Text>
                <Text style={styles.detailValue}>{session.notes}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Location Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.sectionContent}>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapText}>📍 {session.location}</Text>
              <Text style={styles.mapSubtext}>Interactive map would be displayed here</Text>
            </View>
            <TouchableOpacity style={styles.locationButton}>
              <Text style={styles.locationButtonText}>View Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: '#febd59',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#febd59',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  backButtonIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginRight: 44, // Compensate for back button width
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  eventImageContainer: {
    width: 100,
    height: 80,
    marginRight: 16,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  eventDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  eventDate: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  eventHost: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  sectionContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailLabel: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: '#1a202c',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  mapPlaceholder: {
    backgroundColor: '#f1f5f9',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  mapText: {
    fontSize: 16,
    color: '#1a202c',
    fontWeight: '600',
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  locationButton: {
    backgroundColor: '#febd59',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#febd59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
