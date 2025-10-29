import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

interface UploadIdCardProps {
  onFileSelected: (file: any) => void;
  isUploading?: boolean;
  uploadedFileName?: string;
  onContinue?: () => void;
}

const ID_TYPES = [
  { value: 'aadhar', label: 'Aadhar Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'driving_license', label: 'Driving License' },
  { value: 'voter_id', label: 'Voter ID' },
];

export function UploadIdCard({ onFileSelected, isUploading, uploadedFileName, onContinue }: UploadIdCardProps) {
  const [selectedIdType, setSelectedIdType] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isPickingDocument, setIsPickingDocument] = useState(false);

  const handlePickDocument = async () => {
    if (isPickingDocument || isUploading) {
      return;
    }

    try {
      setIsPickingDocument(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
        onFileSelected(file);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    } finally {
      setIsPickingDocument(false);
    }
  };

  const handleTakePhoto = async () => {
    if (isPickingDocument || isUploading) {
      return;
    }

    try {
      setIsPickingDocument(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          name: `id_photo_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: asset.fileSize,
        };
        setSelectedFile(file);
        onFileSelected(file);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsPickingDocument(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedIdType) {
      Alert.alert('Error', 'Please select an ID type');
      return;
    }
    if (!selectedFile) {
      Alert.alert('Error', 'Please upload a photo or select a file');
      return;
    }

    // Call the parent's continue handler to navigate
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your ID Document 🪪</Text>

      <Text style={styles.disclaimer}>
        We need to verify your identity for the event. Choose your preferred ID type and upload a clear photo. Your information is encrypted and secure.
      </Text>

      {/* ID Type Dropdown */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDropdown(true)}
        >
          <Text style={[styles.dropdownText, selectedIdType && styles.dropdownTextSelected]}>
            {selectedIdType ? ID_TYPES.find(type => type.value === selectedIdType)?.label : 'Choose ID Type'}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* File Upload Area */}
      <TouchableOpacity
        style={[styles.uploadArea, selectedFile && styles.uploadAreaSelected]}
        onPress={handlePickDocument}
        disabled={isUploading || isPickingDocument}
      >
        <Text style={styles.uploadIcon}>📄</Text>
        <Text style={styles.uploadText}>
          {isPickingDocument ? 'Opening file picker...' : selectedFile ? '✅ File Ready!' : 'Tap to select file'}
        </Text>
      </TouchableOpacity>

      {/* Separator */}
      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>or</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Camera Button */}
      <TouchableOpacity
        style={[styles.cameraButton, (isUploading || isPickingDocument) && styles.buttonDisabled]}
        onPress={handleTakePhoto}
        disabled={isUploading || isPickingDocument}
      >
        <Text style={styles.cameraIcon}>📷</Text>
        <Text style={styles.cameraText}>Take Photo with Camera</Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.continueButton, isUploading && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={isUploading}
      >
        <Text style={styles.continueButtonText}>
          {isUploading ? 'Uploading...' : 'Continue to Next Step'}
        </Text>
      </TouchableOpacity>

      {/* ID Type Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              {ID_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedIdType(type.value);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'left',
    letterSpacing: -0.5,
  },
  disclaimer: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
    lineHeight: 24,
    fontWeight: '500',
  },
  dropdownContainer: {
    marginBottom: 28,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '500',
  },
  dropdownTextSelected: {
    color: '#1e293b',
    fontWeight: '600',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: 'bold',
  },
  uploadArea: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#fbbf24',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  uploadAreaSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
    shadowColor: '#10b981',
  },
  uploadIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  separatorLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2e8f0',
  },
  separatorText: {
    marginHorizontal: 20,
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cameraButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cameraIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  cameraText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  continueButton: {
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 24,
    maxHeight: 400,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  dropdownItem: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
});
