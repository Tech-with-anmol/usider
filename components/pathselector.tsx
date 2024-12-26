import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import Svg, { Path } from 'react-native-svg';
import { useFonts, DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import * as Splashscreen from 'expo-splash-screen';
import { Audio } from 'expo-av';
import { Link, router, useFocusEffect } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

Splashscreen.preventAutoHideAsync();

export default function Homescreen() {
      
    const backgroundMusic = useRef<Audio.Sound | null>(null);
    const [bgColor2, setBgColor2] = useState('#163431');
    const [bgColor1, setBgColor1] = useState('#255411');
    
    const btnn = () => {
      setBgColor1(bgColor1 === '#255411' ? 'transparent' : '#255411');
      router.push('../path/2')
    }
    const btnf = () => {
      setBgColor2(bgColor2 === '#163431' ? 'transparent' : '#163431');
      router.push('../path/1')
    }

    const [loaded, error] = useFonts({
        DMSerifDisplay_400Regular,
        Poppins_600SemiBold,
    });
      
    useEffect(() => {
        if(loaded || error) {
          Splashscreen.hideAsync()
        }
    }, [loaded, error]);

    useFocusEffect(
      React.useCallback(() => {
        
        setBgColor1('#255411');
        setBgColor2('#163431');
      }, [])
    );

    if (!loaded && !error) {
        return null;
    }

    const imageSize = width * 0.3; // Adjust the size based on the device width
    const tipTextMarginTop = height * 0.17; // Adjust the margin based on the device height
    const tipTextMarginBottom = height * 0.1; // Add bottom margin to ensure it doesn't overlap with the tab bar
  
    return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Paths</Text>
            <View style={styles.svgWrapper}>
              <Svg
                viewBox="0 0 300 300"
                preserveAspectRatio="xMidYMid meet"
                style={styles.absoluteSvg}
              >
                <Path
                  d="M 195 0 Q 100 150 80 300"
                  stroke="white"
                  strokeWidth="5"
                  fill="none"
                />
                <Path
                  d="M 195 0 Q 300 150 300 300"
                  stroke="white"
                  strokeWidth="5"
                  fill="none"
                />
              </Svg>

              <Animated.View entering={FadeIn.delay(0).duration(500)} style={styles.leftImageWrapper}>
                <TouchableOpacity
                  onPress={btnn}
                  style={[styles.imageButton, { backgroundColor: bgColor1, width: imageSize, height: imageSize }]}
                >
                  <Image
                    source={require('@/assets/images/nature.png')}
                    style={[styles.image, { width: imageSize, height: imageSize }]}
                  />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View entering={FadeIn.delay(0).duration(500)} style={styles.rightImageWrapper}>
                <TouchableOpacity
                  onPress={btnf}
                  style={[styles.imageButton, { backgroundColor: bgColor2, width: imageSize, height: imageSize }]}
                >
                  <Image
                    source={require('@/assets/images/lofi.png')}
                    style={[styles.image, { width: imageSize, height: imageSize }]}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
            <Text style={[styles.tiptext, { marginTop: tipTextMarginTop, marginBottom: tipTextMarginBottom }]}>        
              💭 : Don't overthink it. Select whatever image resonate with your current mood.
            </Text>  
          </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(14, 10, 5)',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 80, // Add padding to ensure tiptext is visible
  },
  title: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 35,
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  svgWrapper: {
    position: 'relative',
    width: '80%',
    alignSelf: 'flex-start',
    marginLeft: 0, 
    height: 300,
    alignItems: 'center',
    marginTop: -5,  
  },
  absoluteSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  leftImageWrapper: {
    position: 'absolute',
    bottom: -50,  
    left: 20,       
  },
  rightImageWrapper: {
    position: 'absolute',
    bottom: -50,
    right: -45,    
  },
  imageButton: {
    borderRadius: 30,
  },
  image: {
    borderColor: '#006666',
    borderRadius: 30,
    borderWidth: 1,
  },
  tiptext: {
    fontFamily: Platform.select({
      ios: 'Poppins-SemiBold',
      android: 'Poppins_600SemiBold'
    }),
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    
  },
});
