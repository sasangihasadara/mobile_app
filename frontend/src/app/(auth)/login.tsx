import React from 'react';
import { router } from 'expo-router';
import { useLibrary } from '../../context/LibraryProvider';
import LoginScreen from '../../screens/LoginScreen';
export default function Screen() {
  const s = useLibrary();
  return <LoginScreen busy={s.busy} email={s.email} password={s.password} setEmail={s.setEmail} setPassword={s.setPassword} onLogin={() => s.authenticate('login', {
    email: s.email,
    password: s.password
  })} onRegister={() => router.push('/(auth)/register')} onForgot={() => router.push('/(auth)/forgot-password')} />;
}
