
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth
import { colors, layout, styles as globalStyles, typography } from '../styles/global'; // Import global styles

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        try {
            await auth().signInWithEmailAndPassword(email, password);
            navigation.replace('Dashboard'); // Explicitly navigate
        } catch (error: any) {
            Alert.alert('Login Error', error.message);
        }
    };

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password for registration.');
            return;
        }

        try {
            await auth().createUserWithEmailAndPassword(email, password);
            Alert.alert('Registration Successful', 'You have been registered and logged in!');
            navigation.replace('Dashboard'); // Explicitly navigate
        } catch (error: any) {
            Alert.alert('Registration Error', error.message);
        }
    };

    return (
        <View style={globalStyles.container}> {/* Use global container style */}
            <Text style={localStyles.title}>Login / Register</Text>
            <TextInput
                style={localStyles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={localStyles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
                <Text style={globalStyles.buttonText}>Login</Text>
            </TouchableOpacity>
            <View style={localStyles.spacer} />
            <TouchableOpacity style={[globalStyles.button, { backgroundColor: colors.limeGreen }]} onPress={handleRegister}>
                <Text style={globalStyles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
};

const localStyles = StyleSheet.create({
    title: {
        ...globalStyles.headerText,
        textAlign: 'center',
        marginBottom: layout.margin * 2,
    },
    input: {
        ...globalStyles.bodyText,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: layout.borderRadius,
        paddingHorizontal: layout.padding,
        paddingVertical: layout.padding,
        marginBottom: layout.margin,
        color: colors.white,
    },
    spacer: {
        marginVertical: layout.margin / 2,
    },
});

export default LoginScreen;
