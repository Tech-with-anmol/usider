import { StyleSheet, Text, View } from 'react-native'
import React from 'react'


type Props = {}

const Page = (props: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.coming}>Coming Soon! - Get all your timer data here, along with many new features.</Text>
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgb(0, 0, 0)'
  },
  coming : {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
  }
})