import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '../context/TaskContext';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth
import { colors, layout, styles as globalStyles, typography } from '../styles/global';

// Placeholder for user details
const dummyUser = {
  name: 'User',
};

export default function DashboardScreen() {
  const { tasks } = useTasks();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace('Login'); // Explicitly navigate to LoginScreen
    } catch (e: any) {
      Alert.alert('Logout Error', e.message); // Keep the alert for errors
      console.error('Failed to log out from Firebase', e.message);
    }
  };

  // Filter tasks based on search query for Project Cards
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Daily Progress Calculation (simplified for now)
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;
  const dailyProgress = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

  // Render Item for Project Cards
  const renderProjectCard = ({ item }) => (
    <View style={projectCardStyles.card}>
      <Text style={projectCardStyles.title}>{item.title}</Text>
      <View style={projectCardStyles.avatarCluster}>
        <Text style={projectCardStyles.avatar}>👤</Text>
        <Text style={projectCardStyles.avatar}>👥</Text>
      </View>
      <View style={projectCardStyles.progressBarContainer}>
        <View style={[projectCardStyles.progressBarFill, { width: item.completed ? '100%' : '0%' }]} />
      </View>
      <Text style={projectCardStyles.progressText}>{item.completed ? 'Completed' : 'Pending'}</Text>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      {/* Logout button positioned absolutely at the top right of the screen */}
      <TouchableOpacity style={localStyles.logoutButton} onPress={handleLogout}>
        <Text style={localStyles.logoutButtonText}>🚪</Text>
      </TouchableOpacity>

      {/* Main Content Area */}
      <View style={localStyles.mainContent}>
        {/* Header (Hello message and search bar) */}
        <View style={localStyles.headerContainer}>
          <Text style={globalStyles.headerText}>Hello, {dummyUser.name}</Text>
          <TextInput
            style={localStyles.searchBar}
            placeholder="Search tasks..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Project Cards (Tasks) */}
        <Text style={localStyles.sectionHeader}>Your Projects (Tasks)</Text>
        <FlatList
          horizontal
          data={filteredTasks}
          renderItem={renderProjectCard}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={localStyles.projectListContent}
        />
      </View>

      {/* Quick Info Area */}
      <View style={localStyles.quickInfo}>
        <Text style={localStyles.sectionHeader}>Daily Progress</Text>
        <View style={globalStyles.card}>
          <Text style={localStyles.progressCircle}>
            {`${Math.round(dailyProgress)}%`}
          </Text>
          <Text style={globalStyles.secondaryText}>Completed</Text>
        </View>

        <View style={localStyles.navigationCardsContainer}>
          <TouchableOpacity
            style={localStyles.navigationCard}
            onPress={() => navigation.navigate('Tasks')}
          >
            <Text style={localStyles.navigationIcon}>📝</Text>
            <Text style={localStyles.navigationText}>Go to Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={localStyles.navigationCard}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Text style={localStyles.navigationIcon}>📈</Text>
            <Text style={localStyles.navigationText}>Go to Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const projectCardStyles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    width: 200,
    marginRight: layout.margin,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Lighter glassmorphism for cards
  },
  title: {
    ...globalStyles.bodyText,
    fontWeight: typography.heavy,
    fontSize: 18,
    marginBottom: layout.padding / 2,
  },
  avatarCluster: {
    flexDirection: 'row',
    marginBottom: layout.padding / 2,
  },
  avatar: {
    fontSize: 18,
    marginRight: -5,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: layout.pillBorderRadius,
    width: '100%',
    marginTop: layout.padding / 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.electricBlue,
    borderRadius: layout.pillBorderRadius,
  },
  progressText: {
    ...globalStyles.secondaryText,
    marginTop: layout.padding / 2,
    fontSize: 12,
  },
});

const localStyles = StyleSheet.create({
  mainContent: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: layout.margin,
  },
  searchBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: layout.pillBorderRadius,
    paddingHorizontal: layout.padding,
    paddingVertical: layout.padding / 2,
    marginTop: layout.margin,
    color: colors.white,
    fontFamily: typography.primary,
    fontSize: 16,
  },
  sectionHeader: {
    ...globalStyles.bodyText,
    fontWeight: typography.heavy,
    fontSize: 20,
    marginTop: layout.margin,
    marginBottom: layout.padding,
  },
  projectListContent: {
    paddingBottom: layout.padding,
  },
  quickInfo: {
    marginTop: layout.margin,
  },
  progressCircle: {
    fontSize: 48,
    fontWeight: typography.heavy,
    color: colors.electricBlue,
    marginBottom: layout.padding / 2,
  },
  navigationCardsContainer: {
    marginTop: layout.margin,
  },
  navigationCard: {
    ...globalStyles.card,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.padding,
    marginBottom: layout.margin / 2,
  },
  navigationIcon: {
    fontSize: 24,
    marginRight: layout.padding,
  },
  navigationText: {
    ...globalStyles.bodyText,
    fontWeight: typography.heavy,
    fontSize: 18,
  },
  logoutButton: {
    position: 'absolute',
    top: layout.padding * 1.5, // Adjusted position to be inside safe area and aligned
    right: layout.padding,
    padding: layout.padding / 2,
    borderRadius: layout.borderRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutButtonText: {
    fontSize: 24,
    color: colors.white,
  },
});