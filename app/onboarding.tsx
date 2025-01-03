import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper'
 
export default function OnboardingScreen() {
  return (
    <View style= {styles.container}>
       <Onboarding
         pages={[
           {
             backgroundColor: '#fff',
             image: (
             <View>
                <Text>Hello Onboding</Text>
             </View>
             ), // Replace with your image component
             title: 'Onboarding 1',
             subtitle: 'Description 1',
           },
           {
             backgroundColor: '#fff',
             image: <View />, // Replace with your image component
             title: 'Onboarding 2',
             subtitle: 'Description 2',
           },
         ]}
       />
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: '#fff'
    }
})