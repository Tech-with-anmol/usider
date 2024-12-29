import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import ColorPicker from 'react-native-wheel-color-picker';
import Stopwatch from '@/components/stopwatch';

type Props = {}

const { width, height } = Dimensions.get('window');

const Page = (props: Props) => {
  const [timerPaused, setTimerPaused] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('rgb(179, 151, 110)');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [originalColor] = useState('rgb(179, 151, 110)');

  const handleTimerPause = () => {
    setTimerPaused(!timerPaused);
  };

  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  const handleRevertColor = () => {
    setBackgroundColor(originalColor);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity style={styles.timerControl} onPress={handleTimerPause}>
        <Ionicons name={timerPaused ? "play" : "pause"} size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.colorControl} onPress={() => setShowColorPicker(!showColorPicker)}>
        <Ionicons name="color-palette" size={32} color="white" />
      </TouchableOpacity>
      {showColorPicker && (
        <View style={styles.colorPickerContainer}>
          <ColorPicker
            color={backgroundColor}
            onColorChange={handleColorChange}
          />
        </View>
      )}
      <TouchableOpacity style={styles.revertControl} onPress={handleRevertColor}>
        <Ionicons name="refresh" size={32} color="white" />
      </TouchableOpacity>
      <View style={styles.timerContainer}>
        <Stopwatch paused={timerPaused} />
      </View>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20, // add padding to create gaps
    borderRadius: 10, // add border radius for rounded corners
  },
  timerControl: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
  },
  colorControl: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.05,
  },
  revertControl: {
    position: 'absolute',
    top: height * 0.05,
    right: width * 0.2,
  },
  colorPickerContainer: {
    position: 'absolute',
    bottom: height * 0.1,
    width: '100%',
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})