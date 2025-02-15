import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getHabits, saveHabit, logHabitActivity } from '../storage/habitStorage';
import { getCurrentUser } from '../storage/authStorage';

export default function HomeScreen({ navigation }) {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getCurrentUser();
      if (user) {
        const storedHabits = await getHabits(user.id);
        setHabits(storedHabits);
      }
    };
    fetchUserData();
  }, []);

  const addHabit = async (habit) => {
    const newHabits = [...habits, { ...habit, streak: 0, completedToday: false }];
    setHabits(newHabits);
    await saveHabit(newHabits);
  };

  const toggleComplete = async (id, name) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const newStreak = habit.completedToday ? habit.streak : habit.streak + 1;
        logHabitActivity(id, name, true); // Log completion
        return { ...habit, completedToday: !habit.completedToday, streak: newStreak };
      }
      return habit;
    });

    setHabits(updatedHabits);
    await saveHabit(updatedHabits);
  };

  const skipHabit = async (id, name) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, completedToday: false, streak: 0 } : habit
    );

    logHabitActivity(id, name, false); // Log skipped habit
    setHabits(updatedHabits);
    await saveHabit(updatedHabits);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Habits</Text>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddHabit', { addHabit })}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add Habit</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.reviewButton} 
        onPress={() => navigation.navigate('MonthlyReview')}
      >
        <Ionicons name="calendar-outline" size={24} color="#fff" />
        <Text style={styles.reviewButtonText}>Monthly Review</Text>
      </TouchableOpacity>

      {habits.length === 0 ? (
        <Text style={styles.noHabitsText}>No habits yet. Start tracking now!</Text>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.habitItem}>
              <View>
                <Text style={styles.habitName}>{item.name}</Text>
                <Text style={styles.habitDetails}>{`Frequency: ${item.frequency}x per day`}</Text>
                <Text style={styles.habitDetails}>{`Days: ${item.days.join(', ')}`}</Text>
                <Text style={styles.streak}>{`🔥 Streak: ${item.streak} days`}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.actionButton, item.completedToday && styles.completed]}
                  onPress={() => toggleComplete(item.id, item.name)}
                >
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => skipHabit(item.id, item.name)}
                >
                  <Ionicons name="close-circle-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D62828', padding: 12, borderRadius: 8, justifyContent: 'center', marginBottom: 10 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  reviewButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E90FF', padding: 12, borderRadius: 8, justifyContent: 'center', marginBottom: 20 },
  reviewButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  noHabitsText: { color: '#aaa', fontSize: 16, textAlign: 'center', marginTop: 20 },
  habitItem: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 10, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  habitName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  habitDetails: { color: '#aaa', fontSize: 14 },
  streak: { color: '#D62828', fontSize: 14, fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'row', gap: 10 },
  actionButton: { padding: 10, borderRadius: 8, backgroundColor: '#333' },
  completed: { backgroundColor: '#28A745' },
});
