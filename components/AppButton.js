import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function AppButton({ title, onPress, secondary = false, disabled = false }) {
  return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondary, disabled && s.disabled, pressed && s.pressed]}><Text style={[s.text, secondary && s.secondaryText]}>{title}</Text></Pressable>;
}
const s=StyleSheet.create({button:{minHeight:54,backgroundColor:'#304B9B',justifyContent:'center',alignItems:'center',borderRadius:14,marginTop:12,paddingHorizontal:16},text:{color:'#FFF',fontSize:16,fontWeight:'800'},secondary:{backgroundColor:'#FFF',borderWidth:1,borderColor:'#C9D0E2'},secondaryText:{color:'#304B9B'},disabled:{opacity:.5},pressed:{opacity:.78}});
