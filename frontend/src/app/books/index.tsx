import React from 'react';
import { router } from 'expo-router';
import { useLibrary } from '../../context/LibraryProvider';
import SearchScreen from '../../screens/SearchScreen';
export default function Screen() {
  const s = useLibrary();
  return <SearchScreen query={s.query} setQuery={s.setQuery} results={s.results} onBack={() => router.replace('/(tabs)')} onSearch={() => router.push('/books/results')} />;
}
