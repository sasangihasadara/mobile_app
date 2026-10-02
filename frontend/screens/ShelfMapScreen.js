import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ShelfMapScreen({ book, onBack }) {
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={[s.page,s.responsive]}>
    <Pressable onPress={onBack}><Text style={s.back}>‹ Back to book details</Text></Pressable><Text style={s.title}>Shelf map</Text><Text style={s.sub}>Find {book.title} in the Main Library.</Text>
    <View style={s.select}><Text>Main Library · Floor 2</Text><Text>⌄</Text></View><View style={s.map}>{Array.from({length:12},(_,i)=><View key={i} style={[s.shelf,i===7&&s.target]}><Text style={s.shelfText}>{i===7?'●':'▥'}</Text></View>)}</View>
    <View style={s.legend}><Text style={s.legendText}>● Your location</Text><Text style={s.legendText}>● Book location · A-14</Text></View><Pressable onPress={onBack} style={s.button}><Text style={s.buttonText}>Get directions</Text></Pressable>
  </ScrollView></SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#F7F8FC'},page:{padding:20,paddingBottom:44},responsive:{width:'100%',maxWidth:620,alignSelf:'center'},back:{color:'#304B9B',fontWeight:'800'},title:{fontSize:29,fontWeight:'900',color:'#1D2742',marginTop:24},sub:{color:'#69738D',marginTop:6},select:{backgroundColor:'#FFF',borderWidth:1,borderColor:'#D9DEEB',borderRadius:12,padding:16,marginTop:25,flexDirection:'row',justifyContent:'space-between'},map:{marginTop:20,backgroundColor:'#FFF',borderRadius:18,padding:20,flexDirection:'row',flexWrap:'wrap',gap:12},shelf:{width:'29%',height:82,borderWidth:1,borderColor:'#BFC7D9',alignItems:'center',justifyContent:'center',borderRadius:6},target:{borderColor:'#304B9B',borderWidth:3,backgroundColor:'#E5E9F8'},shelfText:{fontSize:24,color:'#304B9B'},legend:{marginVertical:22},legendText:{color:'#405071',marginBottom:8},button:{backgroundColor:'#304B9B',borderRadius:14,padding:17,alignItems:'center'},buttonText:{color:'#FFF',fontWeight:'900',fontSize:16}});
