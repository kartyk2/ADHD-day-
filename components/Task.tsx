import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface TaskProps {
  task: { id: string; title: string; description: string; priority: string; completed: boolean };
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors: { [key: string]: string } = {
  Critical: "#E57373",
  High: "#FFB74D",
  Medium: "#FFF176",
  Low: "#A5D6A7",
  Optional: "#90CAF9",
};

const Task: React.FC<TaskProps> = ({ task, onToggleComplete, onDelete }) => {
  return (
    <View style={[styles.taskContainer, { borderLeftColor: priorityColors[task.priority] }]}>
      <TouchableOpacity onPress={() => onToggleComplete(task.id)} style={styles.taskContent}>
        <Text style={[styles.taskTitle, task.completed && styles.completed]}>{task.title}</Text>
        {task.description ? <Text style={styles.taskDescription}>{task.description}</Text> : null}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 6, // Priority Color Indicator
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#ff4d4d",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default Task;
