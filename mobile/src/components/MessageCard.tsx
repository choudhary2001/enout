import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatRelativeTime } from '../lib/time';

interface MessageCardProps {
  id: string;
  subject: string;
  snippet: string;
  sentAt: string;
  unread: boolean;
  attachmentsCount: number;
  onPress: (id: string) => void;
}

export function MessageCard({
  id,
  subject,
  snippet,
  sentAt,
  unread,
  attachmentsCount,
  onPress,
}: MessageCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, unread && styles.unreadContainer]}
      onPress={() => onPress(id)}
    >
      <View style={styles.header}>
        <Text style={[styles.subject, unread && styles.unreadText]} numberOfLines={1}>
          {subject}
        </Text>
        <Text style={styles.time}>{formatRelativeTime(sentAt)}</Text>
      </View>
      
      <Text style={styles.snippet} numberOfLines={2}>
        {snippet}
      </Text>
      
      {attachmentsCount > 0 && (
        <View style={styles.attachmentBadge}>
          <Text style={styles.attachmentText}>
            📎 {attachmentsCount} attachment{attachmentsCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}
      
      {unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadContainer: {
    borderLeftColor: '#F9B24E',
    backgroundColor: '#fffbf5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subject: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  snippet: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  attachmentBadge: {
    alignSelf: 'flex-start',
  },
  attachmentText: {
    fontSize: 12,
    color: '#F9B24E',
    fontWeight: '500',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F9B24E',
  },
});
