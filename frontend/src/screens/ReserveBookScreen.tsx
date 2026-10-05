import type { ScreenProps } from '../types/library';
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Frame, Book, Label, Badge, Button, ui } from '../components/LibraryFlow';
export default function ReserveBookScreen({
  book,
  onBack,
  onConfirm,
  busy,
  onHome,
  onSearch,
  onHolds
}: Pick<ScreenProps, 'book' | 'onBack' | 'onConfirm' | 'busy' | 'onHome' | 'onSearch' | 'onHolds'>) {
  const [day, setDay] = useState(1);
  const [time, setTime] = useState('12-2 PM');
  const dates = [0, 1, 2].map(offset => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return {
      label: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : d.toLocaleDateString(undefined, {
        weekday: 'short'
      }),
      value: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
    };
  });
  const option = (active: boolean): import("react-native").ViewStyle => ({
    flexGrow: 1,
    padding: 12,
    minHeight: 46,
    borderWidth: 1,
    borderColor: active ? '#2563EB' : '#DCE5F1',
    backgroundColor: active ? '#EFF6FF' : '#FFF',
    borderRadius: 5,
    alignItems: 'center'
  });
  return <Frame title="Reserve title" onBack={onBack} onHome={onHome} onSearch={onSearch} onHolds={onHolds}><Book book={book} /><Label>Select pickup location</Label><View style={[ui.card, {
      borderColor: '#2563EB',
      borderWidth: 2,
      backgroundColor: '#EFF6FF'
    }]}><Text style={ui.title}>◉ Main Library desk</Text><Text style={[ui.body, {
        marginVertical: 10
      }]}>Ground floor circulation desk. Collect with your student ID and pickup code.</Text><Badge>STAFF ASSISTED COLLECTION</Badge></View><Label>Pickup date</Label><View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8
    }}>{dates.map((d, i) => <Pressable key={d.value} accessibilityRole="radio" accessibilityState={{
        checked: day === i
      }} disabled={busy} onPress={() => setDay(i)} style={option(day === i)}><Text style={ui.title}>{d.label}</Text><Text style={ui.muted}>{d.value}</Text></Pressable>)}</View><Label>Pickup window</Label><View style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8
    }}>{['9-11 AM', '12-2 PM', '4-6 PM'].map(t => <Pressable key={t} accessibilityRole="radio" accessibilityState={{
        checked: time === t
      }} disabled={busy} onPress={() => setTime(t)} style={option(time === t)}><Text style={ui.body}>{t}</Text></Pressable>)}</View><View style={[ui.card, {
      marginTop: 22
    }]}><Text style={ui.body}>Your confirmation includes a pickup code. View it again or cancel your hold in My reservations.</Text></View><Button title={busy ? 'RESERVING...' : 'CONFIRM RESERVATION →'} disabled={busy || !book.available} onPress={() => onConfirm({
      pickupDate: dates[day].value,
      pickupWindow: time
    })} /></Frame>;
}
