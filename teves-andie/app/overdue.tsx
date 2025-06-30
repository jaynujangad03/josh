import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function daysOverdue(dueDate: string) {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export default function Overdue() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const logsStr = await AsyncStorage.getItem("borrowLogs");
    setLogs(logsStr ? JSON.parse(logsStr) : []);
  };

  const saveLogs = async (updatedLogs: any[]) => {
    await AsyncStorage.setItem("borrowLogs", JSON.stringify(updatedLogs));
    setLogs(updatedLogs);
  };

  const handleMarkPaid = async (idx: number) => {
    const updatedLogs = [...logs];
    updatedLogs[idx].penaltyPaid = true;
    await saveLogs(updatedLogs);
  };

  const overdueLogs = logs
    .map((log, idx) => ({ ...log, idx }))
    .filter(
      (log) =>
        !log.returned &&
        new Date(log.dueDate) < new Date() &&
        !log.penaltyPaid
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overdue & Penalties</Text>
      <FlatList
        data={overdueLogs}
        keyExtractor={(_, idx) => idx.toString()}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="warning" size={48} color="#ccc" />
            <Text style={{ marginTop: 16, color: '#888', fontSize: 16 }}>No overdue borrow logs.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const days = daysOverdue(item.dueDate);
          const penalty = days * 5;
          return (
            <View style={styles.logItem}>
              <MaterialIcons name="warning" size={32} color="#FF3B30" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.logBook}>{item.book}</Text>
                <Text style={styles.logMeta}>Member: {item.member}</Text>
                <Text style={styles.logMeta}>Due: {item.dueDate}</Text>
                <Text style={styles.logMeta}>Days Overdue: {days}</Text>
                <Text style={styles.logMeta}>Penalty: ₱{penalty}</Text>
                {item.penaltyPaid && (
                  <Text style={{ color: '#34A853', fontWeight: 'bold' }}>Penalty Paid</Text>
                )}
              </View>
              {!item.penaltyPaid && (
                <TouchableOpacity style={styles.paidBtn} onPress={() => handleMarkPaid(item.idx)}>
                  <MaterialIcons name="check" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
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
  paidBtn: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  paidBtnText: {
    color: '#fff',
    fontWeight: 'bold',
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