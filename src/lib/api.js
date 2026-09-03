const BASE = 'https://catch-up-v5-final-build.onrender.com';

async function safeFetch(url, opts){
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } 
  catch(e){
    console.log('RAW SERVER:', text.slice(0,500));
    throw new Error(`Server ${res.status} returned HTML not JSON: ${text.slice(0,120)}`);
  }
  if(!res.ok) throw new Error(data.error || data.message || `Error ${res.status}`);
  return data;
}

export const api = {
  login: (email,password)=>safeFetch(`${BASE}/api/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}),
  register: (email,password,name)=>safeFetch(`${BASE}/api/auth/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,name})}),
  getNews: (p)=>safeFetch(`${BASE}/api/news?category=${p.category}&country=${p.country}&lang=${p.lang}&time=${p.time}&sort=${p.sort}`),
  // keep your other methods same but wrap with safeFetch
  getLanguages: ()=>safeFetch(`${BASE}/api/languages`),
  getArticle: (url)=>safeFetch(`${BASE}/api/article?url=${encodeURIComponent(url)}`),
  browse: (url,engine,incognito)=>safeFetch(`${BASE}/api/browser?url=${encodeURIComponent(url)}&engine=${engine}&incognito=${incognito}`),
  search: (q,engine)=>safeFetch(`${BASE}/api/search?q=${encodeURIComponent(q)}&engine=${engine}`),
  trending: ()=>safeFetch(`${BASE}/api/trending`),
};
