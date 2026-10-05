import React from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import WelcomeScreen from '../screens/WelcomeScreen';
import DesktopPortal from '../components/DesktopPortal';
export default function Index() {
  if (Platform.OS === 'web') return <DesktopPortal />;
  return <WelcomeScreen onStart={() => router.push('/(auth)/login')} onPreview={() => router.push('/explore')} />;
}
