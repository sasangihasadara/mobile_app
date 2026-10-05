import React from 'react';
import { router } from 'expo-router';
import { useLibrary } from '../../context/LibraryProvider';
import RegisterScreen from '../../screens/RegisterScreen';
export default function Screen() {
  const s = useLibrary();
  return <RegisterScreen busy={s.busy} onBack={() => router.replace('/(auth)/login')} onComplete={details => s.authenticate('register', details)} />;
}
