import type { ScreenProps } from '../types/library';
import React from 'react';
import { View, Text } from 'react-native';
import { Frame, Book, Label, Badge, Row, Button, ui } from '../components/LibraryFlow';
export default function ShelfMapScreen({
  book,
  onBack,
  onReserve,
  onHome,
  onSearch,
  onHolds
}: Pick<ScreenProps, 'book' | 'onBack' | 'onReserve' | 'onHome' | 'onSearch' | 'onHolds'>) {
  return <Frame title="Book details" onBack={onBack} onHome={onHome} onSearch={onSearch} onHolds={onHolds}><Book book={book} /><Badge>{book.available ? book.copies + ' COPIES AVAILABLE' : 'UNAVAILABLE'}</Badge><Label>Synopsis & abstract</Label><View style={ui.card}><Text style={ui.body}>{book.description || 'Ask the library desk for more information about this title.'}</Text></View><Row label="ISBN" value={book.isbn} /><Row label="Subject" value={book.category} /><Label>Shelf guide</Label><View style={{
      backgroundColor: '#101C32',
      padding: 16,
      borderRadius: 5
    }}><Text style={{
        color: '#72A7FF',
        fontSize: 11
      }}>MAIN LIBRARY / STACKS</Text><View style={{
        flexDirection: 'row',
        gap: 8,
        marginVertical: 20
      }}>{['A', 'B', 'C', 'D'].map(x => <View key={x} style={{
          flex: 1,
          height: 100,
          borderWidth: 1,
          borderColor: '#405272',
          backgroundColor: '#1B2A42',
          padding: 8
        }}><Text style={{
            color: '#BBCBE2',
            fontSize: 8
          }}>AISLE {x}</Text>{[1, 2, 3].map(i => <View key={i} style={{
            height: 3,
            backgroundColor: '#405272',
            marginTop: 16
          }} />)}</View>)}</View><Text style={{
        color: '#94A3B8',
        fontSize: 9
      }}>ENTRANCE → INFORMATION DESK</Text></View><Text style={[ui.muted, {
      marginTop: 10
    }]}>Illustrative layout. Ask the library desk for this book's exact shelf location.</Text><Label>Availability & collection</Label><View style={ui.card}><Row label="Available copies" value={String(book.copies)} /><Row label="Pickup point" value="Main Library desk" /><Text style={ui.body}>Choose a date and pickup window when reserving. Bring your student ID and pickup code.</Text></View><Button title={book.available ? 'RESERVE BOOK →' : 'CURRENTLY UNAVAILABLE'} disabled={!book.available} onPress={onReserve} /></Frame>;
}
