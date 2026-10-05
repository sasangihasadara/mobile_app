import React from 'react';
import { router } from 'expo-router';
import { useLibrary } from '../../context/LibraryProvider';
import ResultsScreen from '../../screens/ResultsScreen';
export default function Screen() {
  const s = useLibrary();
  return <ResultsScreen query={s.query} results={s.results} onBack={() => router.replace('/books')} openBook={s.openBook} />;
}
