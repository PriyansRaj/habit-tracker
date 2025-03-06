import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getAllUsers, saveUser } from '../storage/authStorage';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      alert('All fields are required!');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const allUsers = await getAllUsers();
    const emailExists = Object.values(allUsers).some((u) => u.email === email);

    if (emailExists) {
      alert('Email is already registered. Try signing in.');
      return;
    }

    // Save the new user
    const newUser = { id: Date.now().toString(), email, password };
    await saveUser(newUser);

    alert('Account created successfully!.');
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

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

      <TextInput
        label="Confirm Password"
        mode="outlined"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSignUp} style={styles.signUpButton}>
        Sign Up
      </Button>

      <Text style={styles.signInText}>
        Already have an account?{' '}
        <Text style={styles.signInLink} onPress={() => navigation.navigate('Login')}>
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  input: { width: '100%', marginBottom: 15 },
  signUpButton: { width: '100%', backgroundColor: '#007BFF', padding: 10 },
  signInText: { marginTop: 15, color: '#666' },
  signInLink: { color: '#007BFF', fontWeight: 'bold' },
});

