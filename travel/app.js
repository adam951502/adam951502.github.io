const trip=window.NYC_TRIP;
const richStyle=document.createElement('link');richStyle.rel='stylesheet';richStyle.href='./option-rich.css';document.head.appendChild(richStyle);

const mapsSearch=q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const mapBtn=(label,q)=>`<a class="timeline-map" href="${mapsSearch(q)}" target="_blank" rel="noopener">📍 ${label}</a>`;

const DAY_MAPS={
  oct3:[
    [{label:'LIC / Vernon Blvd',q:'Vernon Boulevard Long Island City NY'}],
    [{label:'Gantry Plaza',q:'Gantry Plaza State Park Long Island City NY'}],
    [{label:'Koreatown',q:'Koreatown Manhattan New York NY'}],
    [{label:'Parade start',q:'6th Avenue and West 38th Street New York NY'}],
    [{label:'Koreatown Festival',q:'West 32nd Street Koreatown New York NY'}],
    [{label:'Bryant Park',q:'Bryant Park New York NY'},{label:'Queens Night Market',q:'Queens Night Market Queens NY'}]
  ],
  oct4:[
    [{label:'Grand Central',q:'Grand Central Terminal New York NY'}],
    [{label:'Central Park',q:'Bethesda Terrace Central Park New York NY'}],
    [{label:'Upper East Side',q:'restaurants Upper East Side New York NY'}],
    [{label:'The Met',q:'The Metropolitan Museum of Art New York NY'}],
    [{label:'Rockefeller Center',q:'Rockefeller Center New York NY'},{label:"St. Patrick's",q:"St. Patrick's Cathedral New York NY"}],
    [{label:'Top of the Rock',q:'Top of the Rock New York NY'}]
  ],
  oct5:[
    [{label:'Hunters Point Ferry',q:'Hunters Point South Ferry Landing Queens NY'},{label:'Wall St Pier 11',q:'Wall Street Pier 11 New York NY'}],
    [{label:'Statue ferry',q:'Statue City Cruises Battery Park New York NY'}],
    [{label:'Stone Street',q:'Stone Street New York NY'}],
    [{label:'Wall Street',q:'Wall Street New York NY'},{label:'Charging Bull',q:'Charging Bull New York NY'}],
    [{label:'9/11 Memorial',q:'9/11 Memorial New York NY'}],
    [{label:'Oculus',q:'Oculus World Trade Center New York NY'},{label:'Brookfield Place',q:'Brookfield Place New York NY'}]
  ],
  oct6:[
    [{label:'Meatpacking District',q:'Meatpacking District New York NY'}],
    [{label:'High Line',q:'The High Line New York NY'}],
    [{label:'Chelsea Market',q:'Chelsea Market New York NY'}],
    [{label:'Little Island',q:'Little Island New York NY'},{label:'Whitney',q:'Whitney Museum of American Art New York NY'}],
    [{label:'Hudson Yards',q:'Hudson Yards New York NY'}],
    [{label:'Edge',q:'Edge NYC New York NY'}],
    [{label:'West Village',q:'West Village New York NY'}]
  ],
  oct7:[
    [{label:'DUMBO',q:'DUMBO Brooklyn NY'}],
    [{label:'Brooklyn Bridge Park',q:'Brooklyn Bridge Park New York NY'},{label:'Pebble Beach',q:'Pebble Beach Brooklyn Bridge Park NY'}],
    [{label:'Time Out Market',q:'Time Out Market New York NY'}],
    [{label:'Brooklyn Heights',q:'Brooklyn Heights Promenade Brooklyn NY'}],
    [{label:'Brooklyn Bridge',q:'Brooklyn Bridge Pedestrian Walkway New York NY'}],
    [{label:'SoHo',q:'SoHo Manhattan New York NY'},{label:'Chinatown',q:'Chinatown Manhattan New York NY'}]
  ],
  oct8:[
    [{label:'MoMA',q:'Museum of Modern Art New York NY'}],
    [{label:'Midtown food',q:'restaurants Midtown Manhattan New York NY'}],
    [{label:'Rockefeller Center',q:'Rockefeller Center New York NY'},{label:'Bryant Park',q:'Bryant Park New York NY'}],
    [{label:'Theater District',q:'Theater District New York NY'}],
    [{label:'Broadway',q:'Broadway Theatre District New York NY'}],
    [{label:'Javits Center',q:'Jacob K Javits Convention Center New York NY'}]
  ],
  oct9:[
    [{label:'AMNH',q:'American Museum of Natural History New York NY'}],
    [{label:'Upper West Side',q:'restaurants Upper West Side New York NY'}],
    [{label:'Lincoln Center',q:'Lincoln Center New York NY'},{label:'Columbus Circle',q:'Columbus Circle New York NY'}],
    [{label:'Lincoln Square',q:'Lincoln Square New York NY'}],
    [{label:'Film at Lincoln Center',q:'Film at Lincoln Center New York NY'}],
    [{label:'SoHo',q:'SoHo Manhattan New York NY'},{label:'Nolita',q:'Nolita Manhattan New York NY'}]
  ],
  oct10:[
    [{label:'LIC / Vernon Blvd',q:'Vernon Boulevard Long Island City NY'}],
    [{label:'Flushing Meadows',q:'Flushing Meadows Corona Park Queens NY'},{label:'Unisphere',q:'Unisphere Queens NY'},{label:'Flushing Main St',q:'Flushing Main Street Queens NY'}],
    [{label:'Gantry Plaza',q:'Gantry Plaza State Park Long Island City NY'}],
    [{label:'LIC dinner',q:'restaurants Vernon Boulevard Long Island City NY'}],
    [{label:'LIC pickup',q:'Vernon Boulevard Long Island City NY'}],
    [{label:'JFK Terminal 1',q:'JFK Airport Terminal 1 Queens NY'}],
    [{label:'JFK Terminal 1',q:'JFK Airport Terminal 1 Queens NY'}]
  ]
};

