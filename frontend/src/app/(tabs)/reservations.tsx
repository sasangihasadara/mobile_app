import React from 'react';
import { router, Redirect } from 'expo-router';
import { useLibrary } from '../../context/LibraryProvider';
import ReservationsScreen from '../../screens/ReservationsScreen';
export default function Screen() {
  const s = useLibrary();
  if (!s.user) return <Redirect href="/(auth)/login" />;
  return <ReservationsScreen busy={s.busy} onCancelAll={s.cancelAll} items={s.reserved} onBack={() => router.replace('/(tabs)')} onSearch={() => router.push('/books')} onCancel={s.cancelReservation} />;
}
