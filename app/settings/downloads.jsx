import {View,Text,FlatList} from 'react-native';
import {useSettings} from '../../src/store/settings';
export default function Dl(){
  const {downloads}=useSettings();
  return (
    <View style={{flex:1,backgroundColor:'#000',paddingTop:50,paddingHorizontal:16}}>
      <Text style={{color:'#fff',fontSize:20,fontWeight:'800'}}>Downloads saved to phone</Text>
      <FlatList data={downloads} keyExtractor={(_,i)=>String(i)} renderItem={({item})=><View style={{backgroundColor:'#111',padding:12,borderRadius:12,marginTop:8}}><Text style={{color:'#fff',fontSize:12}}>{item.name||item.url}</Text><Text style={{color:'#666',fontSize:10,marginTop:4}}>{item.fileUri}</Text></View>}/>
    </View>
  );
}