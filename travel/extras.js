const NYC_ATTRACTIONS = [
  {
    name:'Gantry Plaza State Park',
    zh:'甘特里廣場州立公園',
    day:'Day 1 / 回住宿前',
    image:'View from Gantry Plaza State Park.jpg',
    intro:'就在 Long Island City 河岸，是你們住宿基地附近最值得反覆去的免費景點。正對 Midtown skyline，黃昏到夜景特別漂亮。',
    why:'第一天剛落地最適合用這裡調時差；不需要進 Manhattan，也不用排隊。之後某天提早回 LIC，也可以再來一次。',
    tags:['免費','低體力','夕陽','媽媽友善'],
    map:'Gantry Plaza State Park, Long Island City, NY',
    official:'https://parks.ny.gov/parks/gantryplaza',
    source:'https://commons.wikimedia.org/wiki/File:View_from_Gantry_Plaza_State_Park.jpg'
  },
  {
    name:'Grand Central Terminal',
    zh:'中央車站',
    day:'Day 1 / Midtown 順路',
    image:'Main Concourse of Grand Central Terminal, October 2025.jpg',
    intro:'Beaux-Arts 建築代表作，也是從 LIC 搭 7 Train 進 Manhattan 最自然的第一站之一。主大廳天花板、四面鐘和整體空間感非常值得看。',
    why:'你們從 Vernon Blvd 一帶坐 7 號線很快就到，幾乎沒有額外繞路，適合放在任何 Midtown 行程前後。',
    tags:['室內','免費','建築','交通順路'],
    map:'Grand Central Terminal, New York, NY',
    official:'https://www.grandcentralterminal.com/',
    source:'https://commons.wikimedia.org/wiki/File:Main_Concourse_of_Grand_Central_Terminal,_October_2025.jpg'
  },
  {
    name:'Central Park · Bow Bridge',
    zh:'中央公園・弓橋',
    day:'Day 2',
    image:'Bow Bridge with the Central Park South skyline, Central Park, Manhattan, New York.jpg',
    intro:'第一次來紐約最值得留半天慢走的城市綠地。Bow Bridge、The Lake、Bethesda Terrace 都在相對集中的區域，不需要把整座公園走完。',
    why:'和 The Met 排同一天最合理。對媽媽同行，我會主張「只走精華區＋坐下喝咖啡」，不要追求從南走到北。',
    tags:['經典','秋天','散步','可縮短'],
    map:'Bow Bridge, Central Park, New York, NY',
    official:'https://www.centralparknyc.org/',
    source:'https://commons.wikimedia.org/wiki/File:Bow_Bridge_with_the_Central_Park_South_skyline,_Central_Park,_Manhattan,_New_York.jpg'
  },
  {
    name:'The Metropolitan Museum of Art',
    zh:'大都會藝術博物館',
    day:'Day 2',
    image:'Metropolitan Museum of Art (The Met) - Central Park, NYC.jpg',
    intro:'館藏跨度非常大，從古埃及、歐洲繪畫到亞洲藝術都有。第一次去不要企圖看完整館，挑 2–3 區就會舒服很多。',
    why:'它就在 Central Park 東側，和公園組成很漂亮的一天；如果下雨，更可以把戶外時間直接挪進館內。',
    tags:['文化必去','雨天友善','可坐著休息'],
    map:'The Metropolitan Museum of Art, New York, NY',
    official:'https://www.metmuseum.org/',
    source:'https://commons.wikimedia.org/wiki/File:Metropolitan_Museum_of_Art_(The_Met)_-_Central_Park,_NYC.jpg'
  },
  {
    name:'Statue of Liberty & Ellis Island',
    zh:'自由女神・艾利斯島',
    day:'Day 3',
    image:'Statue of Liberty, Liberty Island, New York - April 2026.jpg',
    intro:'不只是拍自由女神。搭船進港、走 Liberty Island，再看 Ellis Island 的移民史，會比只在岸邊拍照更完整地理解紐約。',
    why:'這是整趟最需要固定預約時間的景點之一，建議 10/5 早場；越早出發越能避開人潮，也保留下午 Lower Manhattan。',
    tags:['需預約','經典','歷史','半日'],
    map:'Statue of Liberty National Monument, New York, NY',
    official:'https://www.nps.gov/stli/index.htm',
    source:'https://commons.wikimedia.org/wiki/File:Statue_of_Liberty,_Liberty_Island,_New_York_-_April_2026.jpg'
  },
  {
    name:'9/11 Memorial & Oculus',
    zh:'九一一紀念園區・Oculus',
    day:'Day 3',
    image:'National September 11 Memorial, World Trade Center, Manhattan, New York.jpg',
    intro:'兩座紀念池位在原雙塔基址，空間本身就很有力量。旁邊 Oculus 則是完全不同的現代建築語言，很適合和 Wall Street 一起走。',
    why:'不用另外跨區，正好接自由女神之後的 Lower Manhattan 動線。若媽媽累了，可以只看戶外 Memorial，不一定進 Museum。',
    tags:['免費戶外','歷史','Lower Manhattan'],
    map:'9/11 Memorial & Museum, New York, NY',
    official:'https://www.911memorial.org/',
    source:'https://commons.wikimedia.org/wiki/File:National_September_11_Memorial,_World_Trade_Center,_Manhattan,_New_York.jpg'
  },
  {
    name:'The High Line',
    zh:'高線公園',
    day:'Day 4',
    image:'High Line Park.jpg',
    intro:'把舊高架貨運鐵路改造成線性公園，是紐約都市更新最具代表性的案例之一。沿途有植栽、街景、公共藝術和城市建築。',
    why:'和 Chelsea Market、Little Island、Hudson Yards 完全同一路線。建議由南往北走，最後到 Hudson Yards 吃飯或上 Edge。',
    tags:['免費','城市設計','Chelsea','步行'],
    map:'The High Line, New York, NY',
    official:'https://www.thehighline.org/',
    source:'https://commons.wikimedia.org/wiki/File:High_Line_Park.jpg'
  },
  {
    name:'DUMBO & Brooklyn Bridge Park',
    zh:'DUMBO・布魯克林大橋公園',
    day:'Day 5',
    image:'Brooklyn Bridge from DUMBO.jpg',
    intro:'這裡有最經典的 Manhattan Bridge 街景、Brooklyn Bridge、河岸 skyline，也有很多咖啡店和可以坐下休息的公園空間。',
    why:'從 LIC 搭 NYC Ferry 過去特別適合你們，省掉很多地鐵轉乘。媽媽如果累了，就不要硬走整座 Brooklyn Bridge，在河岸看橋反而更舒服。',
    tags:['拍照','河景','Ferry','媽媽友善'],
    map:'DUMBO, Brooklyn, NY',
    official:'https://www.brooklynbridgepark.org/',
    source:'https://commons.wikimedia.org/wiki/File:Brooklyn_Bridge_from_DUMBO.jpg'
  },
  {
    name:'Times Square at Night',
    zh:'時代廣場夜景',
    day:'Day 6 / Broadway 後',
    image:'Times Square ( night time).jpg',
    intro:'它不一定是紐約最美的地方，但第一次來很值得晚上看一次。真正的重點是巨型螢幕、人潮與 Broadway 劇院區那種「這就是紐約」的密度。',
    why:'不要特地拿半天給它；最好的方式是 Broadway 看完順路走 20–40 分鐘，再搭 7 Train 回 LIC。',
    tags:['夜景','免費','Broadway 順路','短停留'],
    map:'Times Square, New York, NY',
    official:'https://www.timessquarenyc.org/',
    source:'https://commons.wikimedia.org/wiki/File:Times_Square_(_night_time).jpg'
  },
  {
    name:'New York Botanical Garden',
    zh:'紐約植物園',
    day:'Optional · 秋季替換日',
    image:'NYBG Conservatory NY1.jpg',
    intro:'Bronx 的大型植物園，秋季很適合慢走。你們的日期又碰上 2026 Día de los Muertos 活動，會比一般月份更有季節感。',
    why:'如果媽媽對博物館已經看夠，或想安排一天更鬆、更有秋天感，NYBG 是我最推薦的替換選項。',
    tags:['秋季限定','低壓力','Bronx','半日～一日'],
    map:'New York Botanical Garden, Bronx, NY',
    official:'https://www.nybg.org/',
    source:'https://commons.wikimedia.org/wiki/File:NYBG_Conservatory_NY1.jpg'
  }
];

