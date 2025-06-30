import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Platform, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
function getDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

export default function Borrow() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [borrowDate, setBorrowDate] = useState(getToday());
  const [dueDate, setDueDate] = useState(getDueDate());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const logsStr = await AsyncStorage.getItem("borrowLogs");
    setLogs(logsStr ? JSON.parse(logsStr) : []);
    const booksStr = await AsyncStorage.getItem("books");
    setBooks(booksStr ? JSON.parse(booksStr) : []);
    const membersStr = await AsyncStorage.getItem("members");
    setMembers(membersStr ? JSON.parse(membersStr) : []);
  };

  const saveLogs = async (updatedLogs: any[]) => {
    await AsyncStorage.setItem("borrowLogs", JSON.stringify(updatedLogs));
    setLogs(updatedLogs);
  };

  function showSuccess(message: string) {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Success", message);
    }
  }

  const handleBorrow = async () => {
    if (!selectedBook || !selectedMember || !borrowDate || !dueDate) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    // Check if book is available
    const bookIdx = books.findIndex((b: any) => b.title === selectedBook);
    if (bookIdx === -1 || books[bookIdx].copies < 1) {
      Alert.alert("Error", "Book not available.");
      return;
    }
    // Decrement book copies
    const updatedBooks = [...books];
    updatedBooks[bookIdx].copies -= 1;
    await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
    setBooks(updatedBooks);
    // Add borrow log
    const newLog = {
      book: selectedBook,
      member: selectedMember,
      borrowDate,
      dueDate,
      returned: false,
      returnDate: null,
    };
    const updatedLogs = [...logs, newLog];
    await saveLogs(updatedLogs);
    setModalVisible(false);
    setSelectedBook("");
    setSelectedMember("");
    setBorrowDate(getToday());
    setDueDate(getDueDate());
    showSuccess("Book borrowed successfully!");
  };

  const handleReturn = async (idx: number) => {
    const updatedLogs = [...logs];
    updatedLogs[idx].returned = true;
    updatedLogs[idx].returnDate = getToday();
    // Increment book copies
    const bookIdx = books.findIndex((b: any) => b.title === updatedLogs[idx].book);
    if (bookIdx !== -1) {
      const updatedBooks = [...books];
      updatedBooks[bookIdx].copies += 1;
      await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
      setBooks(updatedBooks);
    }
    await saveLogs(updatedLogs);
    showSuccess("Book returned successfully!");
  };

  function isOverdue(log: any) {
    if (log.returned) return false;
    return new Date(log.dueDate) < new Date();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Borrow & Return</Text>
      <FlatList
        data={logs}
        keyExtractor={(_, idx) => idx.toString()}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="swap-horiz" size={48} color="#ccc" />
            <Text style={{ marginTop: 16, color: '#888', fontSize: 16 }}>No borrow logs found.</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.logItem}>
            <MaterialIcons name={item.returned ? "check-circle" : "hourglass-empty"} size={32} color={item.returned ? "#34A853" : isOverdue(item) ? "#FF3B30" : "#007AFF"} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.logBook}>{item.book}</Text>
              <Text style={styles.logMeta}>Member: {item.member}</Text>
              <Text style={styles.logMeta}>Borrowed: {item.borrowDate}</Text>
              <Text style={styles.logMeta}>Due: {item.dueDate}</Text>
              {item.returned ? (
                <Text style={[styles.logMeta, { color: '#34A853' }]}>Returned: {item.returnDate}</Text>
              ) : isOverdue(item) ? (
                <Text style={[styles.logMeta, { color: '#FF3B30' }]}>Overdue!</Text>
              ) : (
                <Text style={[styles.logMeta, { color: '#007AFF' }]}>Not Returned</Text>
              )}
            </View>
            {!item.returned && (
              <TouchableOpacity style={styles.returnBtn} onPress={() => handleReturn(index)}>
                <MaterialIcons name="undo" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
        style={{ width: '100%' }}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={22} color="#fff" />
        <Text style={styles.addBtnText}>Borrow a Book</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/dashboard')}>
        <MaterialIcons name="arrow-back" size={18} color="#fff" />
        <Text style={styles.backBtnText}>Back to Dashboard</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Borrow a Book</Text>
            <Text style={styles.label}>Select Member</Text>
            <FlatList
              data={members}
              keyExtractor={(_, idx) => idx.toString()}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.selectBtn, selectedMember === item.name && styles.selectedBtn]}
                  onPress={() => setSelectedMember(item.name)}
                >
                  <Text style={styles.selectBtnText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={{ marginBottom: 10, maxHeight: 50 }}
            />
            <Text style={styles.label}>Select Book</Text>
            <FlatList
              data={books.filter((b: any) => b.copies > 0)}
              keyExtractor={(_, idx) => idx.toString()}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.selectBtn, selectedBook === item.title && styles.selectedBtn]}
                  onPress={() => setSelectedBook(item.title)}
                >
                  <Text style={styles.selectBtnText}>{item.title}</Text>
                </TouchableOpacity>
              )}
              style={{ marginBottom: 10, maxHeight: 50 }}
            />
            <Text style={styles.label}>Borrow Date</Text>
            <TextInput style={styles.input} value={borrowDate} onChangeText={setBorrowDate} placeholder="YYYY-MM-DD" />
            <Text style={styles.label}>Due Date</Text>
            <TextInput style={styles.input} value={dueDate} onChangeText={setDueDate} placeholder="YYYY-MM-DD" />
            <TouchableOpacity style={styles.saveBtn} onPress={handleBorrow}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  returnBtn: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  returnBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    backgroundColor: '#34A853',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 10,
    shadowColor: '#34A853',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 0.2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 340,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  selectBtn: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedBtn: {
    backgroundColor: '#007AFF',
  },
  selectBtnText: {
    color: '#222',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#34A853',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#aaa',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  cancelBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
}); 