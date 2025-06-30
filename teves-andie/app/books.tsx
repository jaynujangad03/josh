import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Platform, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";

type Book = {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  copies: number;
};

export default function Books() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newBook, setNewBook] = useState<{ title: string; author: string; isbn: string; genre: string; copies: string }>({ title: "", author: "", isbn: "", genre: "", copies: "" });
  const [search, setSearch] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editBookIndex, setEditBookIndex] = useState<number | null>(null);
  const [editBook, setEditBook] = useState<{ title: string; author: string; isbn: string; genre: string; copies: string }>({ title: "", author: "", isbn: "", genre: "", copies: "" });
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewBook, setViewBook] = useState<Book | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const booksStr = await AsyncStorage.getItem("books");
    setBooks(booksStr ? JSON.parse(booksStr) : []);
  };

  const saveBooks = async (updatedBooks: Book[]) => {
    await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
    setBooks(updatedBooks);
  };

  function showSuccess(message: string) {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Success", message);
    }
  }

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.isbn || !newBook.genre || !newBook.copies) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (books.some((b) => b.isbn === newBook.isbn)) {
      Alert.alert("Error", "A book with this ISBN already exists.");
      return;
    }
    const updatedBooks: Book[] = [...books, { ...newBook, copies: parseInt(newBook.copies, 10) }];
    await saveBooks(updatedBooks);
    setModalVisible(false);
    setNewBook({ title: "", author: "", isbn: "", genre: "", copies: "" });
    showSuccess("Book added successfully!");
  };

  const handleEditBook = (index: number) => {
    const book = books[index];
    setEditBookIndex(index);
    setEditBook({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      copies: book.copies.toString(),
    });
    setEditModalVisible(true);
  };

  const handleSaveEditBook = async () => {
    if (!editBook.title || !editBook.author || !editBook.isbn || !editBook.genre || !editBook.copies) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (editBookIndex === null) return;
    if (books.some((b, i) => b.isbn === editBook.isbn && i !== editBookIndex)) {
      Alert.alert("Error", "A book with this ISBN already exists.");
      return;
    }
    const updatedBooks = [...books];
    updatedBooks[editBookIndex] = { ...editBook, copies: parseInt(editBook.copies, 10) };
    await saveBooks(updatedBooks);
    setEditModalVisible(false);
    setEditBookIndex(null);
    setEditBook({ title: "", author: "", isbn: "", genre: "", copies: "" });
    showSuccess("Book updated successfully!");
  };

  const handleDeleteBook = (index: number) => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          const updatedBooks = books.filter((_, i) => i !== index);
          await saveBooks(updatedBooks);
          showSuccess("Book deleted successfully!");
        }},
      ]
    );
  };

  const filteredBooks = books.filter(
    (b: Book) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Management</Text>
      <TextInput
        style={styles.search}
        placeholder="Search by title, author, ISBN, genre..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#888"
      />
      <FlatList
        data={filteredBooks}
        keyExtractor={(_, idx) => idx.toString()}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="menu-book" size={48} color="#ccc" />
            <Text style={{ marginTop: 16, color: '#888', fontSize: 16 }}>No books found.</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.bookItem}>
            <MaterialIcons name="menu-book" size={32} color="#007AFF" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.bookTitle} onPress={() => { setViewBook(item); setViewModalVisible(true); }}>{item.title}</Text>
              <Text style={styles.bookMeta}>Author: {item.author}</Text>
              <Text style={styles.bookMeta}>ISBN: {item.isbn}</Text>
              <Text style={styles.bookMeta}>Genre: {item.genre}</Text>
              <Text style={styles.bookMeta}>Available Copies: {item.copies}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => handleEditBook(index)}>
              <MaterialIcons name="edit" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteBook(index)}>
              <MaterialIcons name="delete" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        style={{ width: '100%' }}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={22} color="#fff" />
        <Text style={styles.addBtnText}>Add New Book</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/dashboard')}>
        <MaterialIcons name="arrow-back" size={18} color="#fff" />
        <Text style={styles.backBtnText}>Back to Dashboard</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Book</Text>
            <TextInput style={styles.input} placeholder="Title" value={newBook.title} onChangeText={t => setNewBook({ ...newBook, title: t })} />
            <TextInput style={styles.input} placeholder="Author" value={newBook.author} onChangeText={t => setNewBook({ ...newBook, author: t })} />
            <TextInput style={styles.input} placeholder="ISBN" value={newBook.isbn} onChangeText={t => setNewBook({ ...newBook, isbn: t })} />
            <TextInput style={styles.input} placeholder="Genre" value={newBook.genre} onChangeText={t => setNewBook({ ...newBook, genre: t })} />
            <TextInput style={styles.input} placeholder="Available Copies" value={newBook.copies} onChangeText={t => setNewBook({ ...newBook, copies: t })} keyboardType="numeric" />
            <TouchableOpacity style={styles.saveBtn} onPress={handleAddBook}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Book</Text>
            <TextInput style={styles.input} placeholder="Title" value={editBook.title} onChangeText={t => setEditBook({ ...editBook, title: t })} />
            <TextInput style={styles.input} placeholder="Author" value={editBook.author} onChangeText={t => setEditBook({ ...editBook, author: t })} />
            <TextInput style={styles.input} placeholder="ISBN" value={editBook.isbn} onChangeText={t => setEditBook({ ...editBook, isbn: t })} />
            <TextInput style={styles.input} placeholder="Genre" value={editBook.genre} onChangeText={t => setEditBook({ ...editBook, genre: t })} />
            <TextInput style={styles.input} placeholder="Available Copies" value={editBook.copies} onChangeText={t => setEditBook({ ...editBook, copies: t })} keyboardType="numeric" />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEditBook}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setEditModalVisible(false); setEditBookIndex(null); }}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={viewModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Book Details</Text>
            {viewBook && (
              <>
                <Text style={styles.bookMeta}><Text style={{fontWeight:'bold'}}>Title:</Text> {viewBook.title}</Text>
                <Text style={styles.bookMeta}><Text style={{fontWeight:'bold'}}>Author:</Text> {viewBook.author}</Text>
                <Text style={styles.bookMeta}><Text style={{fontWeight:'bold'}}>ISBN:</Text> {viewBook.isbn}</Text>
                <Text style={styles.bookMeta}><Text style={{fontWeight:'bold'}}>Genre:</Text> {viewBook.genre}</Text>
                <Text style={styles.bookMeta}><Text style={{fontWeight:'bold'}}>Available Copies:</Text> {viewBook.copies}</Text>
              </>
            )}
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setViewModalVisible(false); setViewBook(null); }}>
              <Text style={styles.cancelBtnText}>Close</Text>
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
  search: {
    width: '100%',
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 17,
    backgroundColor: '#fff',
    color: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  bookItem: {
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
  bookTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#222',
    letterSpacing: 0.2,
  },
  bookMeta: {
    fontSize: 15,
    color: '#555',
    marginBottom: 1,
  },
  editBtn: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  deleteBtn: {
    marginLeft: 6,
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
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
    width: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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