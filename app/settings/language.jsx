import {View,Text,Pressable,FlatList} from 'react-native';
import {useSettings} from '../../src/store/settings';
import {useEffect,useState} from 'react';
import {api} from '../../src/lib/api';
export default function Lang(){
  const {lang,setLang}=useSettings();
  const [list,setList]=useState([{code:'en',name:'English'},{code:'yo',name:'Yoruba'},{code:'ha',name:'Hausa'},{code:'ig',name:'Igbo'}]);
  useEffect(()=>{api.getLanguages().then(r=>{if(r.languages) setList(r.languages)}).catch(()=>{});},[]);
  return (
    <View style={{flex:1,backgroundColor:'#000',paddingTop:50,paddingHorizontal:16}}>
      <Text style={{color:'#fff',fontSize:20,fontWeight:'800'}}>Language → languages.py + translate.py</Text>
      <FlatList data={list} keyExtractor={i=>String(i.code||i)} renderItem={({item})=>{const code=item.code||item; return <Pressable onPress={()=>setLang(code)} style={{backgroundColor:lang===code?'#fff':'#111',padding:16,borderRadius:12,marginTop:8}}><Text style={{color:lang===code?'#000':'#fff',fontWeight:'700'}}>{item.name||code} ({code})</Text></Pressable>;}}/>
    </View>
  );
}