const commonsImg = file => `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}?width=1600`;
const mapsUrl = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

function renderAttractions(){
  const grid=document.querySelector('#attractionGrid');
  if(!grid) return;
  grid.innerHTML=NYC_ATTRACTIONS.map((a,i)=>`<article class="attraction-card">
    <a class="attraction-photo" href="${a.source}" target="_blank" rel="noopener" aria-label="Photo source for ${a.name}">
      <img src="${commonsImg(a.image)}" alt="${a.zh} ${a.name}" loading="lazy" referrerpolicy="no-referrer">
      <span class="photo-credit">Photo · Wikimedia Commons</span>
    </a>
    <div class="attraction-body">
      <div class="attraction-top"><span class="day-badge">${a.day}</span><span class="attraction-num">${String(i+1).padStart(2,'0')}</span></div>
      <h3>${a.zh}<small>${a.name}</small></h3>
      <p>${a.intro}</p>
      <div class="why-box"><b>為什麼我排它：</b>${a.why}</div>
      <div class="tagrow attraction-tags">${a.tags.map(t=>`<span>${t}</span>`).join('')}</div>
      <div class="attraction-actions">
        <a class="map-btn" href="${mapsUrl(a.map)}" target="_blank" rel="noopener">📍 Google Maps</a>
        <a class="official-btn" href="${a.official}" target="_blank" rel="noopener">Official ↗</a>
      </div>
    </div>
  </article>`).join('');
}

