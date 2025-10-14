import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../../../src/lib/api';

export default function TasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState([
    {
      id: 'id',
      title: 'Upload ID Card',
      description: 'Upload your ID for hotel check-in',
      icon: '🆔',
      status: 'pending',
      dueDate: '10 July 2025'
    },
    {
      id: 'form',
      title: 'Registration Form',
      description: 'Complete your registration details',
      icon: '📝',
      status: 'pending',
      dueDate: '10 July 2025'
    },
    {
      id: 'phone-input',
      title: 'Phone Verification',
      description: 'Verify your phone number',
      icon: '📱',
      status: 'pending',
      dueDate: '10 July 2025'
    }
  ]);

  // Check task completion status when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      checkTaskStatus();
    }, [])
  );

  const checkTaskStatus = async () => {
    try {
      // Get current store state to check task completion
      const store = api.getStore?.() || {};
      const updatedTasks = tasks.map(task => {
        if (task.id === 'id' && store.tasks?.idUpload === 'done') {
          return { ...task, status: 'completed' };
        }
        if (task.id === 'form' && store.tasks?.form === 'done') {
          return { ...task, status: 'completed' };
        }
        if (task.id === 'phone-input' && store.tasks?.phone === 'done') {
          return { ...task, status: 'completed' };
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error checking task status:', error);
    }
  };

  // Check if all tasks are completed
  const allTasksCompleted = tasks.every(task => task.status === 'completed');

  const handleTaskPress = (taskId: string) => {
    router.push(`/(public)/tasks/${taskId}`);
  };

  const handleContinueToApp = () => {
    router.replace('/(app)/inbox');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, Tanmay 👋</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>TM</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tasks for Registration</Text>
        <Text style={styles.subtitle}>Complete these tasks to finish your registration</Text>
      </View>


      {/* Task Details */}
      <ScrollView style={styles.content}>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[
              styles.taskCard,
              task.status === 'completed' && styles.completedCard
            ]}
            onPress={() => handleTaskPress(task.id)}
          >
            <View style={styles.taskHeader}>
              <Text style={styles.taskIcon}>{task.icon}</Text>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDescription}>{task.description}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
            
            <View style={styles.taskFooter}>
              <Text style={styles.dueDate}>Complete by: {task.dueDate}</Text>
              {task.status === 'pending' && (
                <Text style={styles.dueSoon}>Due soon</Text>
              )}
              {task.status === 'completed' && (
                <Text style={styles.completed}>Completed</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Continue Button - Only show when all tasks are completed */}
      {allTasksCompleted && (
        <View style={styles.continueContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueToApp}
          >
            <Text style={styles.continueButtonText}>Continue to App</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F9B24E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F9B24E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dc3545',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  arrow: {
    fontSize: 24,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  dueSoon: {
    fontSize: 12,
    color: '#dc3545',
    fontWeight: '600',
  },
  completed: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
  },
  continueContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  continueButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
