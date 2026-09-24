import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function BookDetailsScreen({ book, onBack, onReserve }) {
  const available = book.available;
  return <ScrollView contentContainerStyle={s.page}><View style={s.content}>
    <Pressable onPress={onBack}><Text style={s.back}>‹ Back to results</Text></Pressable>
    <View style={[s.cover, { backgroundColor: book.color }]}><Text style={s.initial}>{book.title[0]}</Text></View>
    <Text style={s.title}>{book.title}</Text><Text style={s.author}>by {book.author}</Text>
    <Text style={[s.status, { color: available ? '#168253' : '#B53C52' }]}>{available ? `${book.copies} copies available now` : 'Currently unavailable'}</Text>
    {[['ISBN', book.isbn], ['Shelf location', 'Level 2 · A-14'], ['Loan period', '14 days'], ['Pickup point', 'Main Library desk']].map(([label, value]) => <View key={label} style={s.row}><Text style={s.label}>{label}</Text><Text style={s.value}>{value}</Text></View>)}
    <Text style={s.copy}>Reserve now and receive a pickup code for the Main Library desk.</Text>
    <Pressable onPress={onReserve} style={[s.button, !available && s.disabled]}><Text style={s.buttonText}>{available ? 'Reserve this book' : 'Join waitlist'}</Text></Pressable>
  </View></ScrollView>;
}
const s = StyleSheet.create({ page:{flexGrow:1,padding:24,paddingBottom:48,backgroundColor:'#F7F8FC'},content:{width:'100%',maxWidth:620,alignSelf:'center'},back:{color:'#304B9B',fontWeight:'800'},cover:{width:120,height:166,borderRadius:18,alignItems:'center',justifyContent:'center',marginTop:28},initial:{fontSize:56,fontWeight:'900',color:'#243561'},title:{fontSize:30,fontWeight:'900',color:'#1D2742',marginTop:22},author:{fontSize:17,color:'#69738D',marginTop:6},status:{fontWeight:'800',marginTop:12},row:{flexDirection:'row',justifyContent:'space-between',paddingVertical:16,borderBottomWidth:1,borderColor:'#E4E7F0'},label:{color:'#69738D'},value:{fontWeight:'700',color:'#1D2742'},copy:{color:'#4E5871',lineHeight:22,marginVertical:24},button:{backgroundColor:'#304B9B',borderRadius:14,padding:17,alignItems:'center'},disabled:{backgroundColor:'#8B93A7'},buttonText:{color:'#FFF',fontWeight:'900',fontSize:16} });
