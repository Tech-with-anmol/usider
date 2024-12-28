import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Account, OAuthProvider } from 'react-native-appwrite';
import { client } from '../lib/appwrite';
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign for Google icon
import Toast from 'react-native-toast-message';

const SignInScreen = () => {
    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const account = new Account(client);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await account.get();
                if (session) {
                    router.replace('/(tabs)');
                }
            } catch (error) {
                console.log('No active session found');
            }
        };
        checkSession();
    }, []);

    const handleSignIn = async () => {
        if (!email.includes('@')) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter a valid email address',
            });
            return;
        }

        try {
            await account.createEmailPasswordSession(email, password);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Signed in successfully',
            });
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Error signing in:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to sign in',
            });
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await account.createOAuth2Session(OAuthProvider.Google);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Signed in with Google successfully',
            });
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Error signing in with Google:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to sign in with Google',
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
            <Text style={styles.title}>Welcome Back</Text>
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
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                <AntDesign name="google" size={24} color="white" style={styles.googleIcon} />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.replace('../sign_up')}>
                    <Text style={styles.signUpButton}>Sign up</Text>
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
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        color: '#cdd6f4',
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 17,
    },
    signUpButton: {
        color: '#f38ba8',
        textAlign: 'center',
        marginLeft: 10,
        fontSize: 17,
        fontWeight: '700',
    },
});

export default SignInScreen;
