import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const APP_NAME = "Library Management System";
const QUOTES = [
  "A library is not a luxury but one of the necessities of life.",
  "When in doubt, go to the library.",
  "Libraries store the energy that fuels the imagination.",
  "The only thing that you absolutely have to know, is the location of the library.",
  "A library is a hospital for the mind."
];

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
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
        setTimeout(() => setLoading(false), 1200);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((i) => (i + 1) % QUOTES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={["#e0eafc", "#cfdef3", "#f9fafe"]} style={styles.gradient}>
        <View style={styles.container}>
          <View style={styles.logoCircle}>
            <Image source={require("../assets/images/logo.jpg")} style={styles.logo} />
          </View>
          <Text style={styles.appName}>{APP_NAME}</Text>
          <View style={styles.underline} />
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 30 }} />
        </View>
      </LinearGradient>
    );
  }

  if (loggedIn) return null;

  return (
    <LinearGradient colors={["#e0eafc", "#cfdef3", "#f9fafe"]} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.logoCircle}>
          <Image source={require("../assets/images/logo.jpg")} style={styles.logo} />
        </View>
        <Text style={styles.appName}>{APP_NAME}</Text>
        <View style={styles.underline} />
        <Text style={styles.subtitle}>Welcome to your digital library</Text>
        <View style={styles.iconRow}>
          <MaterialCommunityIcons name="bookshelf" size={28} color="#007AFF" style={styles.icon} />
          <FontAwesome5 name="book-reader" size={26} color="#34A853" style={styles.icon} />
          <MaterialCommunityIcons name="library" size={28} color="#FF9500" style={styles.icon} />
          <MaterialIcons name="emoji-objects" size={28} color="#FF3B30" style={styles.icon} />
        </View>
        <Text style={styles.quote}>
          {`"${QUOTES[quoteIdx]}"`}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.glassButton} onPress={() => router.push("/login") }>
            <MaterialIcons name="login" size={22} color="#007AFF" />
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.glassButton, { backgroundColor: 'rgba(52,168,83,0.13)', borderColor: '#34A853' }]} onPress={() => router.push("/register") }>
            <MaterialIcons name="person-add" size={22} color="#34A853" />
            <Text style={[styles.buttonText, { color: '#34A853' }]}>Register</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.learnMore} onPress={() => setModalVisible(true)}>
          <MaterialIcons name="info-outline" size={20} color="#007AFF" />
          <Text style={styles.learnMoreText}>Learn More</Text>
        </TouchableOpacity>
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>About This App</Text>
              <Text style={styles.modalDesc}>
                This Library Management System helps you manage books, members, borrowing, overdue penalties, and reports—all in one place. Fast, simple, and beautiful.
              </Text>
              <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-medium',
  },
  underline: {
    width: 60,
    height: 4,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    marginHorizontal: 8,
  },
  quote: {
    fontSize: 15,
    color: '#444',
    fontStyle: 'italic',
    marginTop: 10,
    marginBottom: 18,
    textAlign: 'center',
    paddingHorizontal: 10,
    minHeight: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 10,
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
    marginHorizontal: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#007AFF",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
    letterSpacing: 0.2,
  },
  learnMore: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,122,255,0.07)',
  },
  learnMoreText: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  modalDesc: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 18,
  },
  modalClose: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 4,
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
