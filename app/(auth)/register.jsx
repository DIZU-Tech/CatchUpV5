import {View,Text,TextInput,Pressable,Alert,ActivityIndicator} from 'react-native';
import {useState} from 'react';
import {router} from 'expo-router';
import {api} from '../../src/lib/api';
import {useAuth} from '../../src/store/auth';

export default function Register(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [confirm,setConfirm]=useState('');
  const [loading,setLoading]=useState(false);
  const {setUser}=useAuth();

  const doRegister=async()=>{
    if(!name || !email || !pass) return Alert.alert('Fill all fields');
    if(pass !== confirm) return Alert.alert('Passwords do not match');
    setLoading(true);
    try{
      // 1. Register -> calls auth.py POST /api/auth/register (firebase.py uses Firebase keys in Render)
      await api.register(email.trim(), pass, name.trim());
      // 2. Auto login after registration -> takes you into app
      const loginRes = await api.login(email.trim(), pass);
      setUser(loginRes.user || {email, name});
      router.replace('/(tabs)/home');
    }catch(e){
      Alert.alert('Registration failed', e.message);
    }finally{setLoading(false)}
  };

  return (
    <View style={{flex:1,backgroundColor:'#000',padding:24,justifyContent:'center'}}>
      <Text style={{color:'#fff',fontSize:28,fontWeight:'800'}}>Create account</Text>
      <Text style={{color:'#666',marginTop:4}}>Sign up calls auth.py, then auto-login to app</Text>

      <TextInput placeholder="Full name" placeholderTextColor="#555" value={name} onChangeText={setName} style={{backgroundColor:'#111',color:'#fff',padding:16,borderRadius:14,marginTop:24}}/>
      <TextInput placeholder="Email" placeholderTextColor="#555" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={{backgroundColor:'#111',color:'#fff',padding:16,borderRadius:14,marginTop:12}}/>
      <TextInput placeholder="Password" placeholderTextColor="#555" value={pass} onChangeText={setPass} secureTextEntry style={{backgroundColor:'#111',color:'#fff',padding:16,borderRadius:14,marginTop:12}}/>
      <TextInput placeholder="Confirm password" placeholderTextColor="#555" value={confirm} onChangeText={setConfirm} secureTextEntry style={{backgroundColor:'#111',color:'#fff',padding:16,borderRadius:14,marginTop:12}}/>

      <Pressable onPress={doRegister} disabled={loading} style={{backgroundColor:'#fff',padding:16,borderRadius:14,marginTop:24,opacity:loading?0.6:1}}>
        {loading ? <ActivityIndicator color="#000"/> : <Text style={{textAlign:'center',fontWeight:'800',fontSize:16}}>Sign up & Enter App</Text>}
      </Pressable>

      <Pressable onPress={()=>router.back()} style={{marginTop:20}}><Text style={{color:'#888',textAlign:'center'}}>Already have account? <Text style={{color:'#fff'}}>Login</Text></Text></Pressable>
    </View>
  );
}