import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = create(persist((set)=>({
  user: null,
  setUser: (u)=> set({user: u}),
  logout: ()=> set({user: null}),
}),{
  name: 'catchup-auth',
  storage: createJSONStorage(()=>AsyncStorage),
}));