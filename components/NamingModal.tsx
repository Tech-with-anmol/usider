import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Toast from 'react-native-toast-message';

interface NamingModalProps {
  isVisible: boolean;
  timerName: string;
  setTimerName: (name: string) => void;
  setIsNaming: (isNaming: boolean) => void;
  setTotalDuration: (duration: number) => void;
  setCurrentTimerTime: (time: number) => void;
  handleCustomDuration: () => void;
}

const NamingModal: React.FC<NamingModalProps> = ({ isVisible, timerName, setTimerName, setIsNaming, setTotalDuration, setCurrentTimerTime, handleCustomDuration }) => {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const handleSave = () => {
    if (!timerName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Timer name cannot be empty',
      });
      return;
    }
    if (selectedDuration !== null) {
      setTotalDuration(selectedDuration);
      setCurrentTimerTime(selectedDuration);
    }
    setIsNaming(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsNaming(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="What work you will be doing?"
            placeholderTextColor="#cdd6f4"
            value={timerName}
            onChangeText={setTimerName}
          />
          <Text style={styles.durationText}>Select Duration:</Text>
          <View style={styles.durationOptions}>
            <TouchableOpacity style={[styles.durationButton, selectedDuration === 15 * 60 && styles.selectedButton]} onPress={() => setSelectedDuration(15 * 60)}>
              <Text style={styles.durationButtonText}>15 Minutes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.durationButton, selectedDuration === 30 * 60 && styles.selectedButton]} onPress={() => setSelectedDuration(30 * 60)}>
              <Text style={styles.durationButtonText}>30 Minutes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.durationButton, selectedDuration === 60 * 60 && styles.selectedButton]} onPress={() => setSelectedDuration(60 * 60)}>
              <Text style={styles.durationButtonText}>60 Minutes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.durationButton, selectedDuration && ![15 * 60, 30 * 60, 60 * 60].includes(selectedDuration) ? styles.selectedButton : null]} onPress={handleCustomDuration}>
              <Text style={styles.durationButtonText}>Custom</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.savebtn} onPress={handleSave}>
            <Text style={styles.savebtntxt}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NamingModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 54, 54, 0.16)',
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
  durationText: {
    color: '#cdd6f4',
    marginBottom: 10,
  },
  durationOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  durationButton: {
    backgroundColor: '#88C0D0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '22%',
  },
  selectedButton: {
    backgroundColor: '#5E81AC',
  },
  durationButtonText: {
    color: '#2E3440',
    fontFamily: 'Poppins_500Medium',
  },
  savebtn: {
    backgroundColor: '#88C0D0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  savebtntxt: {
    color: '#2E3440',
    fontFamily: 'Poppins_500Medium',
  },
});
