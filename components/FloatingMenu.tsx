import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = new Animated.Value(0);
  const router = useRouter();

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const handleNavigation = (route: string) => {
    toggleMenu();
    router.push(route as any);
  };

  const branch1Style = {
    transform: [
      { translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -80] }) },
      { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -80] }) },
    ],
  };

  const branch2Style = {
    transform: [
      { translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [0, 0] }) },
      { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -110] }) },
    ],
  };

  const branch3Style = {
    transform: [
      { translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [0, 80] }) },
      { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -80] }) },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.branch, branch1Style]}>
        <TouchableOpacity style={styles.circle} onPress={() => handleNavigation('/stopwatch')}>
          <Ionicons name="stopwatch-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.branch, branch2Style]}>
        <TouchableOpacity style={styles.circle} onPress={() => handleNavigation('/friends')}>
          <Ionicons name="people-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.branch, branch3Style]}>
        <TouchableOpacity style={styles.circle} onPress={() => handleNavigation('/to_do')}>
          <Ionicons name="list-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity style={styles.mainButton} onPress={toggleMenu}>
        <Ionicons name={isOpen ? "close" : "ellipsis-horizontal"} size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingMenu;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    alignItems: 'center',
  },
  branch: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#88C0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4C566A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
