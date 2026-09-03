import {Redirect} from 'expo-router';
import {useAuth} from '../src/store/auth';

export default function Index(){
  const {user} = useAuth();
  // If no user -> Login, if user -> News (global mix, not NG only)
  return <Redirect href={user ? '/(tabs)/home' : '/(auth)/login'} />;
}