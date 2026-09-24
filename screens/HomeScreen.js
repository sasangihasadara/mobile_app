import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ catalogue, onSearch, onReservations, onRoom, openBook }) {
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.page}>
    <View style={s.top}><View><Text style={s.greeting}>Good morning, Anya</Text><Text style={s.sub}>Your library is ready for you.</Text></View><View style={s.avatar}><Text style={s.avatarText}>AS</Text></View></View>
    <Pressable onPress={onSearch} style={s.search}><Text style={s.searchIcon}>⌕</Text><Text style={s.searchText}>Search title, author or ISBN</Text></Pressable>
    <Text style={s.heading}>Quick actions</Text><View style={s.grid}>
      <Action icon="⌕" title="Search books" copy="Find what you need" color="#E5E4FF" onPress={onSearch} />
      <Action icon="▣" title="My reservations" copy="Track your pickups" color="#FFF0C9" onPress={onReservations} />
      <Action icon="⌂" title="Find a shelf" copy="Locate a book quickly" color="#D9EDFF" onPress={onRoom} />
    </View>
    <Text style={s.heading}>Popular this week</Text>
    {catalogue.slice(0, 3).map((book) => <Pressable key={book.id} onPress={() => openBook(book)} style={s.book}><View style={[s.cover,{backgroundColor:book.color}]}><Text style={s.initial}>{book.title[0]}</Text></View><View style={s.info}><Text style={s.bookTitle}>{book.title}</Text><Text style={s.author}>{book.author}</Text><Text style={[s.availability,{color:book.available?'#168253':'#B53C52'}]}>{book.available ? `${book.copies} available` : 'Currently unavailable'}</Text></View><Text style={s.chevron}>›</Text></Pressable>)}
  </ScrollView></SafeAreaView>;
}
function Action({ icon, title, copy, color, onPress }) { return <Pressable onPress={onPress} style={[s.action,{backgroundColor:color}]}><Text style={s.actionIcon}>{icon}</Text><Text style={s.actionTitle}>{title}</Text><Text style={s.actionCopy}>{copy}</Text></Pressable>; }
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#F7F8FC'},page:{width:'100%',maxWidth:620,alignSelf:'center',padding:20,paddingBottom:44},top:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},greeting:{fontSize:24,fontWeight:'900',color:'#1D2742'},sub:{color:'#69738D',marginTop:4},avatar:{width:42,height:42,borderRadius:21,backgroundColor:'#E5E9F8',alignItems:'center',justifyContent:'center'},avatarText:{color:'#304B9B',fontWeight:'900'},search:{marginTop:25,backgroundColor:'#FFF',borderWidth:1,borderColor:'#D9DEEB',borderRadius:15,padding:17,flexDirection:'row'},searchIcon:{fontSize:23,color:'#304B9B',marginRight:10},searchText:{color:'#8B93A7'},heading:{fontSize:19,fontWeight:'900',color:'#1D2742',marginTop:28,marginBottom:13},grid:{flexDirection:'row',flexWrap:'wrap',gap:12},action:{width:'47.8%',minHeight:136,borderRadius:18,padding:15},actionIcon:{fontSize:25,color:'#304B9B'},actionTitle:{fontWeight:'900',color:'#1D2742',marginTop:15},actionCopy:{fontSize:12,color:'#65708D',marginTop:4},book:{flexDirection:'row',alignItems:'center',backgroundColor:'#FFF',borderRadius:16,padding:12,marginBottom:12,borderWidth:1,borderColor:'#E4E7F0'},cover:{width:58,height:78,borderRadius:10,alignItems:'center',justifyContent:'center'},initial:{fontSize:27,fontWeight:'900',color:'#243561'},info:{flex:1,marginLeft:13},bookTitle:{fontSize:16,fontWeight:'900',color:'#1D2742'},author:{color:'#69738D',marginTop:4},availability:{fontSize:12,fontWeight:'800',marginTop:7},chevron:{fontSize:30,color:'#8B93A7'} });
