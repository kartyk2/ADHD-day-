import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";

const priorityColors: { [key: string]: string } = {
  Critical: "#E57373",
  High: "#FFB74D",
  Medium: "#FFF176",
  Low: "#A5D6A7",
  Optional: "#90CAF9",
};

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: { id: string; title: string; description: string; priority: string }) => void;
  editingTask?: { id: string; title: string; description: string; priority: string } | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ visible, onClose, onSave, editingTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("Low");

  useEffect(() => {
    if (editingTask) {
      setTaskTitle(editingTask.title);
      setTaskDescription(editingTask.description);
      setTaskPriority(editingTask.priority);
    } else {
      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("Low");
    }
  }, [editingTask]);

  const handleSave = () => {
    if (taskTitle.trim()) {
      onSave({
        id: editingTask ? editingTask.id : Date.now().toString(),
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
      });
      // Keep the modal open for adding multiple tasks
      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("Low");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editingTask ? "Edit Task" : "Add New Task"}</Text>

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
          <ScrollView horizontal style={styles.priorityContainer}>
            {Object.keys(priorityColors).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.priorityButton,
                  { backgroundColor: priorityColors[level] },
                  taskPriority === level && styles.selectedPriority,
                ]}
                onPress={() => setTaskPriority(level)}
              >
                <Text style={styles.priorityText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
              <Text style={styles.submitText}>{editingTask ? "Update Task" : "Add Task"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
  },
  priorityContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  priorityButton: {
    padding: 10,
    marginRight: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedPriority: {
    borderWidth: 2,
    borderColor: "#000",
  },
  priorityText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TaskModal;
