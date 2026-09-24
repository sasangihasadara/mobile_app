import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen({ onStart, onPreview }) {
  return <SafeAreaView style={s.safe}><View style={s.page}>
    <View><View style={s.logo}><Text style={s.logoText}>L</Text></View><Text style={s.title}>LibraReserve</Text><Text style={s.subtitle}>Find books, reserve them instantly, and book your perfect study space.</Text>
      <View style={s.feature}><Text style={s.icon}>⌕</Text><View style={s.featureText}><Text style={s.featureTitle}>Search smarter</Text><Text style={s.featureCopy}>See live availability before you visit the library.</Text></View></View>
      <View style={s.feature}><Text style={s.icon}>✓</Text><View style={s.featureText}><Text style={s.featureTitle}>Reserve with confidence</Text><Text style={s.featureCopy}>Receive a pickup code and collect on time.</Text></View></View>
    </View>
    <View><Pressable onPress={onStart} style={s.primary}><Text style={s.primaryText}>Get started</Text></Pressable><Pressable onPress={onPreview} style={s.secondary}><Text style={s.secondaryText}>Browse all screens</Text></Pressable><Text style={s.footer}>Your campus library, in your pocket.</Text></View>
  </View></SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#273B7A'},page:{flex:1,padding:28,justifyContent:'space-between'},logo:{width:72,height:72,borderRadius:22,backgroundColor:'#F6C85F',alignItems:'center',justifyContent:'center',marginTop:48},logoText:{fontSize:38,fontWeight:'900',color:'#273B7A'},title:{fontSize:38,fontWeight:'900',color:'#FFF',marginTop:26},subtitle:{color:'#DCE5FF',fontSize:17,lineHeight:25,marginTop:10,marginBottom:32},feature:{flexDirection:'row',backgroundColor:'#344987',borderWidth:1,borderColor:'#6C80BE',borderRadius:18,padding:17,marginBottom:12},icon:{fontSize:26,color:'#F6C85F',marginRight:14},featureText:{flex:1},featureTitle:{color:'#FFF',fontWeight:'900',fontSize:16},featureCopy:{color:'#DCE5FF',lineHeight:20,marginTop:4},primary:{backgroundColor:'#F6C85F',borderRadius:14,padding:17,alignItems:'center'},primaryText:{color:'#273B7A',fontSize:16,fontWeight:'900'},secondary:{borderWidth:1,borderColor:'#91A4DD',borderRadius:14,padding:16,alignItems:'center',marginTop:12},secondaryText:{color:'#FFF',fontWeight:'900'},footer:{color:'#BFCBF4',textAlign:'center',marginTop:16} });
