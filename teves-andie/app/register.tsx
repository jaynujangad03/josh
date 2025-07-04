import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const APP_NAME = "Library Management System";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password || !confirm) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await AsyncStorage.setItem("user", JSON.stringify({ username, password }));
      Alert.alert("Success", "Registration successful!", [
        { text: "OK", onPress: () => router.replace("/login") }
      ]);
    } catch (e) {
      Alert.alert("Error", "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#e0eafc", "#cfdef3", "#f9fafe"]} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.logoCircle}>
            <Image source={require("../assets/images/logo.jpg")} style={styles.logo} />
          </View>
          <Text style={styles.appName}>{APP_NAME}</Text>
          <View style={styles.underline} />
          <Text style={styles.title}>Register</Text>
          <View style={styles.inputGroup}>
            <MaterialIcons name="person" size={22} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#888"
            />
          </View>
          <View style={styles.inputGroup}>
            <MaterialIcons name="lock" size={22} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#888"
            />
          </View>
          <View style={styles.inputGroup}>
            <MaterialIcons name="lock-outline" size={22} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity style={[styles.glassButton, { backgroundColor: 'rgba(52,168,83,0.13)', borderColor: '#34A853' }]} onPress={handleRegister} disabled={loading}>
            <MaterialIcons name="person-add" size={20} color="#34A853" />
            <Text style={[styles.buttonText, { color: '#34A853' }]}>{loading ? "Registering..." : "Register"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={18} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footer}>© {new Date().getFullYear()} Library Management System · v1.0</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    paddingBottom: 40,
  },
  card: {
    width: 340,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-medium',
  },
  underline: {
    width: 40,
    height: 3,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    letterSpacing: 0.5,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
    backgroundColor: '#f3f6fa',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1.2,
    borderColor: '#d1d5db',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#222',
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  glassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,122,255,0.13)',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 8,
    marginBottom: 18,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#007AFF",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
    letterSpacing: 0.2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#aaa',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    letterSpacing: 0.1,
  },
}); 