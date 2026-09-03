const BASE = 'https://catch-up-v5-final-build.onrender.com'; // your Render backend

export const api = {
  // --- Auth → auth.py + user.py ---
  login: (email,password)=>fetch(`${BASE}/api/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}).then(r=>r.json()),
  register: (email,password,name)=>fetch(`${BASE}/api/auth/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,name})}).then(r=>r.json()),
  updateProfile: (d)=>fetch(`${BASE}/api/user/profile`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(r=>r.json()),
  deleteAccount: ()=>fetch(`${BASE}/api/user/delete`,{method:'DELETE'}).then(r=>r.json()),

  // --- News → news.py + languages.py + translate.py + content_filter.py ---
  getNews: ({category,country,lang,time,sort})=>fetch(`${BASE}/api/news?category=${category}&country=${country}&lang=${lang}&time=${time}&sort=${sort}`).then(r=>r.json()),
  getLanguages: ()=>fetch(`${BASE}/api/languages`).then(r=>r.json()), // languages.py

  // --- Article → article.py + extractor.py + content_filter.py + adblock.py ---
  getArticle: (url)=>fetch(`${BASE}/api/article?url=${encodeURIComponent(url)}`).then(r=>r.json()),
  browse: (url,engine,incognito)=>fetch(`${BASE}/api/browser?url=${encodeURIComponent(url)}&engine=${engine}&incognito=${incognito}`).then(r=>r.json()), // browser.py + adblock.py + extractor.py
  search: (q,engine)=>fetch(`${BASE}/api/search?q=${encodeURIComponent(q)}&engine=${engine}`).then(r=>r.json()), // browser.py search
  trending: ()=>fetch(`${BASE}/api/trending`).then(r=>r.json()),
  download: (url)=>`${BASE}/api/download?url=${encodeURIComponent(url)}`, // for FileSystem.downloadAsync

  // --- Live → live.py + interactions.py ---
  getLiveChannels: (country)=>fetch(`${BASE}/api/live?country=${country}`).then(r=>r.json()),
  getLiveStream: (id)=>fetch(`${BASE}/api/live/${id}/stream`).then(r=>r.json()),
  liveReact: (id,type)=>fetch(`${BASE}/api/live/${id}/react`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type})}).then(r=>r.json()),
  liveComment: (id,text)=>fetch(`${BASE}/api/live/${id}/comment`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})}).then(r=>r.json()),

  // --- Interactions + Bookmarks → bookmarks.py + interactions.py + cloud_store.py ---
  getBookmarks: ()=>fetch(`${BASE}/api/bookmarks`).then(r=>r.json()),
  addBookmark: (url)=>fetch(`${BASE}/api/bookmarks`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})}).then(r=>r.json()),
  removeBookmark: (url)=>fetch(`${BASE}/api/bookmarks?url=${encodeURIComponent(url)}`,{method:'DELETE'}).then(r=>r.json()),
  like: (url)=>fetch(`${BASE}/api/interactions/like`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})}).then(r=>r.json()),
};