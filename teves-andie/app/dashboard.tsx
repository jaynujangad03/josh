import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const APP_NAME = "Library Management System";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    books: 0,
    members: 0,
    borrowed: 0,
    overdue: 0,
  });
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const booksStr = await AsyncStorage.getItem("books");
      const membersStr = await AsyncStorage.getItem("members");
      const logsStr = await AsyncStorage.getItem("borrowLogs");
      const books = booksStr ? JSON.parse(booksStr) : [];
      const members = membersStr ? JSON.parse(membersStr) : [];
      const logs = logsStr ? JSON.parse(logsStr) : [];
      const borrowed = logs.filter((l: any) => !l.returned).length;
      const overdue = logs.filter((l: any) => !l.returned && new Date(l.dueDate) < new Date()).length;
      setStats({
        books: books.length,
        members: members.length,
        borrowed,
        overdue,
      });
    };
    loadStats();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("session");
    router.replace("/");
  };

  return (
    <LinearGradient colors={["#e0eafc", "#cfdef3", "#f9fafe"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.logoCircle}>
          <Image source={require("../assets/images/logo.jpg")} style={styles.logo} />
        </View>
        <Text style={styles.appName}>{APP_NAME}</Text>
        <View style={styles.underline} />
        <Text style={styles.title}>Dashboard</Text>
        {/* 2x2 Grid for summary cards */}
        <View style={styles.gridContainer}>
          <TouchableOpacity style={[styles.gridBox, { backgroundColor: 'rgba(0,122,255,0.10)', borderColor: '#007AFF' }]} onPress={() => router.push('/books')} activeOpacity={0.85}>
            <MaterialIcons name="menu-book" size={32} color="#007AFF" />
            <Text style={styles.gridLabel}>Total Books</Text>
            <Text style={styles.gridValue}>{stats.books}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridBox, { backgroundColor: 'rgba(52,168,83,0.10)', borderColor: '#34A853' }]} onPress={() => router.push('/members')} activeOpacity={0.85}>
            <MaterialIcons name="person" size={32} color="#34A853" />
            <Text style={styles.gridLabel}>Total Members</Text>
            <Text style={styles.gridValue}>{stats.members}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridBox, { backgroundColor: 'rgba(255,149,0,0.10)', borderColor: '#FF9500' }]} onPress={() => router.push('/borrow')} activeOpacity={0.85}>
            <MaterialIcons name="import-contacts" size={32} color="#FF9500" />
            <Text style={styles.gridLabel}>Books Borrowed</Text>
            <Text style={styles.gridValue}>{stats.borrowed}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridBox, { backgroundColor: 'rgba(229,57,53,0.10)', borderColor: '#E53935' }]} onPress={() => router.push('/overdue')} activeOpacity={0.85}>
            <MaterialIcons name="warning" size={32} color="#E53935" />
            <Text style={styles.gridLabel}>Overdue</Text>
            <Text style={styles.gridValue}>{stats.overdue}</Text>
          </TouchableOpacity>
        </View>
        {/* Quick Links and Logout */}
        <TouchableOpacity style={styles.quickLinksToggle} onPress={() => setShowLinks((v) => !v)}>
          <MaterialIcons name={showLinks ? "expand-less" : "expand-more"} size={26} color="#007AFF" />
          <Text style={styles.quickLinksTitle}>Features</Text>
        </TouchableOpacity>
        {showLinks && (
          <View style={styles.linksContainer}>
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/books')}>
              <MaterialIcons name="menu-book" size={20} color="#fff" />
              <Text style={styles.linkText}>Book Management</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/members')}>
              <MaterialIcons name="person" size={20} color="#fff" />
              <Text style={styles.linkText}>Member Management</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/borrow')}>
              <MaterialIcons name="swap-horiz" size={20} color="#fff" />
              <Text style={styles.linkText}>Borrow & Return</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/overdue')}>
              <MaterialIcons name="warning" size={20} color="#fff" />
              <Text style={styles.linkText}>Overdue & Penalties</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/reports')}>
              <MaterialIcons name="history" size={20} color="#fff" />
              <Text style={styles.linkText}>Reports / History</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>© {new Date().getFullYear()} Library Management System · v1.0</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    letterSpacing: 0.5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 2,
    width: '100%',
  },
  gridBox: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  gridLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  gridValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 6,
    marginBottom: 2,
  },
  quickLinksTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
    alignSelf: "flex-start",
    color: '#222',
    letterSpacing: 0.2,
  },
  linksContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
  },
  linkButton: {
    flexDirection: 'row',
    width: 260,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    marginBottom: 12,
    alignItems: "center",
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
  },
  linkText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
    letterSpacing: 0.2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    justifyContent: 'center',
  },
  logoutText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
    letterSpacing: 0.2,
  },
  quickLinksToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 2,
    marginBottom: 0,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,122,255,0.07)',
  },
  footer: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 24,
  },
}); 