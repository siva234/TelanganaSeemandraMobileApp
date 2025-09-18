import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useLocalSearchParams } from 'expo-router';

const UserDetailsScreen = () => {
    const { userId } = useLocalSearchParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (userId) {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    setUser(userDoc.data());
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [userId]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (!user) {
        return <Text>User not found.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Details</Text>
            <Text>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Age: {user.age}</Text>
            <Text>Location: {user.location}</Text>
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
});

export default UserDetailsScreen;
