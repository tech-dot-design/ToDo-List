import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskProvider } from './context/TaskContext';
// import Icon from 'react-native-vector-icons/Ionicons'; // No longer needed
import { View, StyleSheet, Text } from 'react-native';
import '@react-native-firebase/app';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth
import { colors, typography } from './styles/global'; // Import global styles

import DashboardScreen from './screens/DashboardScreen';
import TasksScreen from './screens/TasksScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import LoginScreen from './screens/LoginScreen';

// const Tab = createBottomTabNavigator(); // No longer needed
const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null); // Keep user state for tracking authentication status

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    console.log('Auth state changed:', user ? user.uid : 'Logged out');
    setUser(user);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <TaskProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{
          headerStyle: {
            backgroundColor: colors.deepCharcoal,
            borderBottomWidth: 1,
            borderBottomColor: colors.glassBorder,
          },
          headerTintColor: colors.white, // Color for back button and title
          headerTitleStyle: {
            fontFamily: typography.primary,
            fontWeight: typography.heavy,
            fontSize: 20,
          },
        }}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Tasks" component={TasksScreen} options={{ title: 'My Tasks' }} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
}