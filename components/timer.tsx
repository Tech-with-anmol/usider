import { View, Text, StyleSheet, Animated, Platform, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface TimerProps {
  paused: boolean;
  totalDuration: number;
  onUpdate: (time: number) => void;
  onEnd?: () => void; // Optional callback for when the timer ends
}

const Timer: React.FC<TimerProps> = ({ paused, totalDuration, onUpdate, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(totalDuration);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!paused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          onUpdate(newTime);
          if (newTime <= 0) {
            clearInterval(timer);
            if (onEnd) onEnd();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paused, timeLeft, onUpdate, onEnd]);

  useEffect(() => {
    setTimeLeft(totalDuration);
  }, [totalDuration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  timerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  timerText: {
    fontSize: 48,
    color: 'white',
    fontFamily: 'Poppins_500Medium',
  },
});