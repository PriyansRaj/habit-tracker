import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { getHabitHistory } from '../storage/habitStorage';
import { Calendar } from 'react-native-calendars';
import { PieChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function MonthlyReviewScreen({ navigation }) {
  const [history, setHistory] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [chartType, setChartType] = useState('pie');
  const [recommendedHabits, setRecommendedHabits] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const storedHistory = await getHabitHistory();
      setHistory(storedHistory || {});
      generateRecommendations(storedHistory || {});
    };
    fetchHistory();
  }, []);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setSelectedLogs(history[day.dateString] || []);
  };

  const generateRecommendations = (habitHistory) => {
    const allHabits = Object.values(habitHistory).flat();
    const habitNames = allHabits.map(habit => habit.name);
    const uniqueHabits = [...new Set(habitNames)];
    const newRecommendations = uniqueHabits.map(habit => `Try improving: ${habit}`);
    setRecommendedHabits(newRecommendations.slice(0, 5));
  };

  const markedDates = useMemo(() => {
    return Object.keys(history).reduce((acc, date) => {
      acc[date] = { marked: true, dotColor: history[date].some(h => h.completed) ? 'green' : 'red' };
      return acc;
    }, {});
  }, [history]);

  const chartData = useMemo(() => selectedLogs.map(habit => ({
    name: habit.name,
    count: habit.completed ? 1 : 0,
    color: habit.completed ? '#4CAF50' : '#D62828',
    legendFontColor: '#fff',
    legendFontSize: 14
  })), [selectedLogs]);

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
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}

      <TouchableOpacity style={styles.visualizeButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.visualizeButtonText}>Visualize Progress</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Chart Type</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.modalButton} onPress={() => setChartType('pie')}>
              <Text style={styles.buttonText}>Pie Chart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setChartType('bar')}>
              <Text style={styles.buttonText}>Bar Graph</Text>
            </TouchableOpacity>
          </View>
          {chartType === 'pie' ? (
            <PieChart
              data={chartData}
              width={screenWidth - 40}
              height={200}
              chartConfig={{
                backgroundColor: '#121212',
                backgroundGradientFrom: '#121212',
                backgroundGradientTo: '#1E1E1E',
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="10"
            />
          ) : (
            <BarChart
              data={{
                labels: selectedLogs.map(h => h.name),
                datasets: [{ data: selectedLogs.map(h => (h.completed ? 1 : 0)) }],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundGradientFrom: '#121212',
                backgroundGradientTo: '#1E1E1E',
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              fromZero
            />
          )}
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Text style={styles.subtitle}>Recommended Habits</Text>
      <FlatList
        data={recommendedHabits}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.recommendationItem}>
            <Text style={styles.habitName}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#fff', marginTop: 20 },
  recommendationItem: { padding: 10, backgroundColor: '#1E1E1E', marginVertical: 5, borderRadius: 8 },
  habitName: { color: '#fff', fontSize: 16 }
});
