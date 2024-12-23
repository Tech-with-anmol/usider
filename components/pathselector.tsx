import { View, Text, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import Svg, { Path } from 'react-native-svg';
import {useFonts, DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import * as Splashscreen from 'expo-splash-screen';
import { Audio } from 'expo-av';
import { Link, router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';







Splashscreen.preventAutoHideAsync();

export default function Homescreen() {
      
   
    const backgroundMusic = useRef<Audio.Sound | null>(null);
    const [bgColor2, setBgColor2] = useState('#163431');
    const [bgColor1, setBgColor1] = useState('#255411');
    //const navigation = useNavigation<any>();
    
    const btnn = () => {
      setBgColor1(bgColor1 === '#255411' ? 'transparent' : '#255411');
      //navigation.navigate('Subpathn'); // Ensure correct screen name
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

      if (!loaded && !error) {
        return null;
      }
  
  
  return (
        <View style={styles.container}>
          <Text
            style={{
              fontFamily: 'DMSerifDisplay_400Regular',
              fontSize: 35,
              color: 'white',
              marginTop: 100,
              marginLeft: 150,
            }}
          >
            Paths
          </Text>
          <Svg height="600" width="100%" style={{ position: 'absolute', top: 150 }}>
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
          <Animated.View entering={FadeIn.delay(0).duration(500)}>
          <TouchableOpacity
             onPress={btnn}
             style={{
                  position: 'absolute',
                  top: 307,
                  left: 40,
                  backgroundColor: bgColor1,
                  borderRadius: 30,
                  width: 130,
                  height: 130,
                }} >
                <Image
                    source={require('@/assets/images/nature.png')}
                    style={{
                        width: 130,
                        height: 130,
                        borderColor: '#006666',
                        borderRadius: 30,
                        borderWidth: 1,
                    }}
                />
            </TouchableOpacity>
            </Animated.View>
            <Animated.View entering={FadeIn.delay(0).duration(500)}>
             <TouchableOpacity
                 onPress={btnf}
                 style={{
                     position: 'absolute',
                     top: 307,
                     left: 230,
                     backgroundColor: bgColor2,
                     borderRadius: 30,
                     width: 130,
                     height: 130,
                 }}
             >
                 <Image
                     source={require('@/assets/images/lofi.png')}
                     style={{
                         width: 130,
                         height: 130,
                         borderColor: '#006666',
                         borderRadius: 30,
                         borderWidth: 1,
                     }}
                 />
                    </TouchableOpacity>
                    </Animated.View>
                    <Text style={styles.tiptext}>        
                       💭 : Don't overthink it. Select whatever image resonate with your current mood.
                    </Text>  
                    </View>
  );
}

const styles = StyleSheet.create({
  tiptext: {
    fontFamily: Platform.select({
      ios: 'Poppins-SemiBold',
      android: 'Poppins_600SemiBold'
    }),
    fontSize: 16,
    color: 'white',
    marginTop: 490,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(14, 10, 5)',
    zIndex: 0,
    top: 0,
  },
  icon: {
    width: 24,
    height: 24,
    marginTop: 20,
  }
});
