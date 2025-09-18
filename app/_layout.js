import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { SplashScreen } from 'expo-router';
import { View, Text } from 'react-native';

// Prevent the splash screen from auto-hiding before we are ready.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [isAuthLoading, setAuthLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (currentUser) {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists()) {
                        setRole(userDoc.data().role);
                    }
                    setUser(currentUser);
                } else {
                    setUser(null);
                    setRole(null);
                }
            } catch (e) {
                console.error("Auth state change error:", e);
                // In case of error, ensure user is logged out.
                setUser(null);
                setRole(null);
            } finally {
                setAuthLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Wait until the auth state is determined.
        if (isAuthLoading) {
            return;
        }

        const inAuthGroup = segments[0] === '(auth)';

        // If the user is not signed in and the initial segment is not anything in the auth group,
        // redirect them to the sign-in screen.
        if (!user && !inAuthGroup) {
            router.replace('/(auth)/login');
        }
        // If the user is signed in and the initial segment is in the auth group,
        // redirect them to the correct dashboard.
        else if (user && inAuthGroup) {
            router.replace(role === 'admin' ? '/(admin)/dashboard' : '/(user)/profile');
        }

        // Once navigation is settled, hide the splash screen.
        SplashScreen.hideAsync();

    }, [isAuthLoading, user, role, segments, router]);

    // Render nothing while we are determining the auth state.
    // The splash screen will be visible.
    if (isAuthLoading) {
        return null;
    }

    return <Slot />;
}
