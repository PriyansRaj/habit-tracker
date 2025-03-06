import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getHabits } from '../storage/habitStorage';
import { getCurrentUser } from '../storage/authStorage';

export default function PendingHabitsScreen({ navigation }) {
  const [pendingHabits, setPendingHabits] = useState([]);

  useEffect(() => {
    const fetchPendingHabits = async () => {
      const user = await getCurrentUser();
      if (user) {
        const habits = await getHabits(user.id);
        const missedHabits = habits.filter(habit => !habit.completedToday);
        setPendingHabits(missedHabits);
      }
    };
    fetchPendingHabits();
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      {/* 🔹 Menu / Back Button */}
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();  
          } else {
            navigation.openDrawer();  
          }
        }}
      >
        <Ionicons name={navigation.canGoBack() ? "arrow-back" : "menu"} size={30} color="#fff" />
      </TouchableOpacity>

      {/* 🔹 Title */}
      <Text style={styles.title}>Pending Habits</Text>

      {/* 🔹 No Pending Habits Message */}
      {pendingHabits.length === 0 ? (
        <Text style={styles.noHabitsText}>🎉 No pending habits! Keep up the good work!</Text>
      ) : (
        <FlatList
          data={pendingHabits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.habitItem}>
              <Text style={styles.habitName}>{item.name}</Text>
              <Text style={styles.missedText}>⚠️ Missed Today</Text>
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

  /* 🔹 Menu / Back Button */
  menuButton: { 
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

  missedText: { 
    color: '#D62828', 
    fontSize: 14, 
    fontWeight: 'bold' 
  },
});
