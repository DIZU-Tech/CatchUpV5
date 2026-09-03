import {View,Text,ScrollView,Image,Pressable,ActivityIndicator,Alert,Share} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import {useState,useEffect} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {api} from '../../src/lib/api';
import {useSettings} from '../../src/store/settings';

export default function Article(){
  const {id} = useLocalSearchParams();
  const url = decodeURIComponent(id); // <-- decoded from Home card
  const {lang} = useSettings();
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(true);
  const [bookmarked,setBookmarked]=useState(false);
  const [react,setReact]=useState(null);

  useEffect(()=>{ load(); },[id]);
  const load=async()=>{
    setLoading(true);
    try{
      const r = await api.getArticle(url); // calls /api/article?url= -> article.py + extractor.py
      setData(r.article || r);
      setBookmarked(r.bookmarked||false);
    }catch(e){ Alert.alert('Failed', e.message); }
    finally{ setLoading(false); }
  };

  const toggleBookmark=async()=>{
    if(bookmarked){
      Alert.alert('Remove bookmark?','Do you want to remove this bookmark?',[
        {text:'Cancel'},
        {text:'Remove',style:'destructive',onPress:async()=>{ await api.removeBookmark(url); setBookmarked(false); }}
      ]);
    }else{ await api.addBookmark(url); setBookmarked(true); } // bookmarks.py
  };

  if(loading) return <View style={{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}><ActivityIndicator/></View>;

  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
      {/* Header */}
      <View style={{paddingTop:44,paddingHorizontal:14,paddingBottom:10,flexDirection:'row',alignItems:'center',backgroundColor:'#000'}}>
        <Pressable onPress={()=>router.back()} style={{width:34,height:34,borderRadius:17,backgroundColor:'#111',alignItems:'center',justifyContent:'center'}}>
          <Ionicons name="close" size={18} color="#fff"/>
        </Pressable>
        <Text style={{color:'#fff',fontWeight:'800',marginLeft:12,flex:1}} numberOfLines={1}>READ IN-APP</Text>
        <Pressable onPress={toggleBookmark} style={{width:34,height:34,borderRadius:17,backgroundColor:bookmarked?'#FFD60A':'#111',alignItems:'center',justifyContent:'center'}}>
          <Ionicons name={bookmarked?'bookmark':'bookmark-outline'} size={16} color={bookmarked?'#000':'#fff'}/>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{paddingBottom:30}}>
        {data?.image && <Image source={{uri:data.image}} style={{width:'100%',height:240,backgroundColor:'#f2f2f2'}}/>}
        <View style={{padding:16}}>
          <Text style={{fontSize:21,fontWeight:'900',lineHeight:26}}>{data?.title}</Text>
          <Text style={{color:'#0A84FF',fontSize:11,marginTop:8,fontWeight:'700'}}>{data?.source} • {data?.publishedAt?.slice(0,10)} • {lang.toUpperCase()}</Text>
          <Text style={{marginTop:16,fontSize:15,lineHeight:23,color:'#222'}}>{data?.content || data?.text || 'Full article from extractor.py'}</Text>

          {/* 5 reactions */}
          <View style={{flexDirection:'row',marginTop:20,backgroundColor:'#f9f9f9',borderRadius:16,padding:8}}>
            {[{id:'heart',e:'❤️'},{id:'like',e:'👍'},{id:'smile',e:'😊'},{id:'funny',e:'😂'},{id:'happy',e:'😃'}].map(b=>(
              <Pressable key={b.id} onPress={()=>{setReact(b.id); api.like(url);}} style={{flex:1,alignItems:'center',backgroundColor:react===b.id?'#000':'#fff',paddingVertical:8,borderRadius:12,marginHorizontal:3}}>
                <Text style={{fontSize:18}}>{b.e}</Text>
              </Pressable>
            ))}
          </View>

          <View style={{flexDirection:'row',marginTop:16}}>
            <Pressable onPress={()=>api.like(url)} style={{backgroundColor:'#efefef',paddingHorizontal:14,height:36,borderRadius:18,justifyContent:'center',marginRight:8}}>
              <Text style={{fontSize:12,fontWeight:'700'}}>Like → interactions.py</Text>
            </Pressable>
            <Pressable onPress={()=>Share.share({message:url})} style={{backgroundColor:'#efefef',paddingHorizontal:14,height:36,borderRadius:18,justifyContent:'center'}}>
              <Text style={{fontSize:12,fontWeight:'700'}}>Share</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}