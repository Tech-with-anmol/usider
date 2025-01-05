import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import Onboarding from 'react-native-onboarding-swiper'
import LottieView from 'lottie-react-native'
import { Stack , useRouter} from 'expo-router';
import { useFonts, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height, width} = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
  });

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
      if (hasOnboarded) {
        //router.replace('/load');
      }
    };
    checkOnboarding();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleDone = async (): Promise<void> => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    router.replace('/load');
  }

  const Donebutton = ({...props}) => (
    <TouchableOpacity style={styles.doneButton} {...props}>
      <Text style={styles.doneButtonText}>Done</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style= {styles.container}>
      <Stack.Screen options={{ headerShown: false}}/>
       <Onboarding
       onDone={handleDone}
       onSkip={handleDone}
       DoneButtonComponent={Donebutton}
       containerStyles={{paddingHorizontal: 15}}
       titleStyles={{fontWeight: '600', fontFamily: 'Poppins_500Medium'}}
       subTitleStyles={{fontFamily: 'Poppins_400Regular'}}
         pages={[
           {
             backgroundColor: 'rgba(160, 221, 120, 0.9)',
             image: (
             <View >
                <LottieView
                autoPlay
                loop
                style={{
                  width: width,
                  height: height * 0.5,
                  
                }}
                source={require('../assets/animations/timer.json')}
                />
             </View>
             ), 
             title: 'Relax & Focus',
             subtitle: 'This tool packages all you productivity tools in one',
           },
           {
             backgroundColor: 'rgba(231, 203, 161, 0.9)',
             image: (
             <View>
              <LottieView
                autoPlay
                loop
                style={{
                  width: width,
                  height: height * 0.5,
                }}
                source={require('../assets/animations/boy.json')}
                />
              </View>
              ), 
             title: 'Stats',
             subtitle: 'Get stats & in-depth analysis for your work',
           },
           {
            backgroundColor: 'rgba(199, 176, 230, 0.9)',
            image: (
            <View>
             <LottieView
               autoPlay
               loop
               style={{
                 width: width,
                 height: height * 0.5,
               }}
               source={require('../assets/animations/girl.json')}
               />
             </View>
             ), 
            title: 'Cloud Synced',
            subtitle: 'Work from any device, Everything is fully-cloud synced',
          },
         ]}
       />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  doneButton: {
    padding: 20,
    //backgroundColor: '#000',
    borderRadius: 5,
  },
  doneButtonText: {
    color: '#000',
    fontSize: 16,
  },
});