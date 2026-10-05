import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { router, type Href } from 'expo-router';
import { api, setToken } from '../services/api';
import books from '../../data/catalogue.json';
import type { Book, Reservation, User, Credentials, Pickup } from '../types/library';
const paths: Record<string, Href> = {
  welcome: '/',
  login: '/(auth)/login',
  home: '/(tabs)',
  reservations: '/(tabs)/reservations',
  confirmation: '/books/confirmation'
};
function useLibraryState() {
  const setScreen = (screen: string) => router.replace(paths[screen] || '/');
  const [catalogue, setCatalogue] = useState<Book[]>(books);
  const [query, setQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book>(books[0]);
  const [reserved, setReserved] = useState<Reservation[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const working = useRef(false);
  const [confirmation, setConfirmation] = useState<Reservation | null>(null);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return catalogue;
    return catalogue.filter(book => `${book.title} ${book.author} ${book.isbn} ${book.category}`.toLowerCase().includes(term));
  }, [query, catalogue]);
  const run = async (task: () => Promise<void>) => {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    try {
      await task();
    } catch (error) {
      Alert.alert('Library', error instanceof Error ? error.message : 'Unexpected error. Please try again.');
    } finally {
      working.current = false;
      setBusy(false);
    }
  };
  const refresh = async () => {
    const [catalog, mine] = await Promise.all([api('/books'), api('/reservations')]);
    setCatalogue(catalog.books);
    setReserved(mine.reservations);
  };
  const authenticate = (route: string, details: Credentials) => run(async () => {
    const data = await api('/auth/' + route, 'POST', details);
    setToken(data.token);
    setUser(data.user);
    setPassword('');
    await refresh();
    setScreen('home');
  });
  const logout = () => run(async () => {
    await api('/auth/logout', 'POST');
    setToken(null);
    setUser(null);
    setReserved([]);
    setScreen('login');
  });
  const showReservations = () => {
    if (!user) {
      setScreen('login');
      return;
    }
    run(async () => {
      await refresh();
      setScreen('reservations');
    });
  };
  const openBook = (book: Book) => run(async () => {
    const data = await api('/books');
    setCatalogue(data.books);
    setSelectedBook(data.books.find((item: Book) => item.id === book.id) || book);
    router.push({
      pathname: '/books/[id]',
      params: {
        id: book.id
      }
    });
  });
  const reserveBook = (pickup: Pickup, bookOverride?: Book) => {
    if (!user) {
      setScreen('login');
      return;
    }
    run(async () => {
      const book = bookOverride || selectedBook;
      const data = await api('/reservations', 'POST', {
        bookId: book.id,
        ...pickup
      });
      setCatalogue(data.books);
      setReserved(data.reservations);
      setConfirmation(data.reservation);
      setScreen('confirmation');
    });
  };
  const cancelReservation = (book: Reservation) => run(async () => {
    const data = await api('/reservations/' + book.reservationId, 'DELETE');
    setCatalogue(data.books);
    setReserved(data.reservations);
  });
  const cancelAll = () => run(async () => {
    try {
      for (const book of reserved) await api('/reservations/' + book.reservationId, 'DELETE');
    } finally {
      await refresh();
    }
  });
  return {
    catalogue,
    query,
    setQuery,
    results,
    selectedBook,
    setSelectedBook,
    reserved,
    email,
    password,
    setEmail,
    setPassword,
    user,
    busy,
    confirmation,
    refresh,
    authenticate,
    logout,
    showReservations,
    openBook,
    reserveBook,
    cancelReservation,
    cancelAll
  };
}
const LibraryContext = createContext<ReturnType<typeof useLibraryState> | null>(null);
export function LibraryProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return <LibraryContext.Provider value={useLibraryState()}>{children}</LibraryContext.Provider>;
}
export function useLibrary() {
  const value = useContext(LibraryContext);
  if (!value) throw new Error('LibraryProvider is missing');
  return value;
}