function makeChecklistInteractive(){
  const list=document.querySelector('.checklist');
  if(!list) return;
  const key='nyc-2026-pretrip-checklist-v1';
  let saved={};
  try{saved=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){saved={}}
  const items=[...list.querySelectorAll('li')];
  const progress=document.createElement('div');
  progress.className='check-progress';
  list.before(progress);
  items.forEach((li,i)=>{
    const text=li.textContent.trim();
    const id=`nyc-check-${i}`;
    li.innerHTML=`<label for="${id}"><input id="${id}" type="checkbox" ${saved[i]?'checked':''}><span>${text}</span></label>`;
    li.querySelector('input').addEventListener('change',e=>{
      saved[i]=e.target.checked;
      localStorage.setItem(key,JSON.stringify(saved));
      update();
    });
  });
  function update(){
    const done=items.filter((li,i)=>!!saved[i]).length;
    progress.innerHTML=`<div><b>${done}/${items.length}</b> 已完成</div><div class="progress-track"><span style="width:${items.length?done/items.length*100:0}%"></span></div><button type="button" class="reset-check">重設</button>`;
    progress.querySelector('.reset-check').onclick=()=>{
      saved={};localStorage.removeItem(key);
      items.forEach(li=>li.querySelector('input').checked=false);
      update();
    };
  }
  update();
}

