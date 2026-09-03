import {View,Text,Pressable,ScrollView} from 'react-native';
import {Link} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {useAuth} from '../../src/store/auth';

export default function Settings(){
  const {user,logout}=useAuth();
  const items=[
    {title:'Profile',desc:'Avatar, username, disable / delete',icon:'person',href:'/settings/profile'},
    {title:'Notifications',desc:'Breaking, trending, sources, live',icon:'notifications',href:'/settings/notifications'},
    {title:'Language',desc:'News + in-app text',icon:'language',href:'/settings/language'},
    {title:'Browser Settings',desc:'Engine bing / google / duckduckgo, downloads',icon:'globe',href:'/settings/browser-settings'},
    {title:'Bookmarks',desc:'Saved news with warning',icon:'bookmark',href:'/settings/bookmarks'},
    {title:'Downloads',desc:'Files saved to phone',icon:'download',href:'/settings/downloads'},
  ];
  return (
    <View style={{flex:1,backgroundColor:'#000'}}>
      <View style={{paddingTop:50,paddingBottom:14,paddingHorizontal:16}}><Text style={{color:'#fff',fontSize:24,fontWeight:'900'}}>Settings</Text><Text style={{color:'#666',fontSize:12,marginTop:2}}>{user?.email||''}</Text></View>
      <ScrollView contentContainerStyle={{padding:12}}>
        {items.map(i=>(
          <Link key={i.title} href={i.href} asChild>
            <Pressable style={{backgroundColor:'#111',borderRadius:16,padding:14,flexDirection:'row',alignItems:'center',marginBottom:10,borderWidth:1,borderColor:'#222'}}>
              <View style={{width:36,height:36,borderRadius:18,backgroundColor:'#1a1a1a',alignItems:'center',justifyContent:'center'}}><Ionicons name={i.icon} size={16} color="#fff"/></View>
              <View style={{flex:1,marginLeft:12}}><Text style={{color:'#fff',fontWeight:'700'}}>{i.title}</Text><Text style={{color:'#777',fontSize:11,marginTop:2}}>{i.desc}</Text></View>
              <Ionicons name="chevron-forward" size={16} color="#555"/>
            </Pressable>
          </Link>
        ))}
        <Pressable onPress={logout} style={{backgroundColor:'#ff0000',borderRadius:16,padding:14,marginTop:20,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'800'}}>Sign Out</Text></Pressable>
      </ScrollView>
    </View>
  );
}