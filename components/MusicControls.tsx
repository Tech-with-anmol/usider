import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface MusicControlsProps {
  isPlaying: boolean;
  isLooping: boolean;
  handlePausePlay: () => void;
  handleSkip: () => void;
  handleRepeat: () => void;
}

const MusicControls: React.FC<MusicControlsProps> = ({ isPlaying, isLooping, handlePausePlay, handleSkip, handleRepeat }) => {
  return (
    <LinearGradient
      colors={['rgba(0,0,0,0.5)', 'transparent']}
      style={styles.controls}
    >
      <TouchableOpacity onPress={handleRepeat} style={styles.controlButton}>
        <Ionicons name="repeat" size={32} color={isLooping ? "yellow" : "white"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePausePlay} style={styles.controlButton}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSkip} style={styles.controlButton}>
        <Ionicons name="play-skip-forward" size={32} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default MusicControls;

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginBottom: 40,
    padding: 20,
    borderRadius: 50,
    width: '80%',
    marginTop: 40,
  },
  controlButton: {
    marginHorizontal: 10,
  },
});
