import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getHabits } from "../storage/habitStorage";
import { getCurrentUser } from "../storage/authStorage";

export default function HomeScreen({ navigation }) {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getCurrentUser();
      if (user) {
        const storedHabits = await getHabits(user.id);
        if (Array.isArray(storedHabits)) {
          setHabits(storedHabits);
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🔹 Top Menu Button */}
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={30} color="#fff" />
      </TouchableOpacity>

      {/* 🔹 Page Title */}
      <Text style={styles.title}>Your Habits</Text>

      {/* 🔹 Habit List */}
      {habits.length === 0 ? (
        <Text style={styles.noHabitsText}>No habits yet. Start tracking now!</Text>
      ) : (
        <FlatList
        data={habits}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique key
        renderItem={({ item }) => (
          <View style={styles.habitItem}>
            <Text style={styles.habitName}>{item.name}</Text>
            <Text style={styles.streak}>{`🔥 Streak: ${item.streak || 0} days`}</Text>
          </View>
        )}
      />
      
      )}

      {/* 🔹 Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Add Habit")}>
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.navText}>Add Habit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Monthly Review")}>
          <Ionicons name="calendar" size={24} color="#fff" />
          <Text style={styles.navText}>Monthly Review</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Analytics")}>
          <Ionicons name="bar-chart" size={24} color="#fff" />
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20, paddingTop: 60 },
  
  menuButton: { position: "absolute", top: 20, left: 20, zIndex: 10 },
  
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", textAlign: "center", marginBottom: 20 },
  
  noHabitsText: { color: "#aaa", fontSize: 16, textAlign: "center", marginTop: 20 },
  
  habitItem: { backgroundColor: "#1E1E1E", padding: 15, borderRadius: 10, marginBottom: 15 },
  
  habitName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  
  streak: { color: "#D62828", fontSize: 14, fontWeight: "bold" },

  bottomNav: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    backgroundColor: "#1E1E1E", 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 20 
  },

  navItem: { alignItems: "center", flex: 1, padding: 10 },

  navText: { color: "#fff", fontSize: 14, fontWeight: "bold", marginTop: 4 }
});
