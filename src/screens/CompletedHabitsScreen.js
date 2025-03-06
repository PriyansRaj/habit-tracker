import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getHabits } from '../storage/habitStorage';
import { getCurrentUser } from '../storage/authStorage';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function CompletedHabitsScreen({ navigation }) {
  const [completedHabits, setCompletedHabits] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString()); // Default to today

  useEffect(() => {
    const fetchCompletedHabits = async () => {
      const user = await getCurrentUser();
      if (user) {
        const habits = await getHabits(user.id);
        const filteredHabits = habits.filter(habit => habit.completedDates && habit.completedDates.includes(selectedDay));
        setCompletedHabits(filteredHabits);
      }
    };
    fetchCompletedHabits();
  }, [selectedDay]);

  return (
    <SafeAreaView style={styles.container}>

      {/* 🔹 Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}  
      >
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      {/* 🔹 Title */}
      <Text style={styles.title}>Completed Habits</Text>

      {/* 🔹 Day Selector */}
      <View style={styles.daySelectorContainer}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.dayText, selectedDay === day && styles.selectedDayText]}>{day.slice(0, 3)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔹 No Completed Habits Message */}
      {completedHabits.length === 0 ? (
        <Text style={styles.noHabitsText}>No habits completed on {selectedDay}.</Text>
      ) : (
        <FlatList
          data={completedHabits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.habitItem}>
              <Text style={styles.habitName}>{item.name}</Text>
              <Text style={styles.completedText}>✅ Completed</Text>
            </View>
          )}
          contentContainerStyle={{ paddingTop: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212', 
    paddingHorizontal: 20,
    paddingTop: 50,  
  },

  /* 🔹 Back Button */
  backButton: { 
    position: 'absolute', 
    top: 20,  
    left: 20, 
    zIndex: 100,  
    backgroundColor: 'rgba(255, 255, 255, 0.3)',  
    padding: 10,
    borderRadius: 50,
  },

  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff', 
    textAlign: 'center', 
    marginBottom: 20, 
  },

  daySelectorContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 20,
    flexWrap: 'wrap', 
    gap: 10,
  },

  dayButton: { 
    padding: 10, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#D62828', 
    width: 50, 
    alignItems: 'center', 
  },

  selectedDayButton: { 
    backgroundColor: '#D62828',
  },

  dayText: { 
    color: '#D62828', 
    fontWeight: 'bold', 
  },

  selectedDayText: { 
    color: '#fff', 
  },

  noHabitsText: {
    color: '#aaa', 
    fontSize: 18, 
    textAlign: 'center', 
    marginTop: 20 
  },

  habitItem: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  habitName: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },

  completedText: { 
    color: '#28D628', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
});
