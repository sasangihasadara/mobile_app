import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LibraryProvider } from '../context/LibraryProvider';
export default function RootLayout() {
  return <SafeAreaProvider><LibraryProvider><Stack screenOptions={{
        headerShown: false
      }} /></LibraryProvider></SafeAreaProvider>;
}
