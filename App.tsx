import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TaskProvider } from './context/TaskContext';
import Icon from 'react-native-vector-icons/Ionicons';

import DashboardScreen from './screens/DashboardScreen';
import TasksScreen from './screens/TasksScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <TaskProvider>
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: string;

            if (route.name === 'Dashboard') {
              iconName = 'home';
            } else if (route.name === 'Tasks') {
              iconName = 'list';
            } else {
              iconName = 'bar-chart';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Tasks" component={TasksScreen} />
          <Tab.Screen name="Analytics" component={AnalyticsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
}