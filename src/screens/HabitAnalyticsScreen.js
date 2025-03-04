import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

export default function HabitAnalyticsScreen() {
  // Dummy data for visualization
  const data = [
    { name: "Completed", population: 70, color: "green", legendFontColor: "#fff", legendFontSize: 14 },
    { name: "Skipped", population: 30, color: "red", legendFontColor: "#fff", legendFontSize: 14 }
  ];

  const barData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{ data: [10, 15, 8, 12] }]
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit Progress Overview</Text>

      <PieChart
        data={data}
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
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 20 }
});
