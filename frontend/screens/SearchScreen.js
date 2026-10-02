import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SearchScreen({ query, setQuery, results, onBack, onSearch }) {
  const categories=['Fiction','Computing','Finance','Self Development'];
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled"><View style={s.content}>
    <Pressable onPress={onBack}><Text style={s.back}>‹ Back to home</Text></Pressable>
    <Text style={s.title}>Search books</Text><Text style={s.sub}>Search by title, author, or ISBN.</Text>
    <View style={s.inputWrap}><Text style={s.icon}>⌕</Text><TextInput autoFocus value={query} onChangeText={setQuery} onSubmitEditing={onSearch} placeholder="Try “Atomic Habits”" placeholderTextColor="#8B93A7" style={s.input} returnKeyType="search" /></View>
    <Text style={s.help}>Results update as you type. Availability is live.</Text>
    <Text style={s.heading}>Browse by category</Text><View style={s.chips}>{categories.map((item)=><Pressable key={item} onPress={()=>{setQuery(item);onSearch();}} style={s.chip}><Text style={s.chipText}>{item}</Text></Pressable>)}</View>
    <View style={s.info}><Text style={s.infoIcon}>i</Text><Text style={s.infoText}>{results.length} books match your current search.</Text></View>
    <Pressable onPress={onSearch} style={s.button}><Text style={s.buttonText}>See search results</Text></Pressable>
  </View></ScrollView></SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#F7F8FC'},page:{flexGrow:1,padding:20,paddingBottom:44},content:{width:'100%',maxWidth:620,alignSelf:'center'},back:{color:'#304B9B',fontWeight:'800'},title:{fontSize:28,fontWeight:'900',color:'#1D2742',marginTop:24},sub:{color:'#69738D',marginTop:5},inputWrap:{flexDirection:'row',alignItems:'center',backgroundColor:'#FFF',borderColor:'#304B9B',borderWidth:2,borderRadius:15,paddingHorizontal:15,marginTop:25},icon:{fontSize:25,color:'#304B9B',marginRight:10},input:{flex:1,fontSize:16,paddingVertical:15,color:'#1D2742'},help:{color:'#69738D',lineHeight:20,marginTop:10},heading:{fontSize:19,fontWeight:'900',color:'#1D2742',marginTop:27,marginBottom:13},chips:{flexDirection:'row',flexWrap:'wrap',gap:9},chip:{paddingHorizontal:13,paddingVertical:10,backgroundColor:'#E9EDF7',borderRadius:22},chipText:{color:'#405071',fontWeight:'800',fontSize:13},info:{flexDirection:'row',alignItems:'center',backgroundColor:'#E5ECFF',borderRadius:13,padding:14,marginVertical:27},infoIcon:{color:'#304B9B',fontWeight:'900',fontSize:17,marginRight:10},infoText:{color:'#30406E',flex:1},button:{backgroundColor:'#304B9B',borderRadius:14,padding:17,alignItems:'center'},buttonText:{color:'#FFF',fontWeight:'900',fontSize:16} });
