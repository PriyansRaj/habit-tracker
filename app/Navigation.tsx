import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../src/screens/HomeScreen';
import AddHabitScreen from '../src/screens/AddHabitScreen';
import CalendarScreen from '../src/screens/CalenderScreen';
import LoginScreen from '../src/screens/LoginScreen';
import SignUpScreen from '../src/screens/SignUpScreen';
import MonthlyReviewScreen from '../src/screens/CalenderScreen';
import HabitAnalyticsScreen from '../src/screens/HabitAnalyticsScreen';



const Stack = createStackNavigator();

function Navigation() {
  return (
   
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddHabit" component={AddHabitScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name='MonthlyReview' component={MonthlyReviewScreen} />
        <Stack.Screen name="HabitAnalytics" component={HabitAnalyticsScreen} />
      </Stack.Navigator>
    
  
  );
}
export default Navigation;
