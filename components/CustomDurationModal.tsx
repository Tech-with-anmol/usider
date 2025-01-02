import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface CustomDurationModalProps {
  isVisible: boolean;
  customDuration: string;
  setCustomDuration: (duration: string) => void;
  handleCustomDurationSave: () => void;
  setCustomDurationModalVisible: (visible: boolean) => void;
}

const CustomDurationModal: React.FC<CustomDurationModalProps> = ({ isVisible, customDuration, setCustomDuration, handleCustomDurationSave, setCustomDurationModalVisible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setCustomDurationModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Enter duration in minutes"
            placeholderTextColor="#cdd6f4"
            keyboardType="numeric"
            value={customDuration}
            onChangeText={setCustomDuration}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleCustomDurationSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomDurationModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#cdd6f4',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#cdd6f4',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#88C0D0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: '#2E3440',
    fontFamily: 'Poppins_500Medium',
  },
});
