import React from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen({ email, password, setEmail, setPassword, onLogin, onRegister, onForgot }) {
  const signIn = () => {
    if (!email.trim().includes('@') || password.length < 6) {
      Alert.alert('Check your details', 'Enter a valid university email and a password with at least 6 characters.');
      return;
    }
    onLogin();
  };

  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
    <View style={s.logo}><Text style={s.logoText}>L</Text></View>
    <Text style={s.title}>Welcome back</Text>
    <Text style={s.subtitle}>Sign in to search, reserve books and book study rooms.</Text>
    <Text style={s.label}>University email</Text>
    <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@university.edu" placeholderTextColor="#8B93A7" style={s.input} />
    <Text style={s.label}>Password</Text>
    <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter your password" placeholderTextColor="#8B93A7" style={s.input} />
    <Pressable onPress={onForgot}><Text style={s.forgot}>Forgot password?</Text></Pressable>
    <Pressable onPress={signIn} style={s.primary}><Text style={s.primaryText}>Sign in</Text></Pressable>
    <Text style={s.or}>OR</Text>
    <Pressable onPress={() => Alert.alert('Campus account', 'University SSO can be connected here.')} style={s.secondary}><Text style={s.secondaryText}>Continue with campus account</Text></Pressable>
    <Text style={s.footer}>New here? <Text onPress={onRegister} style={s.link}>Create an account</Text></Text>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({ safe:{flex:1,backgroundColor:'#F7F8FC'},page:{width:'100%',maxWidth:620,alignSelf:'center',padding:24,paddingTop:56,paddingBottom:48},logo:{width:68,height:68,borderRadius:22,backgroundColor:'#304B9B',alignItems:'center',justifyContent:'center',alignSelf:'center'},logoText:{color:'#FFF',fontSize:35,fontWeight:'900'},title:{fontSize:30,fontWeight:'900',color:'#1D2742',textAlign:'center',marginTop:22},subtitle:{color:'#69738D',textAlign:'center',fontSize:16,lineHeight:23,marginTop:8,marginBottom:28},label:{fontWeight:'800',color:'#303A54',marginTop:16,marginBottom:8},input:{backgroundColor:'#FFF',borderWidth:1,borderColor:'#D9DEEB',borderRadius:14,padding:16,fontSize:16,color:'#1D2742'},forgot:{color:'#304B9B',fontWeight:'800',textAlign:'right',marginTop:12,marginBottom:16},primary:{backgroundColor:'#304B9B',borderRadius:14,padding:17,alignItems:'center'},primaryText:{color:'#FFF',fontSize:16,fontWeight:'900'},or:{textAlign:'center',color:'#8B93A7',fontWeight:'800',marginVertical:20},secondary:{borderWidth:1,borderColor:'#C9D0E2',backgroundColor:'#FFF',borderRadius:14,padding:16,alignItems:'center'},secondaryText:{color:'#304B9B',fontWeight:'800'},footer:{textAlign:'center',color:'#69738D',marginTop:25},link:{color:'#304B9B',fontWeight:'900'} });
