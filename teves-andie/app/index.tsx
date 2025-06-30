import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const APP_NAME = "Library Management System";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await AsyncStorage.getItem("session");
        if (session) {
          setLoggedIn(true);
          router.replace("/dashboard");
          return;
        }
      } catch (e) {
        // handle error
      } finally {
        setTimeout(() => setLoading(false), 1500); // Splash for 1.5s
      }
    };
    checkSession();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={["#e0eafc", "#cfdef3"]} style={styles.gradient}>
        <View style={styles.container}>
          <Image source={require("../assets/images/icon.png")} style={styles.logo} />
          <Text style={styles.appName}>{APP_NAME}</Text>
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        </View>
      </LinearGradient>
    );
  }

  if (loggedIn) {
    // This will never render because of router.replace
    return null;
  }

  return (
    <LinearGradient colors={["#e0eafc", "#cfdef3"]} style={styles.gradient}>
      <View style={styles.container}>
        <Image source={require("../assets/images/logo.jpg")} style={styles.logo} />
        <Text style={styles.appName}>{APP_NAME}</Text>
        <View style={{ marginTop: 48, width: "100%", alignItems: "center" }}>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/login") }>
            <MaterialIcons name="login" size={22} color="#fff" />
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: "#34A853" }]} onPress={() => router.push("/register") }>
            <MaterialIcons name="person-add" size={22} color="#fff" />
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
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
  logo: {
    width: 110,
    height: 110,
    marginBottom: 28,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-medium',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 220,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    marginBottom: 18,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
    letterSpacing: 0.2,
  },
});
