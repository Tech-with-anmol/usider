import React from "react";
import { Text,StyleSheet,ImageBackground, View, TouchableOpacity, Dimensions } from "react-native";
import OnboardingScreen from "./onboarding";
import { Colors } from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";

const {height, width} = Dimensions.get('window');
const Page = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
        <Stack.Screen options={{headerShown:false}}/>
      <StatusBar style="light"/>
      <ImageBackground 
         source={require('../assets/images/backhome.jpg')}
         style={styles.backgroundImage}
         resizeMode="cover"
       >
      <View style={styles.wrapper}>
        <Animated.Text style={styles.title} entering={FadeInRight.delay(300).duration(500)}>Relax & Enjoy!</Animated.Text>
        <Animated.Text style={styles.detailsheadphone} entering={FadeInRight.delay(700).duration(500)}>Tip: if you have headphones then be sure to use it for best experience!</Animated.Text>
        <Animated.View entering={FadeInDown.delay(1200).duration(500)}>
          <TouchableOpacity style={styles.btn} onPress={() => router.replace("../sign_in")}>
            <Text style={styles.btntext}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View> 
      </View>
      </ImageBackground>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    width: width,
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: height * 0.05, 
    paddingHorizontal: width * 0.1, 
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    color: Colors.white,
    fontSize: width * 0.06, 
    letterSpacing: 1.5,
    lineHeight: width * 0.09, 
    textAlign: 'center',
    fontWeight: '600',
  },
  detailsheadphone: {
    color: '#C0C0C0',
    fontWeight: '500',
    lineHeight: width * 0.05, 
    letterSpacing: 1.2,
    fontSize: width * 0.04, 
    textAlign: 'center',
    marginHorizontal: width * 0.08, 
  },
  btn: {
    backgroundColor: Colors.tint,
    paddingVertical: height * 0.02,
    marginVertical: height * 0.03,
    alignItems: 'center',
    borderRadius: 16,
    zIndex: 1, 
  },
  btntext: {
    fontWeight: '700',
    fontSize: width * 0.04, 
  },
});

