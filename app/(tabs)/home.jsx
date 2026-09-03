import {View,Text,Pressable,FlatList,Image,ScrollView,ActivityIndicator} from 'react-native';
import {useState} from 'react';
import {Link, router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {useNews} from '../../src/hooks/useNews';
import {api} from '../../src/lib/api';
import {useSettings} from '../../src/store/settings';

export default function Home(){
  const {lang} = useSettings();
  const {data,isLoading,category,setCategory,time,setTime,sort,setSort} = useNews();
  const arts = data?.articles || [];
  const [saved,setSaved]=useState({});

  const toggleSave = async (url)=>{
    try{
      if(saved[url]){ await api.removeBookmark(url); setSaved(s=>({...s,[url]:false})); }
      else{ await api.addBookmark(url); setSaved(s=>({...s,[url]:true})); }
    }catch{}
  };

  return (
    <View style={{flex:1,backgroundColor:'#000'}}>
      {/* HEADER - no white gap, full black to top */}
      <View style={{backgroundColor:'#000',paddingTop:44,paddingBottom:12,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <Text style={{color:'#fff',fontSize:26,fontWeight:'900',letterSpacing:-0.5}}>Catch-up</Text>
          <View style={{flexDirection:'row',marginLeft:10}}>
            <View style={{backgroundColor:'#fff',paddingHorizontal:13,paddingVertical:5,borderRadius:20,marginRight:6}}><Text style={{fontWeight:'800',fontSize:12}}>News</Text></View>
            <Pressable onPress={()=>router.push('/(tabs)/browser')} style={{backgroundColor:'#222',paddingHorizontal:13,paddingVertical:5,borderRadius:20}}><Text style={{color:'#fff',fontWeight:'600',fontSize:12}}>Browser</Text></Pressable>
          </View>
        </View>
        <Pressable onPress={()=>router.push('/(tabs)/settings')} style={{width:36,height:36,borderRadius:18,backgroundColor:'#111',alignItems:'center',justifyContent:'center'}}>
          <Ionicons name="settings" size={18} color="#7cc8ff" />
        </Pressable>
      </View>

      {/* FILTERS - left DAILY + Latest/Trending | right categories */}
      <View style={{backgroundColor:'#fff',paddingTop:10,paddingBottom:6}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:12}}>
          <Pressable onPress={()=>setTime(time==='daily'?'all':'daily')} style={{backgroundColor:time==='daily'?'#000':'#efefef',paddingHorizontal:16,height:34,borderRadius:18,justifyContent:'center',marginRight:8}}>
            <Text style={{color:time==='daily'?'#fff':'#000',fontWeight:'800',fontSize:12}}>DAILY</Text>
          </Pressable>
          {[
            {id:'technology',l:'TECHNOLOGY'},
            {id:'business',l:'BUSINESS'},
            {id:'sports',l:'SPORTS'},
            {id:'politics',l:'POLITICS'},
            {id:'health',l:'HEALTH'},
            {id:'top',l:'GENERAL'},
          ].map(c=>(
            <Pressable key={c.id} onPress={()=>setCategory(c.id)} style={{backgroundColor:category===c.id?'#000':'#efefef',paddingHorizontal:14,height:34,borderRadius:18,justifyContent:'center',marginRight:8}}>
              <Text style={{color:category===c.id?'#fff':'#000',fontWeight:'700',fontSize:12}}>{c.l}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,marginTop:8}}>
          <View style={{flexDirection:'row'}}>
            <Pressable onPress={()=>setSort('latest')} style={{backgroundColor:sort==='latest'?'#FFD60A':'#efefef',paddingHorizontal:16,height:32,borderRadius:16,justifyContent:'center',marginRight:8}}>
              <Text style={{fontWeight:'800',fontSize:13}}>Latest</Text>
            </Pressable>
            <Pressable onPress={()=>setSort('trending')} style={{backgroundColor:sort==='trending'?'#000':'#efefef',paddingHorizontal:16,height:32,borderRadius:16,justifyContent:'center'}}>
              <Text style={{color:sort==='trending'?'#fff':'#000',fontWeight:'700',fontSize:13}}>Trending</Text>
            </Pressable>
          </View>
          <Text style={{color:'#999',fontSize:11}}>{lang.toUpperCase()} • {time} • {sort}</Text>
        </View>
      </View>

      {/* NEWS - full V5 features: full article link + bookmark + width fixed + heading 2 lines */}
      <View style={{flex:1,backgroundColor:'#fff'}}>
        <FlatList
          data={arts}
          keyExtractor={(i,idx)=>i.url+idx}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom:16}}
          ListEmptyComponent={isLoading? <ActivityIndicator style={{marginTop:30}}/> : null}
          renderItem={({item})=>(
            <View style={{marginHorizontal:12,marginTop:12,backgroundColor:'#fff',borderRadius:20,overflow:'hidden',borderWidth:1,borderColor:'#ececec'}}>
              <Link href={{pathname:'/article/[id]',params:{id:encodeURIComponent(item.url)}}} asChild>
                <Pressable>
                  {item.image? <Image source={{uri:item.image}} style={{width:'100%',height:200,backgroundColor:'#f2f2f2'}}/> : null}
                  <View style={{padding:12}}>
                    <Text numberOfLines={2} style={{fontSize:17,fontWeight:'800',lineHeight:22,color:'#000'}}>{item.title}</Text>
                    <Text numberOfLines={2} style={{fontSize:13,color:'#666',marginTop:6,lineHeight:18}}>{item.description}</Text>
                  </View>
                </Pressable>
              </Link>

              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingBottom:10}}>
                <Text style={{color:'#0A84FF',fontWeight:'700',fontSize:11,flex:1}} numberOfLines={1}>{item.source} • {item.publishedAt?.slice(0,10) || ''}</Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Pressable onPress={()=>toggleSave(item.url)} style={{width:32,height:32,borderRadius:16,backgroundColor:'#f5f5f5',alignItems:'center',justifyContent:'center',marginRight:8}}>
                    <Ionicons name={saved[item.url]? "bookmark" : "bookmark-outline"} size={16} color="#000"/>
                  </Pressable>
                  <Link href={{pathname:'/article/[id]',params:{id:encodeURIComponent(item.url)}}} asChild>
                    <Pressable style={{backgroundColor:'#000',paddingHorizontal:12,height:28,borderRadius:14,justifyContent:'center'}}>
                      <Text style={{color:'#fff',fontWeight:'700',fontSize:11}}>READ IN-APP →</Text>
                    </Pressable>
                  </Link>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}