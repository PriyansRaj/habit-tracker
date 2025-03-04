import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const getToday = () => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return daysOfWeek[new Date().getDay()];
};

export default function AddHabitScreen({ route, navigation }) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [reminders, setReminders] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [days, setDays] = useState({
    Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false,
  });

  const today = getToday(); 
  const toggleDay = (day) => {
    setDays((prevDays) => ({ ...prevDays, [day]: !prevDays[day] }));
  };


  const showPicker = () => {
    setShowTimePicker(true);
    setSelectedTime(new Date());
  };

  const handleTimeChange = (event, time) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (time) {
      const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setReminders((prevReminders) => {
        const maxReminders = parseInt(frequency) || 1;

        if (!prevReminders.includes(formattedTime) && prevReminders.length < maxReminders) {
          return [...prevReminders, formattedTime];
        } else {
          alert(`You can only set up to ${maxReminders} reminders.`);
          return prevReminders;
        }
      });
    }
  };

  // Save Habit
  const handleSave = () => {
    if (!name || !frequency || reminders.length === 0 || !Object.values(days).includes(true) || !duration) {
      alert('Please fill in all required fields!');
      return;
    }

    const habit = {
      id: Date.now(),
      name,
      frequency: parseInt(frequency),
      duration: parseInt(duration),
      reminders,
      goal,
      days: Object.keys(days).filter((day) => days[day]),
    };

    route.params.addHabit(habit);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create a New Habit</Text>

      {/* Habit Name */}
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

      {/* Frequency */}
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

      {/* Duration Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="time-outline" size={20} color="#fff" />
        <TextInput
          style={styles.input}
          placeholder="Duration (minutes)"
          placeholderTextColor="#aaa"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
      </View>

      {/* Reminder Time Picker */}
      <View style={styles.inputContainer}>
        <Ionicons name="alarm-outline" size={20} color="#fff" />
        <TouchableOpacity style={styles.timePickerButton} onPress={showPicker}>
          <Text style={styles.timePickerText}>
            {reminders.length > 0 ? reminders.join(', ') : 'Set Reminder'}
          </Text>
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handleTimeChange}
        />
      )}

      {/* Select Days */}
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

      {/* Save Button */}
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
  timePickerButton: { flex: 1, marginLeft: 10 },
  timePickerText: { color: '#aaa', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 20, marginBottom: 10 },
  daysContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  dayButton: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#D62828', width: 50, alignItems: 'center' },
  dayButtonSelected: { backgroundColor: '#D62828' },
  dayText: { color: '#D62828', fontWeight: 'bold' },
  dayTextSelected: { color: '#fff' },
  saveButton: { backgroundColor: '#D62828', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
