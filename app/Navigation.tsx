import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from "../src/screens/HomeScreen";
import AddHabitScreen from "../src/screens/AddHabitScreen";
import CalendarScreen from "../src/screens/CalenderScreen";
import LoginScreen from "../src/screens/LoginScreen";
import SignUpScreen from "../src/screens/SignUpScreen";
import MonthlyReviewScreen from "../src/screens/CalenderScreen";
import HabitAnalyticsScreen from "../src/screens/HabitAnalyticsScreen";
import PendingHabitsScreen from "../src/screens/PendingHabitsScreen";
import CompletedHabitsScreen from "../src/screens/CompletedHabitsScreen";
import VisualizationScreen from "../src/screens/VisualizationScreen"
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


// ✅ Create Drawer Navigator (for the main menu)
function DrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Add Habit" component={AddHabitScreen} />
      <Drawer.Screen name="Monthly Review" component={MonthlyReviewScreen} />
      <Drawer.Screen name="Completed" component={CompletedHabitsScreen} />
      <Drawer.Screen name="Pending" component={PendingHabitsScreen} />
      <Drawer.Screen name="Analytics" component={HabitAnalyticsScreen} />
     
    </Drawer.Navigator>
  );
}

// ✅ Create Main Stack Navigator (includes Auth + Drawer)
export default function Navigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="VisualizationScreen" component={VisualizationScreen} />
    </Stack.Navigator>
  );
}
