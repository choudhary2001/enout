import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

interface Attachment {
  name: string;
  url: string;
  type?: string;
  size?: string;
}

interface AttachmentListProps {
  attachments: Attachment[];
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) {
    return null;
  }

  const handleAttachmentPress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening attachment:', error);
    }
  };

  const getFileIcon = (type?: string) => {
    if (type === 'application/pdf') {
      return '📄';
    }
    return '📎';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attachments ({attachments.length})</Text>
      {attachments.map((attachment, index) => (
        <TouchableOpacity
          key={index}
          style={styles.attachmentItem}
          onPress={() => handleAttachmentPress(attachment.url)}
        >
          <View style={styles.attachmentContent}>
            <View style={styles.attachmentInfo}>
              <Text style={styles.attachmentIcon}>
                {getFileIcon(attachment.type)}
              </Text>
              <View style={styles.attachmentDetails}>
                <Text style={styles.attachmentName}>{attachment.name}</Text>
                {attachment.size && (
                  <Text style={styles.attachmentSize}>{attachment.size}</Text>
                )}
              </View>
            </View>
            <Text style={styles.downloadIcon}>⬇️</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  attachmentItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  attachmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  attachmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attachmentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  attachmentDetails: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 15,
    color: '#1a202c',
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  attachmentSize: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  downloadIcon: {
    fontSize: 18,
    marginLeft: 12,
  },
});
