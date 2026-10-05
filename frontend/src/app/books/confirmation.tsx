import React from 'react';
import { router } from 'expo-router';
import { useLibrary } from '../../context/LibraryProvider';
import ConfirmationScreen from '../../screens/ConfirmationScreen';
export default function Screen() {
  const s = useLibrary();
  return <ConfirmationScreen book={s.confirmation || s.selectedBook} onHome={() => router.replace('/(tabs)')} onSearch={() => router.push('/books')} onReservations={s.showReservations} />;
}
