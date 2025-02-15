import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddHabitScreen({ route, navigation }) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [reminder, setReminder] = useState('');
  const [goal, setGoal] = useState('');
  const [days, setDays] = useState({
    Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false,
  });

  const toggleDay = (day) => {
    setDays((prevDays) => ({ ...prevDays, [day]: !prevDays[day] }));
  };

  const handleSave = () => {
    if (!name || !frequency || !Object.values(days).includes(true)) {
      alert('Please fill in all required fields and select at least one day!');
      return;
    }

    const habit = {
      id: Date.now(),
      name,
      frequency: parseInt(frequency),
      reminder,
      goal,
      days: Object.keys(days).filter((day) => days[day]), // Store only selected days
    };

    route.params.addHabit(habit);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create a New Habit</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="create-outline" size={20} color="#fff" />
        <TextInput 
          style={styles.input} 
          placeholder="Habit Name" 
          placeholderTextColor="#aaa" 
          value={name} 
          onChangeText={setName} 
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="repeat-outline" size={20} color="#fff" />
        <TextInput 
          style={styles.input} 
          placeholder="Frequency per Day" 
          placeholderTextColor="#aaa" 
          value={frequency} 
          onChangeText={setFrequency} 
          keyboardType="numeric" 
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="alarm-outline" size={20} color="#fff" />
        <TextInput 
          style={styles.input} 
          placeholder="Reminder (e.g., 7:00 AM)" 
          placeholderTextColor="#aaa" 
          value={reminder} 
          onChangeText={setReminder} 
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="trophy-outline" size={20} color="#fff" />
        <TextInput 
          style={styles.input} 
          placeholder="Goal (e.g., 30 days streak)" 
          placeholderTextColor="#aaa" 
          value={goal} 
          onChangeText={setGoal} 
        />
      </View>

      <Text style={styles.sectionTitle}>Select Days:</Text>
      <View style={styles.daysContainer}>
        {Object.keys(days).map((day) => (
          <TouchableOpacity 
            key={day} 
            style={[styles.dayButton, days[day] && styles.dayButtonSelected]} 
            onPress={() => toggleDay(day)}
          >
            <Text style={[styles.dayText, days[day] && styles.dayTextSelected]}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Habit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#121212', padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 15, borderRadius: 10, marginBottom: 15, width: '100%' },
  input: { flex: 1, color: '#fff', marginLeft: 10, fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 20, marginBottom: 10 },
  daysContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  dayButton: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#D62828', width: 50, alignItems: 'center' },
  dayButtonSelected: { backgroundColor: '#D62828' },
  dayText: { color: '#D62828', fontWeight: 'bold' },
  dayTextSelected: { color: '#fff' },
  saveButton: { backgroundColor: '#D62828', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
