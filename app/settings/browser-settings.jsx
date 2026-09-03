import {View,Text,Pressable} from 'react-native';
import {useSettings} from '../../src/store/settings';
export default function BSet(){
  const {engine,setEngine,incognito,toggleIncognito}=useSettings();
  return (
    <View style={{flex:1,backgroundColor:'#000',paddingTop:50,paddingHorizontal:16}}>
      <Text style={{color:'#fff',fontSize:20,fontWeight:'800'}}>Browser Engine → browser.py</Text>
      {['google','bing','duckduckgo'].map(e=>(
        <Pressable key={e} onPress={()=>setEngine(e)} style={{backgroundColor:engine===e?'#fff':'#111',padding:16,borderRadius:12,marginTop:10}}>
          <Text style={{color:engine===e?'#000':'#fff',fontWeight:'700',textTransform:'capitalize'}}>{e}</Text>
        </Pressable>
      ))}
      <Pressable onPress={toggleIncognito} style={{backgroundColor:incognito?'#fff':'#111',padding:16,borderRadius:12,marginTop:20}}>
        <Text style={{color:incognito?'#000':'#fff'}}>Incognito: {incognito?'ON':'OFF'}</Text>
      </Pressable>
    </View>
  );
}