import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Account, OAuthProvider } from 'react-native-appwrite';
import { client } from '../lib/appwrite';
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign for Google icon
import Toast from 'react-native-toast-message';

const SignUpScreen = () => {
    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
    });

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const account = new Account(client);
    const router = useRouter();

    const handleSignUp = async () => {
        if (!email.includes('@')) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter a valid email address',
            });
            return;
        }

        if (password.length < 8) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Password must be at least 8 characters long',
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Passwords do not match',
            });
            return;
        }

        try {
            await account.create('unique()', email, password, name);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Account created successfully. Please verify your email.',
            });
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Error creating account:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: `Failed to create account: ${error}`,
            });
        }
    };


    if (!fontsLoaded) {
        return null; // or a loading spinner
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false}}/>
            <Image 
            source={require('../assets/images/icon.png')}
            style={styles.logo}
            />
            <Text style={styles.title}>Welcome</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#cdd6f4"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#cdd6f4"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#cdd6f4"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#cdd6f4"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
            <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.replace('../sign_in')}>
                    <Text style={styles.signInButton}>Sign in</Text>
                </TouchableOpacity>
            </View>
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e2e',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        color: '#cdd6f4',
        textAlign: 'center',
        marginBottom: 40,
        fontFamily: 'Poppins_600SemiBold',
    },
    input: {
        height: 50,
        backgroundColor: '#313244',
        borderRadius: 8,
        paddingHorizontal: 15,
        color: '#cdd6f4',
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        height: 50,
        backgroundColor: '#f38ba8',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#1e1e2e',
        fontSize: 18,
        fontWeight: '600',
    },
    googleButton: {
        height: 50,
        backgroundColor: '#4285F4',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20,
    },
    googleIcon: {
        marginRight: 10,
    },
    googleButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInText: {
        color: '#cdd6f4',
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 17,
    },
    signInButton: {
        color: '#f38ba8',
        textAlign: 'center',
        marginLeft: 10,
        fontSize: 17,
        fontWeight: '700',
    },
});

export default SignUpScreen;