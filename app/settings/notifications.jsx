import {View,Text,Switch} from 'react-native';
import {useSettings} from '../../src/store/settings';
export default function Notif(){
  const {notifications,setNotifications}=useSettings();
  return (
    <View style={{flex:1,backgroundColor:'#000',paddingTop:50,paddingHorizontal:16}}>
      <Text style={{color:'#fff',fontSize:20,fontWeight:'800'}}>Notifications → cloud_store.py</Text>
      {Object.keys(notifications).map(k=>(
        <View key={k} style={{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#111',padding:16,borderRadius:12,marginTop:12}}>
          <Text style={{color:'#fff',textTransform:'capitalize'}}>{k}</Text>
          <Switch value={notifications[k]} onValueChange={v=>setNotifications(k,v)} trackColor={{true:'#FFD60A'}}/>
        </View>
      ))}
    </View>
  );
}