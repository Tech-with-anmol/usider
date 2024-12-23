import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Timer from '@/components/timer'
import { Ionicons } from '@expo/vector-icons';
import ColorPicker from 'react-native-wheel-color-picker';

type Props = {}

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
        <Timer paused={timerPaused} />
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
  },
  timerControl: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  colorControl: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  revertControl: {
    position: 'absolute',
    top: 50,
    right: 70,
  },
  colorPickerContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})