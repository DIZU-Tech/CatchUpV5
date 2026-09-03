import {View,Text,FlatList,Image,Pressable,TextInput,ScrollView,ActivityIndicator,Dimensions} from 'react-native';
import {useState,useEffect} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {Video} from 'expo-av';
import {api} from '../../src/lib/api';
import {useSettings} from '../../src/store/settings';

const {width,height} = Dimensions.get('window');

export default function Live(){
  const {country}=useSettings();
  const [channels,setChannels]=useState([]);
  const [followed,setFollowed]=useState({});
  const [active,setActive]=useState(null); // active channel for horizontal watch
  const [stream,setStream]=useState(null);
  const [quality,setQuality]=useState('Auto');
  const [showQuality,setShowQuality]=useState(false);
  const [comments,setComments]=useState([]);
  const [text,setText]=useState('');
  const [reactions,setReactions]=useState([]); // floating
  const [interested,setInterested]=useState({});

  useEffect(()=>{ loadChannels(); },[country]);
  const loadChannels=async()=>{
    try{
      const r = await api.getLiveChannels(country); // calls live.py -> live channels with logo, info, live now
      setChannels(r.channels || [
        {id:'aljazeera',name:'Al Jazeera English',logo:'https://i.imgur.com/8Km9tLL.png',info:'24/7 News • Qatar • 2.1M followers',isLive:true, liveLabel:'LIVE NOW', category:'News'},
        {id:'bbc',name:'BBC News',logo:'https://i.imgur.com/2nCt3Sb.png',info:'World News • UK • 3.4M followers',isLive:true, liveLabel:'LIVE NOW', category:'News'},
        {id:'channels',name:'Channels TV',logo:'https://i.imgur.com/k2tG7uR.png',info:'Nigeria News • Lagos • 1.2M followers',isLive:false, liveLabel:'LIVE AT 8PM', category:'Local'},
        {id:'cnn',name:'CNN',logo:'https://i.imgur.com/Qr7p6bN.png',info:'Breaking News • USA • 4M followers',isLive:true, liveLabel:'LIVE NOW', category:'International'},
      ]);
    }catch{}
  };

  const openWatch=async(ch)=>{
    setActive(ch);
    setStream(null);
    try{
      const s = await api.getLiveStream(ch.id); // calls /api/live/{id}/stream -> live.py returns stream url
      setStream(s);
      setComments(s.comments||[{user:'Aisha',text:'Live now 🔥'},{user:'Dizu',text:'Clear stream'}]);
    }catch{
      setStream({streamUrl:'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', title: ch.name});
    }
  };

  const toggleFollow=(id)=> setFollowed(f=>({...f,[id]:!f[id]}));

  const sendReaction=(type)=>{
    // 5 reactions: heart, like, smile, funny, happy
    const id=Date.now();
    setReactions(r=>[...r,{id,type}]);
    setTimeout(()=> setReactions(r=>r.filter(x=>x.id!==id)), 2500);
    if(active) api.liveReact(active.id, type); // calls /api/live/{id}/react -> interactions.py + live.py
  };

  const sendComment=async()=>{
    if(!text.trim()||!active) return;
    const newC={user:'You',text:text.trim()};
    setComments(c=>[...c,newC]);
    setText('');
    try{ await api.liveComment(active.id, newC.text); }catch{}
  };

  // CHANNEL LIST
  if(!active){
    return (
      <View style={{flex:1,backgroundColor:'#000'}}>
        <View style={{backgroundColor:'#000',paddingTop:44,paddingBottom:10,paddingHorizontal:16,flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{color:'#fff',fontSize:22,fontWeight:'900'}}>Live Channels</Text>
          <View style={{backgroundColor:'#111',paddingHorizontal:10,paddingVertical:5,borderRadius:14}}><Text style={{color:'#fff',fontSize:11}}>{channels.filter(c=>c.isLive).length} LIVE NOW</Text></View>
        </View>

        <FlatList data={channels} keyExtractor={i=>i.id} contentContainerStyle={{padding:12}} renderItem={({item})=>(
          <View style={{backgroundColor:'#111',borderRadius:18,padding:12,marginBottom:12,flexDirection:'row',borderWidth:1,borderColor:'#222'}}>
            <Image source={{uri:item.logo}} style={{width:48,height:48,borderRadius:24,backgroundColor:'#222'}}/>
            <View style={{flex:1,marginLeft:12}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{color:'#fff',fontWeight:'800',fontSize:14}}>{item.name}</Text>
                {item.isLive && <View style={{marginLeft:8,backgroundColor:'#ff0000',paddingHorizontal:6,paddingVertical:2,borderRadius:10,flexDirection:'row',alignItems:'center'}}><View style={{width:6,height:6,borderRadius:3,backgroundColor:'#fff',marginRight:4}}/><Text style={{color:'#fff',fontSize:9,fontWeight:'900'}}>LIVE NOW</Text></View>}
                {!item.isLive && <View style={{marginLeft:8,backgroundColor:'#222',paddingHorizontal:6,paddingVertical:2,borderRadius:10}}><Text style={{color:'#aaa',fontSize:9}}>{item.liveLabel}</Text></View>}
              </View>
              <Text style={{color:'#aaa',fontSize:11,marginTop:2}} numberOfLines={1}>{item.info} • {item.category}</Text>
              <View style={{flexDirection:'row',marginTop:10}}>
                <Pressable onPress={()=>openWatch(item)} style={{backgroundColor:'#fff',paddingHorizontal:14,height:30,borderRadius:15,flexDirection:'row',alignItems:'center'}}>
                  <Ionicons name="play" size={12} color="#000"/><Text style={{fontWeight:'800',fontSize:11,marginLeft:4}}>WATCH NOW</Text>
                </Pressable>
                <Pressable onPress={()=>toggleFollow(item.id)} style={{marginLeft:8,backgroundColor:followed[item.id]?'#222':'#000',borderWidth:1,borderColor:followed[item.id]?'#333':'#fff',paddingHorizontal:14,height:30,borderRadius:15,justifyContent:'center'}}>
                  <Text style={{color:followed[item.id]?'#aaa':'#fff',fontSize:11,fontWeight:'700'}}>{followed[item.id]?'Following':'Follow'}</Text>
                </Pressable>
              </View>
            </View>
            <Image source={{uri:item.logo}} style={{width:28,height:28,borderRadius:14,opacity:0.2,position:'absolute',right:10,top:10}}/>
          </View>
        )}/>
      </View>
    );
  }

  // HORIZONTAL FULL SCREEN WATCH - like real live news
  return (
    <View style={{flex:1,backgroundColor:'#000',width:height,height:width,transform:[{rotate:'90deg'}],marginLeft:(width-height)/2,marginTop:(height-width)/2}}>
      {/* Video */}
      <View style={{flex:1,backgroundColor:'#000'}}>
        {stream?.streamUrl? (
          <Video source={{uri: stream.streamUrl}} style={{width:'100%',height:'100%'}} shouldPlay isLooping resizeMode="contain"/>
        ) : <ActivityIndicator style={{flex:1}} color="#fff"/>}

        {/* Top bar */}
        <View style={{position:'absolute',top:0,left:0,right:0,flexDirection:'row',justifyContent:'space-between',padding:14,backgroundColor:'rgba(0,0,0,0.5)'}}>
          <Pressable onPress={()=>setActive(null)} style={{backgroundColor:'rgba(0,0,0,0.6)',width:36,height:36,borderRadius:18,alignItems:'center',justifyContent:'center'}}>
            <Ionicons name="close" size={20} color="#fff"/>
          </Pressable>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Pressable onPress={()=>setShowQuality(!showQuality)} style={{backgroundColor:'rgba(0,0,0,0.6)',paddingHorizontal:10,height:32,borderRadius:16,flexDirection:'row',alignItems:'center',marginRight:8}}>
              <Ionicons name="settings" size={12} color="#fff"/><Text style={{color:'#fff',fontSize:11,marginLeft:4}}>{quality}</Text>
            </Pressable>
            <View style={{backgroundColor:'#ff0000',paddingHorizontal:8,paddingVertical:4,borderRadius:10,flexDirection:'row',alignItems:'center'}}>
              <View style={{width:6,height:6,borderRadius:3,backgroundColor:'#fff',marginRight:4}}/><Text style={{color:'#fff',fontSize:10,fontWeight:'900'}}>LIVE</Text>
            </View>
          </View>
        </View>

        {showQuality && (
          <View style={{position:'absolute',top:50,right:14,backgroundColor:'#111',borderRadius:12,padding:8}}>
            {['Auto','1080p','720p','480p'].map(q=>(
              <Pressable key={q} onPress={()=>{setQuality(q); setShowQuality(false);}} style={{paddingHorizontal:14,paddingVertical:8,backgroundColor:quality===q?'#fff':'#111',borderRadius:8,marginBottom:4}}>
                <Text style={{color:quality===q?'#000':'#fff',fontSize:12}}>{q}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Floating reactions - 5 inside video while watching */}
        {reactions.map(r=>(
          <View key={r.id} style={{position:'absolute',bottom:100,left: Math.random()*200+50, backgroundColor:'rgba(0,0,0,0.5)',padding:6,borderRadius:20}}>
            <Text style={{fontSize:20}}>{r.type==='heart'?'❤️': r.type==='like'?'👍': r.type==='smile'?'😊': r.type==='funny'?'😂': '😃'}</Text>
          </View>
        ))}

        {/* Bottom - reactions bar + comments */}
        <View style={{position:'absolute',bottom:0,left:0,right:0,backgroundColor:'rgba(0,0,0,0.7)',padding:12}}>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <View style={{flexDirection:'row'}}>
              {[
                {id:'heart',icon:'heart',label:'love'},
                {id:'like',icon:'thumbs-up',label:'like'},
                {id:'smile',icon:'happy',label:'smile'},
                {id:'funny',icon:'happy-outline',label:'funny'},
                {id:'happy',icon:'sunny',label:'happy'},
              ].map(b=>(
                <Pressable key={b.id} onPress={()=>sendReaction(b.id)} style={{width:40,height:40,borderRadius:20,backgroundColor:'#1a1a1a',alignItems:'center',justifyContent:'center',marginRight:8,borderWidth:1,borderColor:'#333'}}>
                  <Ionicons name={b.icon} size={18} color={b.id==='heart'?'#ff0000':'#fff'}/>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={()=>setInterested(i=>({...i,[active.id]:!i[active.id]}))} style={{backgroundColor:interested[active.id]?'#fff':'#222',paddingHorizontal:12,height:30,borderRadius:15,justifyContent:'center'}}>
              <Text style={{color:interested[active.id]?'#000':'#fff',fontSize:11,fontWeight:'700'}}>{interested[active.id]?'Interested ✓':'Interested?'}</Text>
            </Pressable>
          </View>

          <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
            <View style={{flex:1,backgroundColor:'#111',borderRadius:20,height:36,flexDirection:'row',alignItems:'center',paddingHorizontal:12}}>
              <TextInput value={text} onChangeText={setText} placeholder="Live comment..." placeholderTextColor="#666" style={{flex:1,color:'#fff',fontSize:12}}/>
            </View>
            <Pressable onPress={sendComment} style={{marginLeft:8,backgroundColor:'#fff',width:36,height:36,borderRadius:18,alignItems:'center',justifyContent:'center'}}>
              <Ionicons name="send" size={14} color="#000"/>
            </Pressable>
          </View>

          <ScrollView style={{maxHeight:70,marginTop:8}} showsVerticalScrollIndicator={false}>
            {comments.map((c,i)=><Text key={i} style={{color:'#fff',fontSize:11,marginBottom:2}}><Text style={{fontWeight:'800'}}>{c.user}: </Text>{c.text}</Text>)}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}