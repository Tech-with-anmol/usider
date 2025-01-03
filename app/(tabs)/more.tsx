import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';

const More = () => {
  const router = useRouter();
  const swingAnim1 = useRef(new Animated.Value(0)).current;
  const swingAnim2 = useRef(new Animated.Value(0)).current;
  const swingAnim3 = useRef(new Animated.Value(0)).current;
  const ropeAnim1 = useRef(new Animated.Value(0)).current;
  const ropeAnim2 = useRef(new Animated.Value(0)).current;
  const ropeAnim3 = useRef(new Animated.Value(0)).current;
 
  const [loaded, error] = useFonts({
     Poppins_500Medium
  })
  useEffect(() => {
    const swing = (anim: Animated.Value) => {
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: -1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => swing(anim));
    };

    const ropeSwing = (anim: Animated.Value) => {
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: -1,
          duration: 8000,
          useNativeDriver: true,
        }),
      ]).start(() => ropeSwing(anim));
    };

    swing(swingAnim1);
    swing(swingAnim2);
    swing(swingAnim3);
    ropeSwing(ropeAnim1);
    ropeSwing(ropeAnim2);
    ropeSwing(ropeAnim3);
  }, [swingAnim1, swingAnim2, swingAnim3, ropeAnim1, ropeAnim2, ropeAnim3]);

  const swingStyle = (anim: Animated.Value) => ({
    transform: [
      {
        rotate: anim.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-5deg', '5deg'],
        }),
      },
    ],
  });

  const ropeStyle = (anim: Animated.Value) => ({
    transform: [
      {
        rotate: anim.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-1deg', '1deg'],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <View style={styles.ropeContainer}>
          <Animated.View style={[styles.rope, ropeStyle(ropeAnim1)]} />
          <Animated.View style={[styles.circleWrapper, swingStyle(swingAnim1)]}>
            <TouchableOpacity style={styles.circle} onPress={() => router.push('../more/stopwatch')}>
              <Ionicons name="stopwatch-outline" size={40} color="#ffffff" />
              <Text style={styles.circleText}>Stopwatch</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <View style={styles.ropeContainer}>
          <Animated.View style={[styles.rope, ropeStyle(ropeAnim2)]} />
          <Animated.View style={[styles.circleWrapper, swingStyle(swingAnim2)]}>
            <TouchableOpacity style={styles.circle} onPress={() => router.push('../more/friends')}>
              <Ionicons name="people-outline" size={40} color="#ffffff" />
              <Text style={styles.circleText}>Friends</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <View style={styles.ropeContainer}>
          <Animated.View style={[styles.rope, ropeStyle(ropeAnim3)]} />
          <Animated.View style={[styles.circleWrapper, swingStyle(swingAnim3)]}>
            <TouchableOpacity style={styles.circle} onPress={() => router.push('../more/to_do')}>
              <Ionicons name="list-outline" size={40} color="#ffffff" />
              <Text style={styles.circleText}>To-Do</Text>
            </TouchableOpacity>
          </Animated.View>
          
        </View>
        
      </View>

      <Text style={styles.tiptext}>📔 : This is intial version of app, so there can be bugs, be sure to report them to us! and lot of features are coming soon!</Text>
    </View>
  );
};

export default More;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#cdd6f4',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  tiptext: {
    color: '#fff',
    fontFamily: Platform.select({
      ios: 'Poppins-Medium',
      android: 'Poppins_500Medium'
    }),
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20

  },
  circleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 50,
  },
  ropeContainer: {
    alignItems: 'center',
    marginTop: -80
  },
  rope: {
    width: 5,
    height: 400,
    backgroundColor: '#fff',
    marginBottom: -50,
  },
  circleWrapper: {
    alignItems: 'center',
    marginTop: 50,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(137, 127, 189, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  circleText: {
    color: '#ffffff',
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  
});