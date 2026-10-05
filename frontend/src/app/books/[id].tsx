import React, { useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { useLibrary } from '../../context/LibraryProvider';
import ShelfMapScreen from '../../screens/ShelfMapScreen';
export default function Details() {
  const s = useLibrary();
  const {
    id
  } = useLocalSearchParams<{
    id: string;
  }>();
  const book = s.catalogue.find(b => b.id === id);
  useEffect(() => {
    if (book) s.setSelectedBook(book);
  }, [book, s.setSelectedBook]);
  if (!book) return <View><Text>Book not found.</Text><Text onPress={() => router.replace('/books')}>Back to catalogue</Text></View>;
  return <ShelfMapScreen book={book} onBack={() => router.replace('/books/results')} onReserve={() => router.push({
    pathname: '/books/reserve',
    params: {
      id: book.id
    }
  })} onHome={() => router.replace('/(tabs)')} onSearch={() => router.push('/books')} onHolds={s.showReservations} />;
}