const tabs=document.querySelector('#dayTabs'),panel=document.querySelector('#dayPanel');
function renderDay(d){
  const maps=DAY_MAPS[d.id]||[];
  panel.innerHTML=`<article class="card daydetail"><div class="dayhero"><div><div class="datebig">${d.date} <small>週${d.dow}</small></div><h3>${d.title}</h3><p>${d.area}</p></div><span class="tone ${d.tone}">${d.tone}</span></div><div class="timeline">${d.core.map((x,i)=>`<div class="time"><b>${x[0]}</b><div class="timeline-copy"><span>${x[1]}</span>${maps[i]?.length?`<div class="timeline-maps">${maps[i].map(m=>mapBtn(m.label,m.q)).join('')}</div>`:''}</div></div>`).join('')}</div><div class="daynotes"><div class="food"><b>🍴 吃什麼</b><span>${d.food}</span></div><div class="mom"><b>👩‍👦 媽媽同行</b><span>${d.mom}</span></div><div class="optional"><b>↪ Optional / B plan</b><span>${d.optional}</span></div></div></article>`
}
tabs.innerHTML=trip.days.map((d,i)=>`<button class="tab ${i===0?'active':''}" data-id="${d.id}">${d.date}<small>週${d.dow}</small></button>`).join('');
tabs.addEventListener('click',e=>{const b=e.target.closest('.tab');if(!b)return;tabs.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderDay(trip.days.find(x=>x.id===b.dataset.id));});renderDay(trip.days[0]);

