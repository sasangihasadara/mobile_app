import React from 'react';
import { router, type Href } from 'expo-router';
import { Frame, Button } from '../components/LibraryFlow';
const screens: [string, Href][] = [['Welcome', '/'], ['Sign in', '/(auth)/login'], ['Register', '/(auth)/register'], ['Home', '/(tabs)'], ['Search books', '/books'], ['Search results', '/books/results'], ['Book details', '/books/1'], ['My reservations', '/(tabs)/reservations']];
export default function Explore() {
  return <Frame title="Screen preview" onBack={() => router.replace('/')} onHome={() => router.replace('/')} onSearch={() => router.push('/books')} onHolds={() => router.push('/(tabs)/reservations')}>{screens.map(([title, route]) => <Button key={title} title={title} onPress={() => router.push(route)} secondary />)}</Frame>;
}
