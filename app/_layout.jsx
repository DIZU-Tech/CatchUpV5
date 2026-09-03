import {Stack} from 'expo-router';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useAuth} from '../src/store/auth';

const qc = new QueryClient();

export default function RootLayout(){
  const {user} = useAuth(); // from auth.py via api.js
  return (
    <QueryClientProvider client={qc}>
      <Stack screenOptions={{headerShown:false}}>
        {/* This is the connector - if no user -> show auth screens, if user -> show tabs */}
        {!user ? (
          <Stack.Screen name="(auth)" />
        ) : (
          <Stack.Screen name="(tabs)" />
        )}
        <Stack.Screen name="article/[id]" options={{presentation:'modal'}}/>
        <Stack.Screen name="settings" options={{presentation:'stack'}}/>
      </Stack>
    </QueryClientProvider>
  );
}