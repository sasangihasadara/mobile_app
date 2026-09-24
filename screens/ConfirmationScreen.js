import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ConfirmationScreen({ book, onHome, onReservations }) {
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.page}>
    <View style={s.success}><View style={s.tick}><Text style={s.tickText}>✓</Text></View><Text style={s.title}>Book reserved!</Text><Text style={s.copy}>Your copy of <Text style={s.bold}>{book.title}</Text> is ready to collect.</Text></View>
    <View style={s.ticket}><Text style={s.ticketLabel}>PICKUP CODE</Text><Text style={s.code}>LB-{book.id}724</Text><View style={s.line}/><Text style={s.ticketText}>Main Library · Ground floor desk</Text><Text style={s.ticketText}>Collect before 6:00 PM tomorrow.</Text><Text style={s.ticketText}>Bring your student ID.</Text></View>
    <Pressable onPress={onReservations} style={s.primary}><Text style={s.primaryText}>View my reservations</Text></Pressable>
    <Pressable onPress={onHome} style={s.secondary}><Text style={s.secondaryText}>Back to home</Text></Pressable>
  </ScrollView></SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#F7F8FC'},page:{padding:24,paddingTop:56,paddingBottom:48},success:{alignItems:'center'},tick:{width:88,height:88,borderRadius:44,alignItems:'center',justifyContent:'center',backgroundColor:'#DDF5E7'},tickText:{fontSize:47,fontWeight:'900',color:'#168253'},title:{fontSize:29,fontWeight:'900',color:'#1D2742',marginTop:19},copy:{color:'#69738D',fontSize:16,textAlign:'center',lineHeight:23,marginTop:9},bold:{fontWeight:'900',color:'#30406E'},ticket:{backgroundColor:'#304B9B',borderRadius:20,padding:23,marginVertical:32},ticketLabel:{color:'#BFCCF8',fontWeight:'900',fontSize:12,letterSpacing:1},code:{color:'#FFF',fontSize:30,fontWeight:'900',letterSpacing:2,marginTop:8},line:{borderTopWidth:1,borderColor:'#8294CD',marginVertical:18},ticketText:{color:'#E0E8FF',marginBottom:7},primary:{backgroundColor:'#304B9B',borderRadius:14,padding:17,alignItems:'center'},primaryText:{color:'#FFF',fontSize:16,fontWeight:'900'},secondary:{borderWidth:1,borderColor:'#C9D0E2',backgroundColor:'#FFF',borderRadius:14,padding:16,alignItems:'center',marginTop:12},secondaryText:{color:'#304B9B',fontWeight:'900'} });
