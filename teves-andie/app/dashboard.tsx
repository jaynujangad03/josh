import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    books: 0,
    members: 0,
    borrowed: 0,
    overdue: 0,
  });

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
    <LinearGradient colors={["#e0eafc", "#cfdef3"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <MaterialIcons name="menu-book" size={32} color="#007AFF" style={{ marginBottom: 8 }} />
            <Text style={styles.cardLabel}>Total Books</Text>
            <Text style={styles.cardValue}>{stats.books}</Text>
          </View>
          <View style={styles.card}>
            <MaterialIcons name="person" size={32} color="#34A853" style={{ marginBottom: 8 }} />
            <Text style={styles.cardLabel}>Total Members</Text>
            <Text style={styles.cardValue}>{stats.members}</Text>
          </View>
        </View>
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <MaterialIcons name="import-contacts" size={32} color="#FF9500" style={{ marginBottom: 8 }} />
            <Text style={styles.cardLabel}>Books Borrowed</Text>
            <Text style={styles.cardValue}>{stats.borrowed}</Text>
          </View>
          <View style={styles.card}>
            <MaterialIcons name="warning" size={32} color="#FF3B30" style={{ marginBottom: 8 }} />
            <Text style={styles.cardLabel}>Overdue</Text>
            <Text style={styles.cardValue}>{stats.overdue}</Text>
          </View>
        </View>
        <Text style={styles.quickLinksTitle}>Quick Links</Text>
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
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    alignItems: "center",
    backgroundColor: "#f9fafe",
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    marginTop: 12,
    color: '#222',
    letterSpacing: 0.5,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 8,
    alignItems: "center",
    width: 150,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  cardLabel: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginTop: 2,
  },
  quickLinksTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 12,
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
    marginTop: 16,
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
}); 