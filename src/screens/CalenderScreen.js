import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getHabitHistory } from '../storage/habitStorage';
import { Calendar } from 'react-native-calendars';

export default function MonthlyReviewScreen({ navigation }) {
  const [history, setHistory] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLogs, setSelectedLogs] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const storedHistory = await getHabitHistory();
      setHistory(storedHistory || {});
    };
    fetchHistory();
  }, []);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setSelectedLogs(history[day.dateString] || []);
  };

  const markedDates = Object.keys(history).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: history[date].some(h => h.completed) ? 'green' : 'red' };
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Review</Text>
      
      <Calendar 
        onDayPress={handleDayPress} 
        markedDates={markedDates} 
        theme={{
          calendarBackground: '#121212',
          dayTextColor: '#fff',
          todayTextColor: '#D62828',
          monthTextColor: '#fff'
        }}
      />

      <Text style={styles.subtitle}>Logs for {selectedDate || 'Select a date'}</Text>
      {selectedLogs.length === 0 ? (
        <Text style={styles.noLogs}>No data for this day.</Text>
      ) : (
        <FlatList 
          data={selectedLogs} 
          keyExtractor={(item) => item.id.toString()} 
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text style={styles.habitName}>{item.name}</Text>
              <Text style={styles.status}>{item.completed ? '✔ Completed' : '✖ Skipped'}</Text>
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
  subtitle: { fontSize: 18, color: '#fff', marginTop: 20 },
  noLogs: { color: '#aaa', fontSize: 16, textAlign: 'center', marginTop: 10 },
  logItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#1E1E1E', marginVertical: 5, borderRadius: 8 },
  habitName: { color: '#fff', fontSize: 16 },
  status: { fontSize: 16, color: '#D62828' }
});
