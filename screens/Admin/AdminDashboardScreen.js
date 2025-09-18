import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Button } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const AdminDashboardScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = await getDocs(collection(db, 'users'));
            const usersData = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
            setFilteredUsers(usersData);
        };
        fetchUsers();
    }, []);

    const handleSearch = (text) => {
        setSearch(text);
        const filtered = users.filter(user =>
            user.name?.toLowerCase().includes(text.toLowerCase()) ||
            user.email?.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <TextInput
                style={styles.input}
                placeholder="Search by name or email"
                value={search}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <Text>{item.name}</Text>
                        <Text>{item.email}</Text>
                    </View>
                )}
            />
            <Button title="Logout" onPress={() => auth.signOut()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
    },
    userItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default AdminDashboardScreen;
