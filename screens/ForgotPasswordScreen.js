import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ForgotPasswordScreen({ initialEmail = '', onBack }) {
  const [email,setEmail]=useState(initialEmail);
  const send=()=>{if(!email.includes('@')) return Alert.alert('Enter your email','Please enter a valid university email address.'); Alert.alert('Reset link sent','Check your university email for instructions to reset your password.');};
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled"><View style={s.content}>
    <Pressable onPress={onBack}><Text style={s.back}>‹ Back to sign in</Text></Pressable><View style={s.icon}><Text style={s.iconText}>✉</Text></View><Text style={s.title}>Reset your password</Text><Text style={s.sub}>Enter your university email and we will send you a secure reset link.</Text>
    <Text style={s.label}>University email</Text><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@university.edu" placeholderTextColor="#8B93A7" style={s.input}/><Pressable onPress={send} style={s.button}><Text style={s.buttonText}>Send reset link</Text></Pressable>
  </View></ScrollView></SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#F7F8FC'},page:{flexGrow:1,padding:24,paddingTop:56},content:{width:'100%',maxWidth:620,alignSelf:'center'},back:{color:'#304B9B',fontWeight:'800'},icon:{width:76,height:76,borderRadius:24,backgroundColor:'#E5E9F8',alignSelf:'center',alignItems:'center',justifyContent:'center',marginTop:48},iconText:{fontSize:34,color:'#304B9B'},title:{fontSize:29,fontWeight:'900',color:'#1D2742',textAlign:'center',marginTop:22},sub:{color:'#69738D',fontSize:16,lineHeight:23,textAlign:'center',marginTop:8,marginBottom:28},label:{fontWeight:'800',color:'#303A54',marginBottom:8},input:{backgroundColor:'#FFF',borderWidth:1,borderColor:'#D9DEEB',borderRadius:14,padding:16,fontSize:16,color:'#1D2742'},button:{backgroundColor:'#304B9B',borderRadius:14,padding:17,alignItems:'center',marginTop:20},buttonText:{color:'#FFF',fontSize:16,fontWeight:'900'}});
