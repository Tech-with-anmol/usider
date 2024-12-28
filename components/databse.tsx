import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { styles } from '@/app/path/[id]'

export default function () {

  const [timerName, setTimerName] = useState('');
  const [isNaming, setIsNaming] = useState(true);
  
  return (
    <View>
      <TextInput
       style={styles.input}
       placeholder="What work you will be doing?"
       placeholderTextColor="#aaa"
       value={timerName}
       onChangeText={setTimerName}
       ></TextInput>
       <TouchableOpacity style={styles.savebtn}>
         <Text style={styles.savebtntxt}>Save</Text>
       </TouchableOpacity>   
    </View>
  )
}