const COMMUNITY_MUST_GO=[
  {rank:'01',title:'Central Park + The Met',tag:'最完整的城市＋文化組合',wiki:'Central_Park',copy:'第一次紐約我會一定保留。中央公園只走 Bethesda Terrace / The Lake / Bow Bridge 精華區，再把 2–3 小時留給 The Met，不追求把公園或博物館走完。',map:'Bethesda Terrace, Central Park, New York, NY'},
  {rank:'02',title:'Statue of Liberty + Ellis Island',tag:'最需要先預約',wiki:'Statue_of_Liberty',copy:'正式登島比遠遠拍照完整很多；Liberty Island 看地標，Ellis Island 補上紐約移民史。建議早場，下午接 Wall Street / 9/11。',map:'Statue of Liberty National Monument, New York, NY'},
  {rank:'03',title:'DUMBO + Brooklyn Bridge Park',tag:'最好拍、又不必太累',wiki:'Dumbo,_Brooklyn',copy:'從 LIC 搭 Ferry 過去特別順。Manhattan Bridge 街景、Brooklyn Bridge、河岸 skyline 一次收齊；媽媽累了不用硬走完整座橋。',map:'DUMBO, Brooklyn, NY'},
  {rank:'04',title:'9/11 Memorial + Oculus + Wall Street',tag:'Lower Manhattan 必排同一天',wiki:'National_September_11_Memorial_%26_Museum',copy:'自由女神回來後接這組最有效率。戶外 Memorial 本身就值得看，是否進 Museum 再看體力；Oculus 和金融區都在步行範圍。',map:'9/11 Memorial & Museum, New York, NY'},
  {rank:'05',title:'High Line + Chelsea + Hudson Yards',tag:'城市設計＋吃東西＋夕陽',wiki:'High_Line',copy:'這組路線自然、幾乎不用折返。High Line 南往北走，Chelsea Market 吃午餐，最後 Hudson Yards；若你選 Edge 就放在這一天。',map:'The High Line, New York, NY'},
  {rank:'06',title:'Broadway + Times Square at Night',tag:'真正有「來到紐約」的夜晚',wiki:'Broadway_theatre',copy:'Times Square 不用排半天，最佳玩法是先看一場 Broadway，散場後走去 Times Square 逛 30–45 分鐘，再搭 7 Train 回 LIC。',map:'Times Square, New York, NY'},
  {rank:'07',title:'Top of the Rock',tag:'三個觀景台只選一個',wiki:'30_Rockefeller_Plaza',copy:'我仍最偏向 Top of the Rock：向南能看 Empire State Building，向北能看 Central Park。SUMMIT 或 Edge 都很好，但沒有必要三個全買。',map:'Top of the Rock, New York, NY'},
  {rank:'08',title:'Grand Central Terminal',tag:'你們住 LIC 的零成本必看',wiki:'Grand_Central_Terminal',copy:'7 Train 幾站就到，幾乎不用為它增加交通成本。放在 Midtown 任一天前後都很順，也適合下雨時補進去。',map:'Grand Central Terminal, New York, NY'}
];

const PTT_THREADS=[
  {year:'2026',title:'中央公園＋自然史博物館實際遊記',board:'NewYork',wiki:'Central_Park',url:'https://www.ptt.cc/bbs/NewYork/M.1770951109.A.8E6.html',copy:'近期實際心得很有用：AMNH 館藏大到不可能一次看完，Central Park 也只走了一部分。最值得參考的是「不要貪心、挑重點逛」這件事，跟我們現在的媽媽友善排法一致。',use:'近期現場感／博物館＋公園體力評估'},
  {year:'2026',title:'總督島 Governors Island 遊記',board:'NewYork',wiki:'Governors_Island',url:'https://www.ptt.cc/bbs/NewYork/M.1771443190.A.3CB.html',copy:'近期台灣旅客的總督島實遊。它不是第一次紐約的 Must-Go，但如果主行程已完成、天氣很好，又想搭 Ferry 看紐約港，可以拿來替換半天。',use:'近期備案／Ferry／港灣景色'},
  {year:'2019',title:'紐約自助懶人包：七日行程規劃／景點地圖',board:'Ind-travel',wiki:'Manhattan',url:'https://www.ptt.cc/bbs/Ind-travel/M.1576074944.A.B75.html',copy:'最值得看的是分區方式與七日骨架：The Met＋Central Park、自由女神＋金融區、High Line＋Chelsea 等組合，現在仍然合理。舊票價與交通票制不要照抄。',use:'路線骨架／分區安排'},
  {year:'2018',title:'紐約自由行資訊：天氣、交通、行程安排',board:'Ind-travel',wiki:'Midtown_Manhattan',url:'https://www.ptt.cc/bbs/Ind-travel/M.1532965202.A.C05.html',copy:'很適合理解 Manhattan 的 Midtown / Downtown 分區，以及「住宿地點不同，動線就要跟著調整」。作者也直接提醒每天塞太滿會走到鐵腿。',use:'區域概念／體力提醒'},
  {year:'2017',title:'紐約行前準備篇',board:'NewYork',wiki:'New_York_City_Subway',url:'https://www.ptt.cc/bbs/NewYork/M.1512366246.A.7CB.html',copy:'適合看第一次自由行會遇到哪些問題：JFK、百老匯、Google Maps、餐廳與票券思路。但 ESTA 費用、MetroCard／交通與票價資訊都已過時，只看經驗、不看數字。',use:'行前問題清單／經驗型參考'}
];

