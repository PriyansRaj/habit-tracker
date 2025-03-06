import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { getAllUsers, setCurrentUser } from '../storage/authStorage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
  
    // Fetch all registered users from storage
    const allUsers = await getAllUsers();
  
    // Check if credentials match
    const user = Object.values(allUsers).find(
      (u) => u.email === email && u.password === password
    );
  
    if (user) {
      await setCurrentUser(user.id);
      navigation.navigate('Main');
    } else {
      alert('Invalid email or password');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Zybit</Text>
      
      <TextInput
        label="Email Address"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        style={styles.input}
      />

      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <View style={styles.checkboxContainer}>
        <Checkbox.Android
          status={staySignedIn ? 'checked' : 'unchecked'}
          onPress={() => setStaySignedIn(!staySignedIn)}
          color="#D62828"
        />
        <Text style={styles.checkboxLabel}>Stay signed in</Text>
      </View>

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>

      
     
      <Text style={styles.switchText}>
        New to Zybit?{' '}
        <Text style={styles.switchTextBold} onPress={() => navigation.navigate('SignUp')}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', marginBottom: 15 },
  forgotPassword: { color: '#D62828', alignSelf: 'flex-end', marginBottom: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkboxLabel: { marginLeft: 8 },
  button: { width: '100%', backgroundColor: '#D62828', padding: 10 },
  orText: { marginTop: 20, marginBottom: 10, fontSize: 14, color: '#aaa' },
  socialIcons: { flexDirection: 'row', justifyContent: 'space-around', width: '60%' },
  switchText: { color: '#aaa', marginTop: 15, fontSize: 14 },
  switchTextBold: { color: '#D62828', fontWeight: 'bold' },
});
