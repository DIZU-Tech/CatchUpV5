import {View,Text,TextInput,Pressable,FlatList,ScrollView,Alert,ActivityIndicator} from 'react-native';
import {useState,useEffect} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import * as FileSystem from 'expo-file-system';
import {api} from '../../src/lib/api';
import {useSettings} from '../../src/store/settings';

export default function Browser(){
  const {engine, incognito, toggleIncognito, addDownload, downloads} = useSettings();
  const [tabs,setTabs]=useState([{id:1,url:'',title:'New Tab'}]);
  const [active,setActive]=useState(1);
  const [q,setQ]=useState('');
  const [loading,setLoading]=useState(false);
  const [page,setPage]=useState(null); // from /api/browser?url=
  const [trending,setTrending]=useState([]);
  const [history,setHistory]=useState([]);

  const activeTab = tabs.find(t=>t.id===active);

  useEffect(()=>{ loadTrending(); loadHistory(); },[]);
  const loadTrending=async()=>{
    try{
      const r = await api.trending(); // calls browser.py /api/trending
      let list = r.trending || r.results || [];
      // force #1 = www.brave-trader.com as you asked for now
      if(!list.find(i=>i.query?.includes('brave-trader'))){
        list = [{query:'www.brave-trader.com',rank:1,change:'up',hot:true,count:'12.4k'},...list];
      }
      setTrending(list);
    }catch{
      // fallback with flames + green up / red down
      setTrending([
        {query:'www.brave-trader.com',rank:1,change:'up',hot:true,count:'12.4k'},
        {query:'Aluta Continua protest',rank:2,change:'up',hot:true,count:'8.2k'},
        {query:'Naira to Dollar',rank:3,change:'down',hot:false,count:'6.1k'},
        {query:'Burna Boy new album',rank:4,change:'up',hot:true,count:'5.4k'},
        {query:'Premier League fixtures',rank:5,change:'down',hot:false,count:'4.9k'},
      ]);
    }
  };
  const loadHistory=async()=>{
    try{ const r = await api.search('',''); const h = await fetch('https://catch-up-v5-final-build.onrender.com/api/browser/history').then(x=>x.json()).catch(()=>({})); setHistory(h.history||[]);}catch{}
  };

  const addTab=()=>{
    const id=Date.now(); setTabs([...tabs,{id,url:'',title:'New Tab'}]); setActive(id); setPage(null); setQ('');
  };
  const closeTab=(id)=>{
    if(tabs.length===1) return;
    const filtered = tabs.filter(t=>t.id!==id);
    setTabs(filtered);
    if(active===id) setActive(filtered[0].id);
  };

  const doGo=async(urlOrQuery)=>{
    const input = (urlOrQuery || q).trim();
    if(!input) return;
    setLoading(true);
    try{
      const isUrl = input.includes('.') &&!input.includes(' ');
      const target = isUrl? (input.startsWith('http')? input : 'https://'+input) : input;

      if(isUrl){
        // BROWSE -> calls browser.py + adblock.py + extractor.py + content_filter.py
        const data = await api.browse(target, engine, incognito); // /api/browser?url=&engine=&incognito=
        setPage(data);
        const newTitle = data.title || target.replace('https://','').slice(0,20);
        setTabs(tabs.map(t=> t.id===active? {...t,url:target,title:newTitle} : t));
        if(!incognito) setHistory(h=>[{url:target,title:newTitle,time:Date.now()},...h].slice(0,20));
      }else{
        // SEARCH -> calls /api/search?q=&engine= backend filters
        const r = await api.search(input, engine);
        setPage({type:'search', results: r.results||r.articles||[], query:input});
        setTabs(tabs.map(t=> t.id===active? {...t,url:input,title:input.slice(0,20)} : t));
      }
    }catch(e){ Alert.alert('Browser error', e.message); }
    finally{ setLoading(false); }
  };

  const downloadFile=async(url)=>{
    try{
      const fileUri = FileSystem.documentDirectory + Date.now() + '_' + (url.split('/').pop()||'file.jpg');
      const dl = await FileSystem.downloadAsync(api.download(url), fileUri); // /api/download?url= saves to phone
      addDownload({url, fileUri:dl.uri, name: url.split('/').pop()});
      Alert.alert('Downloaded to phone', dl.uri);
    }catch(e){ Alert.alert('Download failed', e.message); }
  };

  return (
    <View style={{flex:1,backgroundColor:'#000'}}>
      {/* HEADER - same black as Home */}
      <View style={{backgroundColor:'#000',paddingTop:44,paddingBottom:10,paddingHorizontal:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <Text style={{color:'#fff',fontSize:22,fontWeight:'900'}}>Catch-up</Text>
          <View style={{flexDirection:'row',marginLeft:10}}>
            <Pressable onPress={()=>router.push('/(tabs)/home')} style={{backgroundColor:'#222',paddingHorizontal:12,paddingVertical:5,borderRadius:20,marginRight:6}}><Text style={{color:'#fff',fontSize:12}}>News</Text></Pressable>
            <View style={{backgroundColor:'#fff',paddingHorizontal:12,paddingVertical:5,borderRadius:20}}><Text style={{fontWeight:'800',fontSize:12}}>Browser</Text></View>
          </View>
        </View>
        <Pressable onPress={()=>router.push('/settings/browser-settings')} style={{backgroundColor:'#111',width:32,height:32,borderRadius:16,alignItems:'center',justifyContent:'center'}}>
          <Ionicons name="settings" size={16} color="#7cc8ff"/>
        </Pressable>
      </View>

      {/* TABS BAR */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{maxHeight:44,backgroundColor:'#0a0a0a'}} contentContainerStyle={{paddingHorizontal:8,alignItems:'center'}}>
        {tabs.map(t=>(
          <Pressable key={t.id} onPress={()=>{setActive(t.id); const found=tabs.find(x=>x.id===t.id); if(found?.url) {setQ(found.url); setPage(null);} }} style={{backgroundColor:active===t.id?'#fff':'#1a1a1a',paddingHorizontal:14,height:30,borderRadius:16,flexDirection:'row',alignItems:'center',marginRight:8}}>
            <Text style={{color:active===t.id?'#000':'#fff',fontSize:12,fontWeight:'600'}} numberOfLines={1}>{t.title}</Text>
            <Pressable onPress={()=>closeTab(t.id)} style={{marginLeft:8}}><Ionicons name="close" size={12} color={active===t.id?'#000':'#fff'}/></Pressable>
          </Pressable>
        ))}
        <Pressable onPress={addTab} style={{backgroundColor:'#222',width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center'}}><Ionicons name="add" size={18} color="#fff"/></Pressable>
      </ScrollView>

      {/* SEARCH BAR + incognito + engine */}
      <View style={{backgroundColor:'#fff',padding:10,flexDirection:'row',alignItems:'center'}}>
        <View style={{flex:1,backgroundColor:'#f2f2f2',borderRadius:24,height:44,flexDirection:'row',alignItems:'center',paddingHorizontal:14}}>
          <Ionicons name={engine==='google'?'logo-google': engine==='bing'?'globe':'search'} size={14} color="#888"/>
          <TextInput value={q} onChangeText={setQ} placeholder={incognito?'Incognito - search or enter URL':'Search or enter URL (filtered via browser.py)'} placeholderTextColor="#999" style={{flex:1,marginLeft:8,fontSize:14,color:'#000'}} autoCapitalize="none" onSubmitEditing={()=>doGo()}/>
        </View>
        <Pressable onPress={toggleIncognito} style={{marginLeft:8,width:44,height:44,borderRadius:22,backgroundColor:incognito?'#000':'#efefef',alignItems:'center',justifyContent:'center'}}>
          <Ionicons name={incognito?'eye-off':'eye'} size={16} color={incognito?'#fff':'#000'}/>
        </Pressable>
        <Pressable onPress={()=>doGo()} style={{marginLeft:8,backgroundColor:'#000',width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center'}}>
          <Text style={{color:'#fff',fontWeight:'800',fontSize:12}}>Go</Text>
        </Pressable>
      </View>

      {/* CONTENT */}
      <View style={{flex:1,backgroundColor:'#fff'}}>
        {loading && <ActivityIndicator style={{marginTop:20}}/>}

        {/* NEW TAB - Trending with flames + green up red down + history */}
        {!page &&!loading && (
          <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom:20}}>
            <View style={{padding:14}}>
              <View style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
                <Ionicons name="flame" size={18} color="#ff6a00"/>
                <Text style={{fontWeight:'900',fontSize:16,marginLeft:6}}>Trending Searches</Text>
                <Text style={{color:'#888',fontSize:11,marginLeft:8}}>engine: {engine} • {incognito?'incognito':'normal'}</Text>
              </View>

              {trending.map((item,idx)=>(
                <Pressable key={idx} onPress={()=>{setQ(item.query); doGo(item.query);}} style={{flexDirection:'row',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderColor:'#f2f2f2'}}>
                  <Text style={{width:22,fontWeight:'900',fontSize:13,color:'#000'}}>{item.rank || idx+1}</Text>
                  {item.hot && <Ionicons name="flame" size={14} color="#ff4500" style={{marginRight:6}}/>}
                  <Text style={{flex:1,fontSize:14,fontWeight:'600',color:'#000'}} numberOfLines={1}>{item.query}</Text>
                  <View style={{flexDirection:'row',alignItems:'center',marginLeft:8}}>
                    {item.change==='up'? <Ionicons name="arrow-up" size={14} color="#00c851"/> : item.change==='down'? <Ionicons name="arrow-down" size={14} color="#ff4444"/> : null}
                    <Text style={{fontSize:10,color:item.change==='up'?'#00c851':item.change==='down'?'#ff4444':'#999',marginLeft:2,marginRight:8}}>{item.change==='up'?'':''}</Text>
                    <Text style={{fontSize:11,color:'#999'}}>{item.count||''}</Text>
                  </View>
                </Pressable>
              ))}

              <Text style={{fontWeight:'800',marginTop:20,marginBottom:8}}>History {incognito? '(paused - incognito)':''}</Text>
              {history.map((h,i)=>(
                <Pressable key={i} onPress={()=>{setQ(h.url); doGo(h.url);}} style={{paddingVertical:8}}>
                  <Text style={{fontSize:13,color:'#000'}} numberOfLines={1}>{h.title||h.url}</Text>
                  <Text style={{fontSize:11,color:'#888'}} numberOfLines={1}>{h.url}</Text>
                </Pressable>
              ))}

              <Text style={{fontWeight:'800',marginTop:20,marginBottom:8}}>Downloads ({downloads.length})</Text>
              {downloads.map((d,i)=>(
                <View key={i} style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:8,borderBottomWidth:1,borderColor:'#f2f2f2'}}>
                  <Text style={{fontSize:12,flex:1}} numberOfLines={1}>{d.name}</Text>
                  <Pressable onPress={()=>downloadFile(d.url)}><Text style={{color:'#0A84FF',fontSize:11}}>Open</Text></Pressable>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* BROWSED PAGE - from backend */}
        {page && page.type!=='search' && (
          <ScrollView style={{flex:1,padding:14}}>
            <Text style={{fontWeight:'800',fontSize:16}}>{page.title||activeTab?.title}</Text>
            <Text style={{color:'#0A84FF',fontSize:11,marginTop:4}}>{page.url||activeTab?.url} • filtered via adblock.py + content_filter.py</Text>
            <Text style={{marginTop:12,fontSize:13,lineHeight:20}}>{page.content?.slice(0,4000) || 'Content loaded via /api/browser?url= (extractor.py). No external links.'}</Text>
            <Pressable onPress={()=>downloadFile(page.url||activeTab?.url)} style={{marginTop:16,backgroundColor:'#000',padding:12,borderRadius:12}}>
              <Text style={{color:'#fff',textAlign:'center',fontWeight:'700'}}>Download in-app (calls /api/download) saves to phone</Text>
            </Pressable>
          </ScrollView>
        )}

        {/* SEARCH RESULTS */}
        {page && page.type==='search' && (
          <FlatList data={page.results} keyExtractor={(_,i)=>String(i)} renderItem={({item})=>(
            <Pressable onPress={()=>{setQ(item.url||item.link); doGo(item.url||item.link);}} style={{padding:14,borderBottomWidth:1,borderColor:'#f0f0f0'}}>
              <Text style={{fontWeight:'700',fontSize:14}}>{item.title||item.url}</Text>
              <Text style={{fontSize:11,color:'#666',marginTop:4}} numberOfLines={2}>{item.snippet||item.description||''}</Text>
              <Text style={{color:'#0A84FF',fontSize:10,marginTop:6}}>{item.url||item.link}</Text>
            </Pressable>
          )}/>
        )}
      </View>
    </View>
  );
}