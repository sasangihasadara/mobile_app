import React from 'react';
import WebApp from './WebApp';
import { useLibrary } from '../context/LibraryProvider';
export default function DesktopPortal() {
  const s = useLibrary();
  return <WebApp {...s} books={s.catalogue} reservations={s.reserved} />;
}