const IG_GUIDES=[
  {handle:'@secret_nyc',title:'Secret NYC',type:'即時活動 / pop-up',wiki:'Times_Square',url:'https://www.instagram.com/secret_nyc/',copy:'最適合出發前 1–2 週再看一次。臨時展覽、季節活動、快閃、免費活動很多；不要拿它重排主行程，而是拿來補空檔。'},
  {handle:'@timeoutnewyork',title:'Time Out New York',type:'城市編輯推薦',wiki:'High_Line',url:'https://www.instagram.com/timeoutnewyork/',copy:'適合判斷「這個熱門點現在還值不值得去」以及近期展覽、表演、餐廳。比純打卡帳號更有編輯篩選。'},
  {handle:'@nyctourism',title:'NYC Tourism',type:'官方活動 / 五大 borough',wiki:'New_York_City',url:'https://www.instagram.com/nyctourism/',copy:'官方旅遊帳號，適合確認季節活動、borough-based ideas 與大型活動；資訊通常比網紅貼文更適合拿來確認是否真的存在。'},
  {handle:'@infatuationnyc',title:'The Infatuation NYC',type:'餐廳 / 吃什麼',wiki:'Chelsea_Market',url:'https://www.instagram.com/infatuationnyc/',copy:'吃的部分我最建議追這個。適合臨時找某區「現在吃哪間」，尤其 Chelsea、West Village、SoHo、Brooklyn 等行程日。'},
  {handle:'@newyorknico',title:'New York Nico',type:'在地人物 / 紐約文化',wiki:'Lower_East_Side',url:'https://www.instagram.com/newyorknico/',copy:'不是傳統旅遊攻略，而是看真正的紐約人物、店家和街區個性。想讓行程不要只剩地標打卡，這個很值得在出發前滑一輪。'}
];

