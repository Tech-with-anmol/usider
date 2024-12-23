import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { WebView } from 'react-native-webview';

const Settingsnav = () => {
    const {id} = useLocalSearchParams<{id : string}>();

    const renderContents = () => {
        switch(id) {
            case '1':
                return (
                    <View style={styles.contactContainer}>
                        <Text style={styles.contactText}>Greetings, thanks for using the app :)</Text>
                        <Text style={styles.contactEmail}>This is early version of app and so many feautures are yet to be added</Text>
                        <Text style={styles.contactNote}>⛈️ : You can contact me through send feedback option</Text>
                    </View>
                );
            case '2':
                return (
                    <View style={styles.contactContainer}>
                        <Text style={styles.contactText}>Drop me your suggestions at:</Text>
                        <Text style={styles.contactEmail}>📧 : anmollklfh@gmail.com</Text>
                        <Text style={styles.contactNote}>💡 : I will try to reply to your email asap.</Text>
                    </View>
                );
            case '3':
                return <WebView source={{ uri: 'https://docs.google.com/document/d/1-11q62gqdJ4W0MRx61Jc-8V2wANymdVLgdzEqBOMNDg/edit?usp=sharing' }} style={{ flex: 1 }} />;
            case '4':
                return (
                    <View style={styles.contactContainer}>
                        <Text style={styles.features}>Upcoming Features</Text>
                        <Text style={styles.contactText}>ETA : End of January with exception for some features</Text>
                        <View style={styles.listContainer}>
                          <Text style={styles.listItem}>1. Stats for your timer and usage</Text>
                          <Text style={styles.listItem}>2. Custom path</Text>
                          <Text style={styles.listItem}>3. Your own background and music</Text>
                          <Text style={styles.listItem}>4. AI generated path</Text>
                          <Text style={styles.listItem}>5. Chart for timer and in-depth analysis</Text>
                          <Text style={styles.listItem}>6. Tagging for each timer to organize it</Text>
                          <Text style={styles.listItem}>7. And many more</Text>
                        </View>
                    </View>
                );
            default:
                return <Text>Invalid ID</Text>;
        }
    } 

    return(
        <View style={{ flex: 1, backgroundColor: '#1e1e2e' }}>
        <Stack.Screen options={{headerShown: false}}/>
        {renderContents()}
        </View>
    )
}

export default Settingsnav;

const styles = StyleSheet.create({
  contactContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1e1e2e',
  },
  contactText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#cdd6f4'
  },
  features: {
     fontSize: 25,
     color: '#f5c2e7',
     paddingBottom: 30,
     fontWeight: '600'
  },
  contactEmail: {
    fontSize: 16,
    color: '#f5c2e7',
    marginBottom: 10,
    textAlign: 'center',
  },
  contactNote: {
    fontSize: 16,
    textAlign: 'center',
    color: '#cdd6f4'
  },
  listContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  listItem: {
    fontSize: 16,
    color: '#cdd6f4',
    marginBottom: 10,
  },
});
