import {View,Text,TextInput,Pressable,Alert,ActivityIndicator} from 'react-native';
import {useState} from 'react';
import {Link, router} from 'expo-router';
import {api} from '../../src/lib/api';
import {useAuth} from '../../src/store/auth';

export default function Login(){
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [loading,setLoading]=useState(false);
  const {setUser}=useAuth();

  const doLogin=async()=>{
    if(!email || !pass) return Alert.alert('Fill all fields');
    setLoading(true);
    try{
      const res = await api.login(email.trim(), pass); // calls auth.py -> POST /api/auth/login
      setUser(res.user || {email});
      router.replace('/(tabs)/home'); // takes you into app
    }catch(e){
      Alert.alert('Login failed', e.message);
    }finally{setLoading(false)}
  };

  return (
    <View style={{flex:1,backgroundColor:'#000',padding:24,justifyContent:'center'}}>
      <Text style={{color:'#fff',fontSize:32,fontWeight:'900'}}>Catch-Up</Text>
      <Text style={{color:'#666',marginTop:4}}>V5 — Login calls auth.py</Text>
      
      <TextInput placeholder="Email" placeholderTextColor="#555" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={{backgroundColor:'#111',color:'#fff',padding:16,borderRadius:14,marginTop:30}}/>
      <TextInput placeholder="Password" placeholderTextColor="#555" value={pass} onChangeText={setPass} secureTextEntry style={{backgroundColor:'#111',color:'#fff',padding:16,borderRadius:14,marginTop:12}}/>
      
      <Pressable onPress={doLogin} disabled={loading} style={{backgroundColor:'#fff',padding:16,borderRadius:14,marginTop:24,opacity:loading?0.6:1}}>
        {loading ? <ActivityIndicator color="#000"/> : <Text style={{textAlign:'center',fontWeight:'800',fontSize:16}}>Login</Text>}
      </Pressable>

      <Link href="/(auth)/register" asChild>
        <Pressable style={{marginTop:20}}><Text style={{color:'#888',textAlign:'center'}}>No account? <Text style={{color:'#fff'}}>Sign up</Text></Text></Pressable>
      </Link>
    </View>
  );
}