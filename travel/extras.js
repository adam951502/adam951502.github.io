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

const commonsImg = file => `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}?width=1200`;
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

renderAttractions();
makeChecklistInteractive();
