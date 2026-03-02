import React, { useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
const taskContext = useContext(TaskContext);
const userContext = useContext(UserContext);

if (!taskContext || !userContext) {
  return null;
}

const { tasks } = taskContext;
const { user } = userContext;

export default function DashboardScreen() {
  const { tasks } = useContext(TaskContext);
  const { user } = useContext(UserContext);
  const [selectedType, setSelectedType] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const dueTodayTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.dueDate === today
  );

  const overdueTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.dueDate < today
  );

  const getSelectedTasks = useMemo(() => {
    if (selectedType === "today") return dueTodayTasks;
    if (selectedType === "overdue") return overdueTasks;
    return [];
  }, [selectedType, tasks]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome {user?.username}
      </Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.number}>{totalTasks}</Text>
          <Text>Total Tasks</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.number}>{completedTasks}</Text>
          <Text>Completed</Text>
        </View>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setSelectedType("today")}
        >
          <Text style={styles.number}>
            {dueTodayTasks.length}
          </Text>
          <Text>Due Today</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setSelectedType("overdue")}
        >
          <Text style={styles.number}>
            {overdueTasks.length}
          </Text>
          <Text>Overdue</Text>
        </TouchableOpacity>
      </View>

      {selectedType && (
        <FlatList
          data={getSelectedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>
                {item.title}
              </Text>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#e6e6e6",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  number: {
    fontSize: 20,
    fontWeight: "bold",
  },
  taskItem: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  taskTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
});