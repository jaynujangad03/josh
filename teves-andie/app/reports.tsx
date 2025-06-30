import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Reports() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [memberFilter, setMemberFilter] = useState("");
  const [bookFilter, setBookFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const logsStr = await AsyncStorage.getItem("borrowLogs");
    setLogs(logsStr ? JSON.parse(logsStr) : []);
    const membersStr = await AsyncStorage.getItem("members");
    setMembers(membersStr ? JSON.parse(membersStr) : []);
    const booksStr = await AsyncStorage.getItem("books");
    setBooks(booksStr ? JSON.parse(booksStr) : []);
  };

  const filteredLogs = logs.filter((log) => {
    if (memberFilter && log.member !== memberFilter) return false;
    if (bookFilter && log.book !== bookFilter) return false;
    if (dateFrom && log.borrowDate < dateFrom) return false;
    if (dateTo && log.borrowDate > dateTo) return false;
    return true;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports / History</Text>
      <View style={styles.filters}>
        <Text style={styles.filterLabel}>Member:</Text>
        <FlatList
          data={["", ...members.map((m: any) => m.name)]}
          horizontal
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterBtn, memberFilter === item && styles.selectedBtn]}
              onPress={() => setMemberFilter(item)}
            >
              <Text style={styles.filterBtnText}>{item || "All"}</Text>
            </TouchableOpacity>
          )}
          style={{ marginBottom: 8, maxHeight: 40 }}
        />
        <Text style={styles.filterLabel}>Book:</Text>
        <FlatList
          data={["", ...books.map((b: any) => b.title)]}
          horizontal
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterBtn, bookFilter === item && styles.selectedBtn]}
              onPress={() => setBookFilter(item)}
            >
              <Text style={styles.filterBtnText}>{item || "All"}</Text>
            </TouchableOpacity>
          )}
          style={{ marginBottom: 8, maxHeight: 40 }}
        />
        <Text style={styles.filterLabel}>Date From:</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={dateFrom}
          onChangeText={setDateFrom}
          placeholderTextColor="#888"
        />
        <Text style={styles.filterLabel}>Date To:</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={dateTo}
          onChangeText={setDateTo}
          placeholderTextColor="#888"
        />
      </View>
      <FlatList
        data={filteredLogs}
        keyExtractor={(_, idx) => idx.toString()}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="history" size={48} color="#ccc" />
            <Text style={{ marginTop: 16, color: '#888', fontSize: 16 }}>No logs found.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <MaterialIcons name="history" size={32} color="#007AFF" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.logBook}>{item.book}</Text>
              <Text style={styles.logMeta}>Member: {item.member}</Text>
              <Text style={styles.logMeta}>Borrowed: {item.borrowDate}</Text>
              <Text style={styles.logMeta}>Due: {item.dueDate}</Text>
              {item.returned ? (
                <Text style={[styles.logMeta, { color: '#34A853' }]}>Returned: {item.returnDate}</Text>
              ) : (
                <Text style={[styles.logMeta, { color: '#007AFF' }]}>Not Returned</Text>
              )}
            </View>
          </View>
        )}
        style={{ width: '100%' }}
      />
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/dashboard')}>
        <MaterialIcons name="arrow-back" size={18} color="#fff" />
        <Text style={styles.backBtnText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafe',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 10,
    color: '#222',
    letterSpacing: 0.5,
  },
  filters: {
    width: '100%',
    marginBottom: 16,
  },
  filterLabel: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 2,
  },
  filterBtn: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedBtn: {
    backgroundColor: '#007AFF',
  },
  filterBtnText: {
    color: '#222',
    fontWeight: 'bold',
  },
  input: {
    width: 140,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 10,
    marginBottom: 8,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  logBook: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#222',
    letterSpacing: 0.2,
  },
  logMeta: {
    fontSize: 15,
    color: '#555',
    marginBottom: 1,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: '#aaa',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 1,
  },
  backBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
}); 