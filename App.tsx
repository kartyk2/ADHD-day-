import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Task from "./components/Task";
import TaskModal from "./components/Modal";

interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
}

const priorityColors: { [key: string]: string } = {
  Critical: "#E57373",
  High: "#FFB74D",
  Medium: "#FFF176",
  Low: "#A5D6A7",
  Optional: "#90CAF9",
};

const priorityOrder: { [key: string]: number } = {
  Critical: 5,
  High: 4,
  Medium: 3,
  Low: 2,
  Optional: 1,
};

const TaskList = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  // Load tasks from AsyncStorage
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever tasks change
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks:", error);
    }
  };

  const handleSaveTask = (task: TaskItem) => {
    setTasks((prevTasks) => {
      const existingTaskIndex = prevTasks.findIndex((t) => t.id === task.id);
      if (existingTaskIndex !== -1) {
        const updatedTasks = [...prevTasks];
        updatedTasks[existingTaskIndex] = task;
        return updatedTasks;
      }
      return [...prevTasks, { ...task, priority: task.priority }]; // Store priority as name
    });

    setModalVisible(false);
    setEditingTask(null);
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        console.log(storedTasks);

        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task, // Ensure priority is stored as name
        }));
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const handleEditTask = (task: TaskItem) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Sort tasks by priority
  const sortedTasks = [...tasks].sort((a, b) =>
    sortOrder === "desc"
      ? priorityOrder[b.priority] - priorityOrder[a.priority]
      : priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  // Filter tasks by priority
  const filteredTasks = filterPriority
    ? sortedTasks.filter((task) => task.priority === filterPriority)
    : sortedTasks;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>To-Do List</Text>

      {/* Controls for adding task and sorting */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
        >
          <Text style={styles.buttonText}>
            Sort: {sortOrder === "desc" ? "High → Low" : "Low → High"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter by Priority */}
      <ScrollView horizontal style={styles.filterContainer}>
        {Object.keys(priorityColors).map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.filterButton,
              { backgroundColor: priorityColors[level] },
              filterPriority === level && styles.selectedFilter,
            ]}
            onPress={() =>
              setFilterPriority(filterPriority === level ? null : level)
            }
          >
            <Text style={styles.filterText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Task
            task={item}
            onToggleComplete={toggleComplete}
            onDelete={deleteTask}
            onEdit={() => handleEditTask(item)}
          />
        )}
        contentContainerStyle={styles.listContainer} // Apply styling here
      />

      {/* Task Modal for adding/editing */}
      <TaskModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F5F5F5", // Light gray background for a modern look
  },
  heading: {
    fontSize: 32,
    fontWeight: "700", // Bold for emphasis
    fontFamily: "Poppins-SemiBold", // Modern font
    color: "#2C3E50", // Dark blue-gray for contrast
    marginBottom: 24,
    textAlign: "center",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#6C5CE7", // Modern purple shade
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  sortButton: {
    backgroundColor: "#00B894", // Modern green shade
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#00B894",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    paddingVertical: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    minWidth: 80,
  },
  selectedFilter: {
    borderWidth: 2,
    borderColor: "#2C3E50", // Dark blue-gray border for selected filter
  },
  filterText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 12,
  },
  listContainer: {
    paddingBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark overlay
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#2C3E50",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#FAFAFA",
    fontSize: 14,
    color: "#2C3E50",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
    color: "#2C3E50",
  },
  priorityContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  priorityButton: {
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    elevation: 3,
  },
  selectedPriority: {
    borderWidth: 2,
    borderColor: "#2C3E50",
  },
  priorityText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cancelText: {
    color: "#2C3E50",
    fontWeight: "600",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  submitText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default TaskList;
