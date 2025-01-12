import { View, Text, StyleSheet, Animated, Platform, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface StopwatchProps {
  paused: boolean;
}

export default function Stopwatch({ paused}: StopwatchProps) {
  const [time, setTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const animatedSeconds = useRef(new Animated.Value(0)).current;
  const animatedMinutes = useRef(new Animated.Value(0)).current;
  const animatedHours = useRef(new Animated.Value(0)).current;

  useFonts({Poppins_600SemiBold})
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setTime(prevTime => {
        const newTime = prevTime + 1;
        Animated.timing(animatedSeconds, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          animatedSeconds.setValue(0);
        });
        if (newTime % 60 === 0) {
          Animated.timing(animatedMinutes, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            animatedMinutes.setValue(0);
          });
        }
        if (newTime % 3600 === 0) {
          Animated.timing(animatedHours, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            animatedHours.setValue(0);
          });
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showControls]);

  const handleScreenTap = () => {
    setShowControls(true);
  };

  const formatTime = (time: number) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(time);

  const flipAnimationSeconds = animatedSeconds.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  const flipAnimationMinutes = animatedMinutes.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  const flipAnimationHours = animatedHours.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  const handleRestart = () => {
    setTime(0);
  };

  return (
      <TouchableOpacity style={styles.container} onPress={handleScreenTap}>
        <View style={styles.flipContainer}>
          <View style={styles.flipCardContainer}>
            <Animated.View style={[styles.flipCard, { transform: [{ rotateX: flipAnimationHours }] }]}>
              <Text style={styles.digistyle}>{hours}</Text>
            </Animated.View>
          </View>
          <Text style={styles.separatorstyle}>:</Text>
          <View style={styles.flipCardContainer}>
            <Animated.View style={[styles.flipCard, { transform: [{ rotateX: flipAnimationMinutes }] }]}>
              <Text style={styles.digistyle}>{minutes}</Text>
            </Animated.View>
          </View>
          <Text style={styles.separatorstyle}>:</Text>
          <View style={styles.flipCardContainer}>
            <Animated.View style={[styles.flipCard, { transform: [{ rotateX: flipAnimationSeconds }] }]}>
              <Text style={styles.digistyle}>{seconds}</Text>
            </Animated.View>
          </View>
        </View>
        {showControls && (
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Ionicons name="refresh" size={32} color="white" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(214, 192, 179, 0.2)', 
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    margin: 20, 
  },
  digistyle: {
    color: '#fff',
    fontSize: width * 0.15, 
    borderRadius: 5,
    width: width * 0.2, 
    textAlign: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: 'rgba(171, 136, 109, 0.4)', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    fontFamily: Platform.select({
      ios: 'Poppins-SemiBold',
      android: 'Poppins_600SemiBold'
    })
  },
  separatorstyle: {
    color: '#000',
    fontSize: width * 0.15, 
    marginHorizontal: 10,
  },
  flipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  flipCardContainer: {
    width: width * 0.2,
    height: width * 0.25,
    transform: [{ perspective: 1000 }],
  },
  flipCard: {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
    transformOrigin: '50% 50%',
  },
  restartButton: {
    marginTop: 20,
  },
})
