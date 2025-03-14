import React, { useState } from "react";
import { 
  View, FlatList, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity 
} from "react-native";
import Task from "./components/Task";

interface TaskItem {
  id: string;
  title: string;
  description: string;
  color: string; // Represents priority
  completed: boolean;
}

const priorityColors = {
  Critical: "#F44336", // Red - Urgent & Important
  High: "#FF9800", // Orange - Urgent but Not Important
  Medium: "#FFC107", // Yellow - Not Urgent but Important
  Low: "#4CAF50", // Green - Not Urgent & Not Important
  Optional: "#2196F3", // Blue - Least priority
};

const TaskList = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("Low");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  const addTask = () => {
    if (taskTitle.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: taskTitle,
          description: taskDescription,
          color: priorityColors[taskPriority],
          completed: false,
        }
      ]);
      setModalVisible(false);
      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("Low");
    }
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Sort tasks by priority
  const priorityOrder = { Critical: 5, High: 4, Medium: 3, Low: 2, Optional: 1 };
  const sortedTasks = [...tasks].sort((a, b) => 
    sortOrder === "desc"
      ? priorityOrder[b.color] - priorityOrder[a.color]
      : priorityOrder[a.color] - priorityOrder[b.color]
  );

  // Filter tasks based on priority
  const filteredTasks = filterPriority
    ? sortedTasks.filter(task => task.color === priorityColors[filterPriority])
    : sortedTasks;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>To-Do List</Text>

      <View style={styles.controls}>
        <Button title="Add Task" onPress={() => setModalVisible(true)} />
        <Button 
          title={`Sort: ${sortOrder === "desc" ? "High → Low" : "Low → High"}`} 
          onPress={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")} 
        />
      </View>

      <View style={styles.filterContainer}>
        {Object.keys(priorityColors).map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.filterButton, 
              { backgroundColor: priorityColors[level] },
              filterPriority === level && styles.selectedFilter
            ]}
            onPress={() => setFilterPriority(filterPriority === level ? null : level)}
          >
            <Text style={styles.filterText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Task task={item} onToggleComplete={toggleComplete} onDelete={deleteTask} />
        )}
      />

      {/* Modal for adding tasks */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Task Name" 
              value={taskTitle} 
              onChangeText={setTaskTitle} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Task Description" 
              value={taskDescription} 
              onChangeText={setTaskDescription} 
              multiline 
            />

            <Text style={styles.label}>Priority:</Text>
            <View style={styles.priorityContainer}>
              {Object.keys(priorityColors).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.priorityButton, 
                    { backgroundColor: priorityColors[level] },
                    taskPriority === level && styles.selectedPriority
                  ]}
                  onPress={() => setTaskPriority(level)}
                >
                  <Text style={styles.priorityText}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="gray" />
              <Button title="Add Task" onPress={addTask} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F0F2F5" },
  heading: { fontSize: 26, fontWeight: "bold", color: "#333", marginBottom: 12 },

  controls: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 10 
  },
  
  filterContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 12 
  },
  filterButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedFilter: {
    borderWidth: 2,
    borderColor: "#000",
  },
  filterText: { color: "#fff", fontWeight: "bold" },

  modalContainer: { 
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  input: { 
    width: "100%", 
    padding: 10, 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 8, 
    marginBottom: 10 
  },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  
  priorityContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginVertical: 10 
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedPriority: {
    borderWidth: 2,
    borderColor: "#000",
  },
  priorityText: { color: "#fff", fontWeight: "bold" },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default TaskList;