const communityWikiImg=title=>`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;

function communityCardImage(title,alt){
  return `<div class="community-photo" data-community-wiki="${title}"><div class="community-placeholder">NYC</div><img alt="${alt}" loading="lazy"></div>`;
}

function renderCommunityGuide(){
  const events=document.querySelector('#events');
  if(!events || document.querySelector('#community')) return;
  const section=document.createElement('section');
  section.id='community';
  section.innerHTML=`<div class="wrap">
    <div class="kicker">Community consensus · PTT + Instagram</div>
    <h2>必去行程＋台灣旅客 PTT＋IG 即時情報</h2>
    <p class="sub">這區把「第一次紐約真正要留什麼」和社群資訊分開。Must-Go 用來守住主行程；PTT 看實際旅行經驗與動線；IG 則適合出發前補 2026 當週活動、美食與臨時靈感。</p>

    <div class="community-head"><h3>我會守住的 8 個 Must-Go</h3><span>不是熱門點越多越好，而是這 8 組最值得保留。</span></div>
    <div class="must-grid">${COMMUNITY_MUST_GO.map(x=>`<article class="community-card must-card">
      ${communityCardImage(x.wiki,x.title)}
      <div class="community-body"><div class="community-meta"><b>${x.rank}</b><span>${x.tag}</span></div><h3>${x.title}</h3><p>${x.copy}</p><a class="map-btn" href="${mapsUrl(x.map)}" target="_blank" rel="noopener">📍 Google Maps</a></div>
    </article>`).join('')}</div>

    <div class="community-head spaced"><h3>PTT 精選 threads</h3><span>舊文主要看動線與經驗；價格、票制、ESTA 與交通規則一律以 2026 官方資訊為準。</span></div>
    <div class="ptt-grid">${PTT_THREADS.map(x=>`<article class="community-card source-card">
      ${communityCardImage(x.wiki,x.title)}
      <div class="community-body"><div class="community-meta"><b>PTT · ${x.year}</b><span>${x.board}</span></div><h3>${x.title}</h3><p>${x.copy}</p><div class="source-use"><b>最值得看：</b>${x.use}</div><a class="source-link ptt-link" href="${x.url}" target="_blank" rel="noopener">開啟 PTT 原文 ↗</a></div>
    </article>`).join('')}</div>

    <div class="community-head spaced"><h3>IG 值得追</h3><span>把 IG 當「即時補充」而不是主行程來源；看到 Reel 想去，再回來看地理位置是否順路。</span></div>
    <div class="ig-grid">${IG_GUIDES.map(x=>`<article class="community-card source-card ig-card">
      ${communityCardImage(x.wiki,x.title)}
      <div class="community-body"><div class="community-meta"><b>${x.handle}</b><span>${x.type}</span></div><h3>${x.title}</h3><p>${x.copy}</p><a class="source-link ig-link" href="${x.url}" target="_blank" rel="noopener">Open Instagram ↗</a></div>
    </article>`).join('')}</div>

    <div class="community-search card"><b>IG 搜尋字建議</b><div class="tagrow"><span>NYC first time itinerary</span><span>DUMBO photo spots</span><span>Central Park fall NYC</span><span>High Line Chelsea</span><span>Top of the Rock sunset</span><span>Long Island City Gantry sunset</span><span>Flushing NYC food</span><span>NYC October 2026 events</span></div></div>
  </div>`;
  events.parentNode.insertBefore(section,events);

  const nav=document.querySelector('.nav .wrap');
  if(nav && !nav.querySelector('a[href="#community"]')){
    const a=document.createElement('a');a.href='#community';a.textContent='社群推薦';
    const eventsLink=nav.querySelector('a[href="#events"]');
    eventsLink?nav.insertBefore(a,eventsLink):nav.appendChild(a);
  }
  hydrateCommunityImages();
}

async function hydrateCommunityImages(){
  const nodes=[...document.querySelectorAll('[data-community-wiki]')];
  await Promise.all(nodes.map(async node=>{
    const title=node.dataset.communityWiki;
    const img=node.querySelector('img');
    const placeholder=node.querySelector('.community-placeholder');
    try{
      const r=await fetch(communityWikiImg(title),{headers:{Accept:'application/json'}});
      if(!r.ok)return;
      const d=await r.json();
      const src=d.originalimage?.source||d.thumbnail?.source;
      if(src){img.src=src;img.onload=()=>{img.classList.add('loaded');placeholder?.remove()};}
    }catch(e){}
  }));
}

function loadCommunityStyle(){
  if(document.querySelector('link[href="./community.css"]')) return;
  const link=document.createElement('link');link.rel='stylesheet';link.href='./community.css';document.head.appendChild(link);
}

renderAttractions();
makeChecklistInteractive();
loadCommunityStyle();
renderCommunityGuide();
