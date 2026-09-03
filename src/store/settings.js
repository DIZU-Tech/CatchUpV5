import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useSettings = create(persist((set,get)=>({
  // News - NOT ng main. Backend news.py mixes: 60% your country + 40% global
  country: 'global', // global = backend mixes world + user country (detected via IP or profile)
  lang: 'en',
  // Browser V5
  engine: 'google',
  incognito: false,
  downloads: [],
  // Notifications -> cloud_store.py
  notifications: {breaking:true, trending:true, sources:false, live:true},

  setCountry: (c)=>set({country:c}),
  setLang: (l)=>set({lang:l}),
  setEngine: (e)=>set({engine:e}),
  toggleIncognito: ()=>set({incognito:!get().incognito}),
  setNotifications: (k,v)=>set({notifications:{...get().notifications,[k]:v}}),
  addDownload: (d)=>set({downloads:[d,...get().downloads].slice(0,100)}),
}),{
  name:'catchup-v5-settings',
  storage: createJSONStorage(()=>AsyncStorage)
}));