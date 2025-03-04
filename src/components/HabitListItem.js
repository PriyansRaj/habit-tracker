import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import moment from 'moment';

export default function HabitListScreen({ route }) {
  const [habits, setHabits] = useState(route.params.habits || []);

  // Get current day in the same format used when saving habits
  const today = moment().format('ddd'); // Example: 'Mon', 'Tue', etc.

  // Filter habits that include today in their selected days
  const filteredHabits = habits.filter((habit) => habit.days.includes(today));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Habits ({today})</Text>

      {filteredHabits.length > 0 ? (
        <FlatList
          data={filteredHabits}
          keyExtractor={(habit) => habit.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.habitCard}>
              <Text style={styles.habitName}>{item.name}</Text>
              <Text style={styles.habitDetails}>Frequency: {item.frequency} times/day</Text>
              <Text style={styles.habitDetails}>Duration: {item.duration} min</Text>
              <Text style={styles.habitDetails}>Reminders: {item.reminders.join(', ')}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noHabits}>No habits scheduled for today!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  habitCard: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 10, marginBottom: 10 },
  habitName: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  habitDetails: { color: '#aaa', fontSize: 14 },
  noHabits: { color: '#aaa', fontSize: 16, textAlign: 'center', marginTop: 20 },
});
