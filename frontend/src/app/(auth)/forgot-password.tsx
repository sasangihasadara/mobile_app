import React from 'react';
import { router } from 'expo-router';
import { useLibrary } from '../../context/LibraryProvider';
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen';
export default function Screen() {
  const s = useLibrary();
  return <ForgotPasswordScreen initialEmail={s.email} onBack={() => router.replace('/(auth)/login')} />;
}
