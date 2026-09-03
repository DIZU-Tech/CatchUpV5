import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {api} from '../lib/api';
import {useSettings} from '../store/settings';

export const useNews = ()=>{
  const {country, lang} = useSettings(); // country = global -> backend mixes 60% your country + 40% world
  const [category,setCategory]=useState('top');
  const [time,setTime]=useState('all');
  const [sort,setSort]=useState('latest');

  const q = useQuery({
    queryKey:['news',category,time,sort,country,lang],
    queryFn:()=>api.getNews({category,country,lang,time,sort}), // calls news.py + languages.py + content_filter.py
  });

  return {...q, category,setCategory, time,setTime, sort,setSort};
};