const OPTION_MEDIA={
'Grand Central Terminal':{wiki:'Grand_Central_Terminal',intro:'紐約最漂亮、也最實用的交通建築之一。主大廳、星空天花板與四面鐘很值得看，而且你們從 LIC 搭 7 Train 幾站就到。',map:'Grand Central Terminal, New York, NY',official:'https://www.grandcentralterminal.com/'},
'Times Square 夜景':{wiki:'Times_Square',intro:'第一次來紐約至少看一次夜景。真正值得的是巨型 LED、Broadway 劇院區與人潮形成的城市密度；不需要特別留半天。',map:'Times Square, New York, NY',official:'https://www.timessquarenyc.org/'},
'Top of the Rock':{wiki:'30_Rockefeller_Plaza',intro:'觀景台最大優勢是能正面看到 Empire State Building，向北又能看 Central Park。若只買一個傳統高樓觀景台，我最偏向這個。',map:'Top of the Rock, New York, NY',official:'https://www.rockefellercenter.com/attractions/top-of-the-rock-observation-deck/'},
'SUMMIT One Vanderbilt':{wiki:'One_Vanderbilt',intro:'結合鏡面、燈光與高空城市景觀的沉浸式觀景體驗。就在 Grand Central 旁，雨天或不想走太多路時特別好用。',map:'SUMMIT One Vanderbilt, New York, NY',official:'https://summitov.com/'},
'Edge':{wiki:'30_Hudson_Yards',intro:'Hudson Yards 的戶外懸挑觀景台，有玻璃地板與尖角平台。最適合和 High Line、Chelsea、Hudson Yards 排同一天。',map:'Edge NYC, New York, NY',official:'https://www.edgenyc.com/'},
'The Met':{wiki:'Metropolitan_Museum_of_Art',intro:'世界級綜合藝術博物館，埃及、歐洲繪畫、亞洲藝術都很強。不要全逛，抓 2–3 個館區就會舒服很多。',map:'The Metropolitan Museum of Art, New York, NY',official:'https://www.metmuseum.org/'},
'MoMA':{wiki:'Museum_of_Modern_Art',intro:'現代藝術經典館，梵谷、畢卡索、馬蒂斯、達利等代表作密度很高。比 The Met 更容易控制在 2–3 小時內。',map:'The Museum of Modern Art, New York, NY',official:'https://www.moma.org/'},
'AMNH':{wiki:'American_Museum_of_Natural_History',intro:'恐龍、海洋、宇宙與自然史主題非常完整，適合 Upper West Side 的文化日。館很大，先挑最想看的主題。',map:'American Museum of Natural History, New York, NY',official:'https://www.amnh.org/'},
'9/11 Museum':{wiki:'National_September_11_Memorial_%26_Museum',intro:'比戶外 Memorial 更深入理解 9/11 的人物、時間線與遺留物。內容情緒較重，但雨天時是 Lower Manhattan 很好的室內安排。',map:'9/11 Memorial & Museum, New York, NY',official:'https://www.911memorial.org/'},
'Roosevelt Island Tram':{wiki:'Roosevelt_Island_Tramway',intro:'幾分鐘就能跨 East River，在空中看 Midtown 與 Queensboro Bridge。時間成本低，很適合補行程空檔。',map:'Roosevelt Island Tramway, New York, NY',official:'https://www.rioc.ny.gov/302/Tram'},
'Gantry Plaza State Park':{wiki:'Gantry_Plaza_State_Park',intro:'你們 LIC 住宿基地附近最實用的免費景點。河岸正對 Midtown skyline，日落、夜景都很漂亮，累了也能隨時回去。',map:'Gantry Plaza State Park, Long Island City, NY',official:'https://parks.ny.gov/parks/gantryplaza'},
'NYC Ferry East River':{wiki:'NYC_Ferry',intro:'把交通本身變成 sightseeing。從 Hunters Point South 前往 DUMBO、Wall Street 或 East 34th St 時尤其適合，能少轉乘又看 skyline。',map:'Hunters Point South Ferry Landing, Queens, NY',official:'https://www.ferry.nyc/routes-and-schedules/east-river/'},
'Flushing 美食半日':{wiki:'Flushing,_Queens',intro:'法拉盛是紐約最值得專程吃東西的亞洲街區之一，華人、台灣、韓國與東北菜都很密集；而且 7 Train 從 LIC 直達。',map:'Flushing Main Street, Queens, NY'},
'Queens Night Market':{wiki:'Flushing_Meadows%E2%80%93Corona_Park',intro:'週六晚在 Flushing Meadows–Corona Park 的大型國際小吃市集。攤商多、價格相對友善，很適合用吃東西認識 Queens 的多元文化。',map:'Queens Night Market, Queens, NY',official:'https://queensnightmarket.com/'},
'Korean Parade & Festival':{wiki:'Koreatown,_Manhattan',intro:'你們 10/3 剛好遇到 Korean Parade 與 Koreatown Festival。它不是常態景點，而是這趟才有的限定街區體驗。',map:'Koreatown, Manhattan, New York, NY',official:'https://kaagny.org/'},
'New York Film Festival':{wiki:'New_York_Film_Festival',intro:'Lincoln Center 的代表性電影節，2026 年檔期和你們整趟旅程重疊。若有喜歡的導演或首映，是很有「人在紐約」感的夜間活動。',map:'Film at Lincoln Center, New York, NY',official:'https://www.filmlinc.org/nyff/'},
'New York Comic Con':{wiki:'New_York_Comic_Con',intro:'Javits Center 的大型動漫與流行文化展。內容豐富但人潮與排隊強度都高，只有真的有興趣才值得把一整天換給它。',map:'Jacob K. Javits Convention Center, New York, NY',official:'https://www.newyorkcomiccon.com/'},
'NYBG Día de los Muertos':{wiki:'New_York_Botanical_Garden',intro:'Bronx 的大型植物園，2026 秋季又有 Día de los Muertos 主題活動。想把博物館日換成更鬆、更有季節感的一天，很適合。',map:'New York Botanical Garden, Bronx, NY',official:'https://www.nybg.org/event/dia-de-los-muertos/'},
'Brooklyn Bridge walk':{wiki:'Brooklyn_Bridge',intro:'經典紐約步行體驗，但體力成本不低。若要走，從 Brooklyn 往 Manhattan 方向景觀最直覺；媽媽累了就在 DUMBO 看橋即可。',map:'Brooklyn Bridge Pedestrian Walkway, New York, NY',official:'https://www.nyc.gov/html/dot/html/infrastructure/brooklyn-bridge.shtml'},
'SoHo / Nolita / Chinatown':{wiki:'SoHo,_Manhattan',intro:'逛街、咖啡、建築與中餐都能自由混搭的區域型備案。最適合拿來填補半天自由時間，不需要硬排固定門票。',map:'SoHo, Manhattan, New York, NY'}
};

