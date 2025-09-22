import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function InviteScreen() {
  const handleAccept = () => {
    // In a real app, this would accept the invitation and navigate to the event details
    router.replace('/');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Event Invitation</Text>
        <Text style={styles.eventName}>Tech Conference 2023</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoValue}>September 25-27, 2023</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={styles.infoValue}>San Francisco Convention Center</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Invited by:</Text>
          <Text style={styles.infoValue}>Jane Smith</Text>
        </View>
        
        <Text style={styles.description}>
          Join us for three days of inspiring talks, workshops, and networking opportunities.
        </Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.declineButton}>
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#F9B24E',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  declineButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  declineButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#F9B24E',
    paddingVertical: 15,
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
