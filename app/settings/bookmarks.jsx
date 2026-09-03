import {View,Text,FlatList,Pressable,Alert} from 'react-native';
import {useEffect,useState} from 'react';
import {api} from '../../src/lib/api';
export default function Bk(){
  const [items,setItems]=useState([]);
  const load=()=>api.getBookmarks().then(r=>setItems(r.items||r.bookmarks||[])).catch(()=>{});
  useEffect(()=>{load();},[]);
  const del=(url)=>Alert.alert('Remove bookmark?','Do you want to remove this bookmark?',[{text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:async()=>{await api.removeBookmark(url); load();}}]);
  return (
    <View style={{flex:1,backgroundColor:'#000',paddingTop:50,paddingHorizontal:16}}>
      <Text style={{color:'#fff',fontSize:20,fontWeight:'800'}}>Bookmarks → bookmarks.py</Text>
      <FlatList data={items} keyExtractor={(_,i)=>String(i)} renderItem={({item})=>(
        <View style={{backgroundColor:'#111',padding:14,borderRadius:12,marginTop:10}}>
          <Text style={{color:'#fff'}} numberOfLines={2}>{item.title||item.url}</Text>
          <Pressable onPress={()=>del(item.url)} style={{marginTop:8}}><Text style={{color:'#ff4444',fontWeight:'700'}}>Remove with warning</Text></Pressable>
        </View>
      )}/>
    </View>
  );
}