import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'


type Props = {}

const Page = (props: Props) => {

  const btn1 = () => {
    router.push('../setting/1')
  }
  const btn2= () => {
    router.push('../setting/2')
  }
  const btn3= () => {
    router.push('../setting/3')
  }
  const btn4= () => {
    router.push('../setting/4')
  }
  const btn5= () => {
    router.push('../setting/5')
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown : false}}/>
      <TouchableOpacity onPress={btn1} style={styles.itembtn}>
      <Text style ={styles.itembtntxt}>About</Text>
      <MaterialIcons
      name='arrow-forward-ios'
      color='#fff'/>
      </TouchableOpacity>
      <TouchableOpacity onPress={btn2} style={styles.itembtn}>
      <Text style ={styles.itembtntxt}>Send feedback</Text>
      <MaterialIcons
      name='arrow-forward-ios'
      color='#fff'/>
      </TouchableOpacity>
      <TouchableOpacity onPress={btn3} style={styles.itembtn}>
      <Text style ={styles.itembtntxt}>Privacy policy</Text>
      <MaterialIcons
      name='arrow-forward-ios'
      color='#fff'/>
      </TouchableOpacity>
      <TouchableOpacity onPress={btn4} style={styles.itembtn}>
      <Text style ={styles.itembtntxt}>Upcoming feautres</Text>
      <MaterialIcons
      name='arrow-forward-ios'
      color='#fff'/>
      </TouchableOpacity>
      <TouchableOpacity onPress={btn5} style={styles.itembtn}>
      <Text style ={styles.itembtntxt}>Log Out</Text>
      <MaterialIcons
      name='arrow-forward-ios'
      color='#fff'/>
      </TouchableOpacity>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(7, 3, 0, 0.99)',
    paddingTop: 30,
  },
  itembtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(44, 43, 40, 0.99)',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 15
  },
  itembtntxt : {
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
  },
  backButton: {
    marginLeft: 10,
    marginTop: 10,
  },
})