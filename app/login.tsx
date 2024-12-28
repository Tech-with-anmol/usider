import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack } from 'expo-router/stack'

const LoginScreen = () => {
    return (
        
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false}}/>
            
            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#888"
                secureTextEntry
            />
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        height: 50,
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        paddingHorizontal: 10,
        color: '#fff',
        marginBottom: 20,
    },
    button: {
        height: 50,
        backgroundColor: '#6200ee',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    forgotPassword: {
        color: '#6200ee',
        textAlign: 'center',
        marginTop: 10,
    },
   
});

export default LoginScreen;