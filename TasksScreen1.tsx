import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { useTasks } from '../context/TaskContext';
import DateTimePicker from '@react-native-community/datetimepicker';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}


type Priority = 'Low' | 'Medium' | 'High';

type Task = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
  completed: boolean;
};

export default function TasksScreen() {
  const { tasks, setTasks } = useTasks() as {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  };

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [priority, setPriority] = useState<Priority>('Low');

  const priorityColors: Record<Priority, string> = {
    Low: '#4CAF50',
    Medium: '#FFA500',
    High: '#FF4D4D',
  };

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
    setPriority('Low');
  };

  const toggleTask = (id: string) => {
    LayoutAnimation.easeInEaseOut();

    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    LayoutAnimation.easeInEaseOut();
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Task title..."
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Description..."
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPicker(true)}
        >
          <Text>
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

        {/* Priority Buttons */}
        <View style={styles.priorityRow}>
          {(['Low', 'Medium', 'High'] as Priority[]).map(p => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityButton,
                {
                  backgroundColor:
                    priority === p
                      ? priorityColors[p]
                      : '#E0E0E0',
                },
              ]}
              onPress={() => setPriority(p)}
            >
              <Text
                style={{
                  color: priority === p ? 'white' : 'black',
                  fontWeight: '600',
                }}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {tasks.length === 0 && (
        <Text style={styles.emptyText}>
          No tasks yet. Add one above 👆
        </Text>
      )}

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.taskCard,
              {
                borderLeftColor: priorityColors[item.priority],
              },
            ]}
            onPress={() => toggleTask(item.id)}
          >
            <Text
              style={[
                styles.taskTitle,
                item.completed && styles.completedText,
              ]}
            >
              {item.title}
            </Text>

            <Text style={styles.description}>
              {item.description}
            </Text>

            <Text style={styles.deadline}>
              📅 {item.deadline}
            </Text>

            <View
              style={[
                styles.badge,
                { backgroundColor: priorityColors[item.priority] },
              ]}
            >
              <Text style={styles.badgeText}>
                {item.priority}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => deleteTask(item.id)}
            >
              <Text style={styles.deleteText}>
                Delete
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={addTask}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#F5F7FB',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  formCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
  },
  input: {
    backgroundColor: '#F1F3F6',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
  taskCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderLeftWidth: 6,
    elevation: 4,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  description: {
    color: '#666',
    marginTop: 6,
  },
  deadline: {
    color: '#888',
    marginTop: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteText: {
    marginTop: 8,
    color: '#FF3B30',
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#5E60CE',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
});