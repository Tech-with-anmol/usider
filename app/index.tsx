import { StyleSheet, Text, TouchableOpacity, View, ImageBackground} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";

const Page = () => {
  const router = useRouter();

  return (

    <View style={styles.container}>
      <StatusBar style="light"/>
      <ImageBackground 
         source={require('../assets/images/backhome.jpg')}
         style={{flex:1, width: 430 }}
         resizeMode="cover"
       >
      <View style={styles.wrapper}>
      <Animated.Text style={styles.title} entering={FadeInRight.delay(300).duration(500)}>Relax & Enjoy!</Animated.Text>
      <Animated.Text style={styles.detailsheadphone} entering={FadeInRight.delay(700).duration(500)}>Tip: if you have headphones then be sure to use it for best exprience!</Animated.Text>
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
  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 40,
    paddingHorizontal:30,
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    color: Colors.white,
    fontSize: 24,
    letterSpacing: 1.5,
    lineHeight:36,
    textAlign:'center',
    fontWeight: '600',
  },
  detailsheadphone: {
    color: '#C0C0C0',
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 1.2,
    fontSize: 16,
    textAlign: 'center',
    marginLeft: 13,
    marginRight: 13,
  },
  btn: {
    backgroundColor: Colors.tint,
    paddingVertical: 15,
    marginVertical: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  btntext: {
    fontWeight: '700',
    fontSize: 16,
  },
});
