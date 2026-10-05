import React from 'react';
import { router } from 'expo-router';
import { useLibrary } from '../../context/LibraryProvider';
import HomeScreen from '../../screens/HomeScreen';
import { Platform } from 'react-native';
import DesktopPortal from '../../components/DesktopPortal';
export default function Screen() {
  const s = useLibrary();
  if (Platform.OS === 'web') return <DesktopPortal />;
  return <HomeScreen user={s.user} busy={s.busy} onLogout={s.logout} catalogue={s.catalogue} onSearch={() => router.push('/books')} onReservations={s.showReservations} onRoom={() => router.push('/seats')} openBook={s.openBook} />;
}
