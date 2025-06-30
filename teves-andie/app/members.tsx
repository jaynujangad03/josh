import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Platform, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";

type Member = {
  name: string;
  email: string;
  id: string;
};

export default function Members() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMember, setNewMember] = useState<Member>({ name: "", email: "", id: "" });
  const [search, setSearch] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editMemberIndex, setEditMemberIndex] = useState<number | null>(null);
  const [editMember, setEditMember] = useState<Member>({ name: "", email: "", id: "" });
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewMember, setViewMember] = useState<Member | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const membersStr = await AsyncStorage.getItem("members");
    setMembers(membersStr ? JSON.parse(membersStr) : []);
  };

  const saveMembers = async (updatedMembers: Member[]) => {
    await AsyncStorage.setItem("members", JSON.stringify(updatedMembers));
    setMembers(updatedMembers);
  };

  function isValidEmail(email: string) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  function showSuccess(message: string) {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Success", message);
    }
  }

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email || !newMember.id) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (!isValidEmail(newMember.email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    if (members.some((m) => m.id === newMember.id)) {
      Alert.alert("Error", "A member with this ID already exists.");
      return;
    }
    const updatedMembers: Member[] = [...members, newMember];
    await saveMembers(updatedMembers);
    setModalVisible(false);
    setNewMember({ name: "", email: "", id: "" });
    showSuccess("Member added successfully!");
  };

  const handleEditMember = (index: number) => {
    const member = members[index];
    setEditMemberIndex(index);
    setEditMember({ ...member });
    setEditModalVisible(true);
  };

  const handleSaveEditMember = async () => {
    if (!editMember.name || !editMember.email || !editMember.id) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (!isValidEmail(editMember.email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    if (editMemberIndex === null) return;
    if (members.some((m, i) => m.id === editMember.id && i !== editMemberIndex)) {
      Alert.alert("Error", "A member with this ID already exists.");
      return;
    }
    const updatedMembers = [...members];
    updatedMembers[editMemberIndex] = { ...editMember };
    await saveMembers(updatedMembers);
    setEditModalVisible(false);
    setEditMemberIndex(null);
    setEditMember({ name: "", email: "", id: "" });
    showSuccess("Member updated successfully!");
  };

  const handleDeleteMember = (index: number) => {
    Alert.alert(
      'Delete Member',
      'Are you sure you want to delete this member?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          const updatedMembers = members.filter((_, i) => i !== index);
          await saveMembers(updatedMembers);
          showSuccess("Member deleted successfully!");
        }},
      ]
    );
  };

  const filteredMembers = members.filter(
    (m: Member) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Member Management</Text>
      <TextInput
        style={styles.search}
        placeholder="Search by name, email, or ID..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#888"
      />
      <FlatList
        data={filteredMembers}
        keyExtractor={(_, idx) => idx.toString()}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="person" size={48} color="#ccc" />
            <Text style={{ marginTop: 16, color: '#888', fontSize: 16 }}>No members found.</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.memberItem}>
            <MaterialIcons name="person" size={32} color="#007AFF" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.memberName} onPress={() => { setViewMember(item); setViewModalVisible(true); }}>{item.name}</Text>
              <Text style={styles.memberMeta}>Email: {item.email}</Text>
              <Text style={styles.memberMeta}>ID: {item.id}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => handleEditMember(index)}>
              <MaterialIcons name="edit" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteMember(index)}>
              <MaterialIcons name="delete" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        style={{ width: '100%' }}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="person-add" size={22} color="#fff" />
        <Text style={styles.addBtnText}>Add New Member</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/dashboard')}>
        <MaterialIcons name="arrow-back" size={18} color="#fff" />
        <Text style={styles.backBtnText}>Back to Dashboard</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Member</Text>
            <TextInput style={styles.input} placeholder="Name" value={newMember.name} onChangeText={t => setNewMember({ ...newMember, name: t })} />
            <TextInput style={styles.input} placeholder="Email" value={newMember.email} onChangeText={t => setNewMember({ ...newMember, email: t })} />
            <TextInput style={styles.input} placeholder="ID" value={newMember.id} onChangeText={t => setNewMember({ ...newMember, id: t })} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleAddMember}>
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
            <Text style={styles.modalTitle}>Edit Member</Text>
            <TextInput style={styles.input} placeholder="Name" value={editMember.name} onChangeText={t => setEditMember({ ...editMember, name: t })} />
            <TextInput style={styles.input} placeholder="Email" value={editMember.email} onChangeText={t => setEditMember({ ...editMember, email: t })} />
            <TextInput style={styles.input} placeholder="ID" value={editMember.id} onChangeText={t => setEditMember({ ...editMember, id: t })} />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEditMember}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setEditModalVisible(false); setEditMemberIndex(null); }}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={viewModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Member Details</Text>
            {viewMember && (
              <>
                <Text style={styles.memberMeta}><Text style={{fontWeight:'bold'}}>Name:</Text> {viewMember.name}</Text>
                <Text style={styles.memberMeta}><Text style={{fontWeight:'bold'}}>Email:</Text> {viewMember.email}</Text>
                <Text style={styles.memberMeta}><Text style={{fontWeight:'bold'}}>ID:</Text> {viewMember.id}</Text>
              </>
            )}
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setViewModalVisible(false); setViewMember(null); }}>
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
  memberItem: {
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
  memberName: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#222',
    letterSpacing: 0.2,
  },
  memberMeta: {
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