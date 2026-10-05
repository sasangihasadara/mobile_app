import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Frame, ui } from '../../components/LibraryFlow';
export default function Seats() {
  return <Frame title="Back to home" onBack={() => router.replace('/(tabs)')} onHome={() => router.replace('/(tabs)')} onSearch={() => router.push('/books')} onHolds={() => router.push('/(tabs)/reservations')}><View style={ui.card}><Text style={ui.heading}>Reading rooms</Text><Text style={ui.body}>Contact the library desk to check study-space availability. Online room booking is not available yet.</Text></View></Frame>;
}
