import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { getHabits } from "../storage/habitStorage";
import { getCurrentUser } from "../storage/authStorage";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for back button
import moment from "moment"; // For date handling

const screenWidth = Dimensions.get("window").width;

export default function HabitAnalyticsScreen({ navigation }) {
  const [completedCount, setCompletedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const fetchHabitData = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      const habits = await getHabits(user.id);
      if (!habits || habits.length === 0) return;

      // 📅 Get today's date
      const today = moment().format("YYYY-MM-DD");

      // ✅ Calculate completed and skipped habits for today
      let completed = 0;
      let skipped = 0;
      let weeklyCounts = [0, 0, 0, 0]; // Weeks: 4 weeks data

      habits.forEach((habit) => {
        if (habit.completedToday) {
          completed++;
        } else if (habit.dueDate === today) {
          skipped++;
        }

        // 📊 Track weekly progress
        habit.history?.forEach((entry) => {
          const habitDate = moment(entry.date);
          const diff = moment().diff(habitDate, "weeks");

          if (diff >= 0 && diff < 4) {
            weeklyCounts[3 - diff] += entry.completed ? 1 : 0;
          }
        });
      });

      setCompletedCount(completed);
      setSkippedCount(skipped);
      setWeeklyData(weeklyCounts);
    };

    fetchHabitData();
  }, []);

  // 📌 Pie Chart Data
  const pieData = [
    { name: "Completed", population: completedCount, color: "green", legendFontColor: "#fff", legendFontSize: 14 },
    { name: "Skipped", population: skippedCount, color: "red", legendFontColor: "#fff", legendFontSize: 14 }
  ];

  // 📌 Bar Chart Data
  const barData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{ data: weeklyData }]
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Habit Progress Overview</Text>

      <PieChart
        data={pieData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#121212",
          backgroundGradientFrom: "#121212",
          backgroundGradientTo: "#121212",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />

      <Text style={styles.subtitle}>Weekly Progress</Text>

      <BarChart
        data={barData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#121212",
          backgroundGradientFrom: "#1E1E1E",
          backgroundGradientTo: "#1E1E1E",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
        }}
        style={{ marginVertical: 8, borderRadius: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20, alignItems: "center" },
  backButton: { position: "absolute", top: 20, left: 20, zIndex: 10 }, // Positioned top-left
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 20 }
});
