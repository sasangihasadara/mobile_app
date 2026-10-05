import React from 'react';
import { router, Redirect, useLocalSearchParams } from 'expo-router';
import { useLibrary } from '../../context/LibraryProvider';
import ReserveBookScreen from '../../screens/ReserveBookScreen';
export default function Screen() {
  const s = useLibrary();
  const {
    id
  } = useLocalSearchParams<{
    id?: string;
  }>();
  const book = id ? s.catalogue.find(b => b.id === id) : s.selectedBook;
  if (!book) return <Redirect href="/books" />;
  if (!s.user) return <Redirect href='/(auth)/login' />;
  return <ReserveBookScreen busy={s.busy} book={book} onBack={() => router.back()} onConfirm={pickup => s.reserveBook(pickup, book)} onHome={() => router.replace('/(tabs)')} onSearch={() => router.push('/books')} onHolds={s.showReservations} />;
}
