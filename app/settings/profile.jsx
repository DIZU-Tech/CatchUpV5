import {View,Text,TextInput,Pressable,Alert,ScrollView} from 'react-native';
import {useState} from 'react';
import {api} from '../../src/lib/api';
import {useAuth} from '../../src/store/auth';
const avatars=['🦁','🦊','🐼','👩‍🚀','👨‍💻','😎','🤖','👑','🐯','🦄','👾','🔥'];
export default function Profile(){
  const {user}=useAuth();
  const [name,setName]=useState(user?.name||'');
  const [av,setAv]=useState('🦁');
  return (
    <View style={{flex:1,backgroundColor:'#000'}}>
      <View style={{paddingTop:50,paddingHorizontal:16,paddingBottom:12}}><Text style={{color:'#fff',fontSize:20,fontWeight:'800'}}>Profile • calls profile.py user.py auth.py</Text></View>
      <ScrollView contentContainerStyle={{padding:16}}>
        <Text style={{color:'#888',fontSize:12}}>Animated Avatar Picker (frontend only)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:12}}>
          {avatars.map(a=><Pressable key={a} onPress={()=>setAv(a)} style={{width:56,height:56,borderRadius:28,backgroundColor:av===a?'#fff':'#111',alignItems:'center',justifyContent:'center',marginRight:10,borderWidth:2,borderColor:av===a?'#FFD60A':'#222'}}><Text style={{fontSize:26}}>{a}</Text></Pressable>)}
        </ScrollView>
        <View style={{marginTop:20,backgroundColor:'#111',borderRadius:16,padding:16,alignItems:'center'}}><Text style={{fontSize:48}}>{av}</Text><Text style={{color:'#fff',marginTop:8,fontWeight:'700'}}>{name||'Username'}</Text></View>
        <TextInput value={name} onChangeText={setName} placeholder="Username" placeholderTextColor="#555" style={{backgroundColor:'#111',color:'#fff',padding:14,borderRadius:12,marginTop:16}}/>
        <Pressable onPress={async()=>{try{await api.updateProfile({name}); Alert.alert('Saved via profile.py')}catch(e){Alert.alert(e.message)}}} style={{backgroundColor:'#fff',padding:14,borderRadius:12,marginTop:14}}><Text style={{textAlign:'center',fontWeight:'800'}}>Save → /api/user/profile</Text></Pressable>
        <Pressable onPress={()=>Alert.alert('Disable account?','This will disable',[{text:'Cancel'},{text:'Disable',onPress:()=>{}}])} style={{backgroundColor:'#222',padding:14,borderRadius:12,marginTop:30}}><Text style={{color:'#fff',textAlign:'center'}}>Disable Account</Text></Pressable>
        <Pressable onPress={()=>Alert.alert('Delete account?','Permanent',[{text:'Cancel'},{text:'Delete',style:'destructive',onPress:async()=>{await api.deleteAccount();}}])} style={{backgroundColor:'#330000',padding:14,borderRadius:12,marginTop:10}}><Text style={{color:'#ff4444',textAlign:'center'}}>Delete Account → /api/user/delete</Text></Pressable>
      </ScrollView>
    </View>
  );
}