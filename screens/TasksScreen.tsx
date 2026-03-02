import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks, Task } from '../context/TaskContext';
import { colors, layout, styles as globalStyles, typography } from '../styles/global';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function TasksScreen() {
  const { tasks, setTasks } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [priority, setPriority] = useState<Task['priority']>('Low'); // Use Task['priority'] for type safety

  const addTask = () => {
    if (!title.trim()) return;

    LayoutAnimation.easeInEaseOut();

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      deadline: deadline ? deadline.toDateString() : 'No deadline',
      priority,
      completed: false,
    };

    setTasks(prev => [...prev, newTask]);
    setTitle('');
    setDescription('');
    setDeadline(null);
    setPriority('Low'); // Reset priority to default
  };

  const toggleTask = (id: string) => {
    LayoutAnimation.easeInEaseOut();
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Render Item for Task Checklist
  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={taskItemStyles.taskCard}
      onPress={() => toggleTask(item.id)}
    >
      <View style={taskItemStyles.checkbox}>
        {item.completed && <Text style={taskItemStyles.checkmark}>✔</Text>}
      </View>
      <View style={taskItemStyles.taskContent}>
        <View style={taskItemStyles.titleAndPriorityRow}>
          <Text
            style={[
              taskItemStyles.taskTitle,
              item.completed && taskItemStyles.completedTaskTitle,
            ]}
          >
            {item.title}
          </Text>
          <Text style={taskItemStyles.priorityBadge}>
            {item.priority}
          </Text>
        </View>
        {item.description && (
          <Text style={taskItemStyles.descriptionText}>
            Description: {item.description}
          </Text>
        )}
        {item.deadline !== 'No deadline' && (
          <Text style={taskItemStyles.deadlineText}>
            📅 Deadline: {item.deadline}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      {/* Header Area */}
      <View style={localStyles.headerContainer}>
        <Text style={globalStyles.headerText}>My Tasks</Text>

      </View>

      {/* Primary Action Area (Checklist) */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={localStyles.taskList}
        ListEmptyComponent={() => (
          <Text style={globalStyles.secondaryText}>No tasks yet. Add one below!</Text>
        )}
      />

      {/* Footer (Add Task Bar) */}
      <View style={localStyles.addTaskBar}>
        <TextInput
          style={localStyles.input}
          placeholder="New task title..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={localStyles.input}
          placeholder="Description (optional)..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity style={localStyles.input} onPress={() => setShowPicker(true)}>
          <Text style={localStyles.dateText}>
            {deadline ? deadline.toDateString() : 'Select Deadline'}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={deadline ?? new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setDeadline(selectedDate);
            }}
          />
        )}
        <View style={localStyles.priorityRow}>
          {(['Low', 'Medium', 'High'] as Task['priority'][]).map(p => (
            <TouchableOpacity
              key={p}
              style={[
                localStyles.priorityButton,
                priority === p && { backgroundColor: colors.electricBlue },
              ]}
              onPress={() => setPriority(p)}
            >
              <Text style={[
                localStyles.priorityButtonText,
                priority === p && { color: colors.white },
              ]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={globalStyles.button} onPress={addTask}>
          <Text style={globalStyles.buttonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const taskItemStyles = StyleSheet.create({
  taskCard: {
    ...globalStyles.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.padding * 0.75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Slightly transparent background
    marginBottom: layout.padding / 2,
    borderLeftWidth: 4,
    borderLeftColor: colors.electricBlue, // Example color
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: layout.borderRadius / 2,
    borderWidth: 2,
    borderColor: colors.electricBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.padding,
  },
  checkmark: {
    color: colors.white,
    fontSize: 16,
  },
  taskContent: {
    flex: 1,
  },
  titleAndPriorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.padding / 4, // Space below title/priority
  },
  taskTitle: {
    ...globalStyles.bodyText,
    flex: 1, // Take up remaining space
    fontSize: 16,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.4,
  },
  descriptionText: {
    ...globalStyles.secondaryText,
    fontSize: 14,
    marginTop: layout.padding / 4,
  },
  deadlineText: {
    ...globalStyles.secondaryText,
    fontSize: 12,
    marginTop: layout.padding / 4,
  },
  priorityBadge: {
    ...globalStyles.secondaryText,
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: layout.pillBorderRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: layout.padding,
  }
});

const localStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.margin,
    paddingHorizontal: layout.padding, // Add padding to header
  },

  taskList: {
    flexGrow: 1,
    paddingHorizontal: layout.padding,
    paddingBottom: layout.padding, // Add some bottom padding
  },
  addTaskBar: {
    backgroundColor: colors.deepCharcoal,
    padding: layout.padding,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: layout.borderRadius,
    paddingHorizontal: layout.padding,
    paddingVertical: layout.padding / 2,
    marginBottom: layout.padding / 2,
    color: colors.white,
    fontFamily: typography.primary,
    fontSize: 16,
  },
  dateText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: typography.primary,
    fontSize: 16,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.padding,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: layout.padding / 2,
    borderRadius: layout.borderRadius,
    borderWidth: 1,
    borderColor: colors.electricBlue,
    alignItems: 'center',
    marginHorizontal: layout.padding / 4,
  },
  priorityButtonText: {
    color: colors.electricBlue,
    fontWeight: typography.heavy,
  },
});
