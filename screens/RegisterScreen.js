import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

export default function RegisterScreen({ onBack, onComplete }) {
  const [name,setName]=useState(''); const [studentId,setStudentId]=useState(''); const [email,setEmail]=useState('');
  const create=()=>{ if(!name.trim()||!studentId.trim()||!email.includes('@')) return Alert.alert('Almost there','Enter your name, student ID, and a valid university email.'); onComplete(); };
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
    <Pressable onPress={onBack}><Text style={s.back}>‹ Back to sign in</Text></Pressable><Text style={s.title}>Create account</Text><Text style={s.sub}>Create your library account in less than a minute.</Text>
    <Text style={s.label}>Full name</Text><TextInput value={name} onChangeText={setName} placeholder="Your full name" placeholderTextColor="#8B93A7" style={s.input}/><Text style={s.label}>Student ID</Text><TextInput value={studentId} onChangeText={setStudentId} placeholder="IT12345678" placeholderTextColor="#8B93A7" style={s.input}/><Text style={s.label}>University email</Text><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@university.edu" placeholderTextColor="#8B93A7" style={s.input}/>
    <Text style={s.policy}>By creating an account, you agree to the library borrowing and reading-room policies.</Text><Pressable onPress={create} style={s.button}><Text style={s.buttonText}>Create account</Text></Pressable>
  </ScrollView></SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:'#F7F8FC'},page:{padding:24,paddingBottom:48},back:{color:'#304B9B',fontWeight:'800'},title:{fontSize:29,fontWeight:'900',color:'#1D2742',marginTop:28},sub:{color:'#69738D',lineHeight:22,marginTop:7},label:{color:'#303A54',fontWeight:'800',marginTop:22,marginBottom:8},input:{backgroundColor:'#FFF',borderWidth:1,borderColor:'#D9DEEB',borderRadius:14,padding:16,fontSize:16,color:'#1D2742'},policy:{color:'#69738D',lineHeight:21,marginTop:24,marginBottom:14},button:{backgroundColor:'#304B9B',borderRadius:14,padding:17,alignItems:'center'},buttonText:{color:'#FFF',fontWeight:'900',fontSize:16} });
