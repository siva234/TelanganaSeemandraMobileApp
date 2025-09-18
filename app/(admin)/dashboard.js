import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useRouter } from 'expo-router';

const AdminDashboardScreen = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await getDocs(collection(db, 'users'));
      const usersData = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setFilteredUsers(usersData);
    };
    fetchUsers();
  }, []);

  const applyFilters = () => {
    let filtered = users.filter(user =>
    (user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()))
    );

    if (locationFilter) {
      filtered = filtered.filter(user => user.location?.toLowerCase().includes(locationFilter.toLowerCase()));
    }

    if (ageFilter) {
      filtered = filtered.filter(user => user.age && user.age.toString() === ageFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      router.replace('/(auth)/login');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by name or email"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={applyFilters}
      />
      <TextInput
        style={styles.input}
        placeholder="Filter by location"
        value={locationFilter}
        onChangeText={setLocationFilter}
        onSubmitEditing={applyFilters}
      />
      <TextInput
        style={styles.input}
        placeholder="Filter by age"
        value={ageFilter}
        onChangeText={setAgeFilter}
        keyboardType="numeric"
        onSubmitEditing={applyFilters}
      />
      <Button title="Apply Filters" onPress={applyFilters} />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({ pathname: '/(admin)/userDetails', params: { userId: item.id } })}>
            <View style={styles.userItem}>
              <Text>{item.name}</Text>
              <Text>{item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Logout" onPress={handleLogout} />
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
