import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Linking } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Account } from 'react-native-appwrite';
import { client } from '@/lib/appwrite';
import Toast from 'react-native-toast-message';

const Settingsnav = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const account = new Account(client);
    const [feedback, setFeedback] = useState('');

    const handleLogout = async () => {
        try {
            await account.deleteSession('current');
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Logged out successfully',
            });
            router.replace('/sign_in');
        } catch (error) {
            console.error('Error logging out:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to log out',
            });
        }
    };

    const handleSendFeedback = () => {
        const email = 'mr.curious1st@gmail.com';
        const subject = 'App Feedback';
        const body = feedback;
        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.openURL(mailtoUrl)
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: 'Feedback Sent',
                    text2: 'Thank you for your feedback!',
                });
                setFeedback('');
            })
            .catch((error) => {
                console.error('Error sending feedback:', error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to send feedback',
                });
            });
    };

    const renderContents = () => {
        switch (id) {
            case '1':
                return (
                    <View style={styles.contactContainer}>
                        <Text style={styles.contactText}>Greetings, thanks for using the app :)</Text>
                        <Text style={styles.contactEmail}>This is early version of app and so many features are yet to be added</Text>
                        <Text style={styles.contactNote}>⛈️ : You can contact me through send feedback option</Text>
                    </View>
                );
            case '2':
                return (
                    <View style={styles.contactContainer}>
                        <Text style={styles.contactText}>We value your feedback!</Text>
                        <Text></Text>
                        <TextInput
                            style={styles.feedbackInput}
                            placeholder="Write your feedback here..."
                            placeholderTextColor="#888"
                            value={feedback}
                            onChangeText={setFeedback}
                            multiline
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSendFeedback}>
                            <Text style={styles.sendButtonText}>Send Feedback</Text>
                        </TouchableOpacity>
                    </View>
                );
            case '3':
                return <WebView source={{ uri: 'https://docs.google.com/document/d/1-11q62gqdJ4W0MRx61Jc-8V2wANymdVLgdzEqBOMNDg/edit?usp=sharing' }} style={{ flex: 1 }} />;
            case '4':
                return (
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.contactContainer}>
                            <Text style={styles.features}>Upcoming Features</Text>
                            <Text style={styles.contactText}>ETA : End of January with exception for some features</Text>
                            <View style={styles.listContainer}>
                                <Text style={styles.listItem}>1. Custom path</Text>
                                <Text style={styles.listItem}>2. Your own background and music</Text>
                                <Text style={styles.listItem}>3. AI generated path</Text>
                                <Text style={styles.listItem}>4. And many more</Text>
                            </View>
                        </View>
                    </ScrollView>
                );
            case '5':
                return (
                    <View style={styles.contactContainer}>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Text style={styles.logoutButtonText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return <Text>Invalid ID</Text>;
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#1e1e2e' }}>
          <Stack.Screen options={{ headerShown: false}}/>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={32} color="white" />
            </TouchableOpacity>
            {renderContents()}
            <Toast />
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: 10,
    marginTop: Platform.OS === 'ios' ? 70 : 10
  },
  logoutButton: {
    backgroundColor: '#f38ba8',
    padding: 15,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#1e1e2e',
    fontSize: 18,
    fontWeight: '600',
  },
  feedbackInput: {
    width: '100%',
    height: 150,
    backgroundColor: '#3B4252',
    color: '#D8DEE9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#88C0D0',
    padding: 15,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#2E3440',
    fontSize: 18,
    fontWeight: '600',
  },
});
