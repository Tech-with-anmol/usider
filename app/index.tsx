import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, Dimensions } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get('window');

const Page = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.btn} onPress={() => router.replace("/(tabs)")}>
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
    paddingBottom: height * 0.05, // Adjust padding based on device height
    paddingHorizontal: width * 0.1, // Adjust padding based on device width
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    color: Colors.white,
    fontSize: width * 0.06, // Responsive font size
    letterSpacing: 1.5,
    lineHeight: width * 0.09, // Responsive line height
    textAlign: 'center',
    fontWeight: '600',
  },
  detailsheadphone: {
    color: '#C0C0C0',
    fontWeight: '500',
    lineHeight: width * 0.05, // Responsive line height
    letterSpacing: 1.2,
    fontSize: width * 0.04, // Responsive font size
    textAlign: 'center',
    marginHorizontal: width * 0.08, // Responsive margin
  },
  btn: {
    backgroundColor: Colors.tint,
    paddingVertical: height * 0.02, // Responsive padding
    marginVertical: height * 0.03, // Responsive margin
    alignItems: 'center',
    borderRadius: 16,
  },
  btntext: {
    fontWeight: '700',
    fontSize: width * 0.04, // Responsive font size
  },
});