const cats=['全部',...new Set(trip.options.map(x=>x.cat))],filters=document.querySelector('#optionFilters'),grid=document.querySelector('#optionGrid');
filters.innerHTML=cats.map((c,i)=>`<button class="tab ${i===0?'active':''}" data-cat="${c}">${c}</button>`).join('');
function dots(n){return `<span class="dots">${'●'.repeat(n)}${'○'.repeat(5-n)}</span>`}
const optionMapsUrl=q=>mapsSearch(q);
const wikiPage=t=>`https://en.wikipedia.org/wiki/${t}`;
function renderOptions(cat='全部'){
  const list=cat==='全部'?trip.options:trip.options.filter(x=>x.cat===cat);
  grid.innerHTML=list.map(o=>{const m=OPTION_MEDIA[o.name]||{};return `<article class="card option option-rich" data-wiki="${m.wiki||''}">
    <a class="option-photo" href="${m.wiki?wikiPage(m.wiki):optionMapsUrl(m.map||o.name)}" target="_blank" rel="noopener">
      <div class="option-photo-placeholder">NYC</div><img alt="${o.name}" loading="lazy" decoding="async"><span>Photo · Wikipedia / Wikimedia</span>
    </a>
    <div class="option-content">
      <div class="optop"><span class="badge">${o.cat}</span><h3>${o.name}</h3></div>
      <p class="option-intro">${m.intro||o.note}</p>
      <p class="option-note"><b>行程定位：</b>${o.note}</p>
      <div class="meters"><div><span>體力友善</span>${dots(6-o.effort)}</div><div><span>雨天友善</span>${dots(o.indoor)}</div><div><span>媽媽友善</span>${dots(o.mom)}</div></div>
      <div class="option-actions"><a class="map-btn" href="${optionMapsUrl(m.map||o.name+', New York, NY')}" target="_blank" rel="noopener">📍 Google Maps</a>${m.official?`<a class="official-btn" href="${m.official}" target="_blank" rel="noopener">Official ↗</a>`:''}</div>
    </div>
  </article>`}).join('');
  hydrateOptionImages();
}
async function hydrateOptionImages(){
  const cards=[...grid.querySelectorAll('.option-rich[data-wiki]')];
  await Promise.all(cards.map(async card=>{
    const title=card.dataset.wiki;if(!title)return;
    const img=card.querySelector('img'),placeholder=card.querySelector('.option-photo-placeholder');
    try{
      const r=await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,{headers:{Accept:'application/json'}});
      if(!r.ok)return;
      const d=await r.json();
      // Important: use the original Wikimedia file first. The former thumbnail-first
      // logic was the reason photos looked soft when stretched across desktop cards.
      const src=d.originalimage?.source||d.thumbnail?.source;
      if(src){img.src=src;img.onload=()=>{img.classList.add('loaded');placeholder?.remove()};}
    }catch(e){}
  }));
}
filters.addEventListener('click',e=>{const b=e.target.closest('.tab');if(!b)return;filters.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderOptions(b.dataset.cat)});renderOptions();
