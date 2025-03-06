import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { getHabitHistory } from "../storage/habitStorage";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";

export default function MonthlyReviewScreen({ navigation }) {
  const [history, setHistory] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
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

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Monthly Review</Text>

      {/* 📅 Calendar */}
      <Calendar
        onDayPress={handleDayPress}
        markedDates={Object.keys(history).reduce((acc, date) => {
          acc[date] = { marked: true, dotColor: history[date].some((h) => h.completed) ? "green" : "red" };
          return acc;
        }, {})}
        theme={{
          calendarBackground: "#121212",
          dayTextColor: "#fff",
          todayTextColor: "#D62828",
          monthTextColor: "#fff",
        }}
      />

      {/* 📋 Habit Logs */}
      <Text style={styles.subtitle}>Logs for {selectedDate || "Select a date"}</Text>
      {selectedLogs.length === 0 ? (
        <Text style={styles.noLogs}>No data for this day.</Text>
      ) : (
        <FlatList
          data={selectedLogs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text style={styles.habitName}>{item.name}</Text>
              <Text style={styles.status}>{item.completed ? "✔ Completed" : "✖ Skipped"}</Text>
            </View>
          )}
        />
      )}

      {/* 📊 Visualization Button */}
      <TouchableOpacity
        style={styles.visualizeButton}
        onPress={() => navigation.navigate("VisualizationScreen", { history })}
      >
        <Text style={styles.visualizeButtonText}>View Visualization</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center" },
  subtitle: { fontSize: 18, color: "#fff", marginTop: 20 },
  logItem: { backgroundColor: "#1E1E1E", padding: 10, marginVertical: 5, borderRadius: 8 },
  habitName: { fontSize: 16, color: "#fff" },
  status: { fontSize: 14, color: "#4CAF50" },
  visualizeButton: { backgroundColor: "#D62828", padding: 15, borderRadius: 8, marginTop: 20, alignItems: "center" },
  visualizeButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
