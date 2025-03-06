import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ContributionGraph, PieChart, BarChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function VisualizationScreen({ route, navigation }) {
  const { history, completedCount, skippedCount, weeklyData, monthlyTrends } = route.params;

  // 🟢 Heatmap Data Processing
  const heatmapData = useMemo(() => {
    if (!history || typeof history !== "object") {
      return [];
    }
    return Object.keys(history).map((date) => ({
      date,
      count: history[date]?.filter((h) => h.completed)?.length || 0,
    }));
  }, [history]);

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>📊 Habit Visualization</Text>

      {/* 🔥 Heatmap */}
      <Text style={styles.chartTitle}>🔥 Your Habit Completion Heatmap</Text>
      <ContributionGraph
        values={heatmapData}
        endDate={new Date()}
        numDays={90}
        width={screenWidth - 20}
        height={220}
        squareSize={15}
        chartConfig={{
          backgroundGradientFrom: "#1E1E1E",
          backgroundGradientTo: "#1E1E1E",
          color: (opacity) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: () => "#fff",
        }}
      />

      {/* 📊 Habit Completion Breakdown */}
      <Text style={styles.chartTitle}>📌 Habit Completion Breakdown</Text>
      <PieChart
        data={[
          { name: "Completed", population: completedCount, color: "green", legendFontColor: "#fff", legendFontSize: 14 },
          { name: "Skipped", population: skippedCount, color: "red", legendFontColor: "#fff", legendFontSize: 14 },
        ]}
        width={screenWidth - 40}
        height={200}
        chartConfig={{
          backgroundColor: "#121212",
          color: (opacity) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      {/* 📈 Weekly Habit Progress */}
      <Text style={styles.chartTitle}>📊 Weekly Habit Progress</Text>
      <BarChart
        data={{
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [{ data: weeklyData }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#121212",
          backgroundGradientFrom: "#1E1E1E",
          backgroundGradientTo: "#1E1E1E",
          color: (opacity) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: () => "#fff",
        }}
        style={{ marginVertical: 10, borderRadius: 8 }}
      />

      {/* 📉 Monthly Habit Trends */}
      <Text style={styles.chartTitle}>📉 Monthly Habit Trends</Text>
      <LineChart
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr"],
          datasets: [{ data: monthlyTrends }],
        }}
        width={screenWidth - 40}
        height={200}
        chartConfig={{
          backgroundColor: "#121212",
          backgroundGradientFrom: "#1E1E1E",
          backgroundGradientTo: "#1E1E1E",
          color: (opacity) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: () => "#fff",
        }}
        style={{ marginVertical: 10, borderRadius: 8 }}
      />
    </ScrollView>
  );
}

// 🌟 STYLES
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 20 },
  chartTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 20 },
  closeButton: { position: "absolute", top: 10, left: 10, padding: 10 },
});
