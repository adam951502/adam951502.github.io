const VISITED_SPOTS=window.NYC_SPOTS||[];

const HERO_IMAGES=[
  ["Statue_of_Liberty","Liberty Island"],
  ["Bear_Mountain_State_Park","Hudson autumn"],
  ["High_Line","West Side"],
  ["Brooklyn_Bridge","Brooklyn"],
  ["30_Rockefeller_Plaza","Midtown"],
  ["Central_Park","Central Park"]
];

const JOURNAL_DAYS=[
  {date:"10/02",title:"Hello, New York",wiki:"John_F._Kennedy_International_Airport",text:"深夜抵達 JFK，直接 Uber 進 Long Island City。"},
  {date:"10/03",title:"Tram to Midtown",wiki:"Roosevelt_Island_Tramway",text:"Roosevelt Island Tram 開場，接 Fifth Avenue、Grand Central 與 Times Square。"},
  {date:"10/04",title:"Hudson in Fall",wiki:"Bear_Mountain_State_Park",text:"搭船離開 Manhattan，一整天追 Hudson River 秋色。"},
  {date:"10/05",title:"A Family Milestone",wiki:"New_York_Public_Library_Main_Branch",text:"Bar Admission Ceremony 後，走 NYPL、Vessel 與 Edge。"},
  {date:"10/06",title:"Road Trip North",wiki:"Woodbury_Common_Premium_Outlets",text:"租車離開市區，把 Woodbury 完整留成一個購物日。"},
  {date:"10/07",title:"West Side to Broadway",wiki:"High_Line",text:"Chelsea、Little Island、High Line、Hudson Yards，一路走到 Broadway。"},
  {date:"10/08",title:"Liberty to Brooklyn",wiki:"Statue_of_Liberty",text:"登自由女神基座，再從 Financial District 一路走進 DUMBO。"},
  {date:"10/09",title:"Downtown to Skyline",wiki:"30_Rockefeller_Plaza",text:"Chinatown、Washington Square，最後用 Top of the Rock 收夕陽。"},
  {date:"10/10",title:"A Slow Goodbye",wiki:"Central_Park",text:"最後一天只留下 Central Park picnic、晚餐與前往 JFK。"}
];

const BEST_MOMENTS=[
  {
    kicker:"DAY 2 · FIRST WOW",
    title:"搭纜車飛進 Manhattan skyline",
    wiki:["Roosevelt_Island_Tramway","Queensboro_Bridge"],
    copy:"第一個完整觀光日沒有急著衝博物館，而是先搭 Roosevelt Island Tram。纜車升空的幾分鐘裡，East River、Queensboro Bridge 和 Midtown 一起出現在窗外，會有很明確的『真的到紐約了』感。",
    why:"適合第一天：刺激度夠，但體力成本很低。"
  },
  {
    kicker:"DAY 3 · AUTUMN ESCAPE",
    title:"早上還在 Manhattan，下午已經在 Hudson 秋色裡",
    wiki:["Bear_Mountain_State_Park","Hudson_River"],
    copy:"Seastreak 從 Lower Manhattan 往北開，城市慢慢變成河谷和山景。下船後再走進 Bear Mountain，看秋天的樹色和 Hudson River，這一天讓整趟旅行不只剩下高樓與街景。",
    why:"最有季節限定感的一天，也是城市與自然反差最大的一天。"
  },
  {
    kicker:"DAY 4 · FAMILY MEMORY",
    title:"一個只有這趟旅行才會有的家庭時刻",
    wiki:["New_York_Public_Library_Main_Branch","30_Hudson_Yards"],
    copy:"Bar Admission Ceremony 是很私人、很難複製的旅行記憶。典禮結束後沒有把整天留白，而是繼續走 NYPL、Vessel、Edge，讓家庭的重要時刻和紐約城市景觀接在一起。",
    why:"旅行最好玩的地方，有時不是最熱門的景點，而是只有你們會記得的那一天。"
  },
  {
    kicker:"DAY 6 · PERFECT NYC DAY",
    title:"咖啡、High Line、Hudson Yards，最後直接進 Broadway",
    wiki:["High_Line","Lyric_Theatre_(1998_New_York_City)"],
    copy:"從 Starbucks Reserve、Chelsea Market、Little Island 開始，一路沿 High Line 向北走，經過 Hudson Yards 和 Moynihan，晚上直接坐進 Lyric Theatre 看 Harry Potter。這種從白天走到夜晚、每一段都不同的節奏，是整趟最完整的一天。",
    why:"如果朋友只想抄一天行程，這天最值得直接複製。"
  },
  {
    kicker:"DAY 7 · ICONIC NEW YORK",
    title:"真的站上自由女神基座，再一路走到 Brooklyn",
    wiki:["Statue_of_Liberty","Dumbo,_Brooklyn"],
    copy:"早上搭官方 ferry 登 Liberty Island，而且不是只在外面拍照，而是真的進 Pedestal。回到 Manhattan 後走 Wall Street，再跨到 Brooklyn Bridge、DUMBO，經典紐約在同一天連成一條線。",
    why:"最累的一天，也是最有『第一次紐約全部收進來』感的一天。"
  },
  {
    kicker:"DAY 8 · BEST SUNSET",
    title:"看著 Empire State Building 從夕陽亮到夜景",
    wiki:["30_Rockefeller_Plaza","Empire_State_Building"],
    copy:"Top of the Rock 特別選在日落前入場。城市從白天、金色夕陽、blue hour 一路變成夜景，Empire State Building 一直都在正前方。不是單純上去拍一張照，而是坐著看整座城市慢慢亮起來。",
    why:"這是最適合當旅行 ending montage 的畫面。"
  }
];

const BOOKINGS=[
  {title:"Bear Mountain Fall Foliage Cruise",when:"季節限定 · 建議提前訂",level:"book",text:"Seastreak 的秋季一日航程從 Manhattan 沿 Hudson River 到 Bear Mountain。週末班次是完整全日行程，碼頭上山路段有明顯坡度。",link:"https://seastreak.com/tour-and-event-cruises/fall-foliage-cruise-to-bear-mountain/",label:"Seastreak Official"},
  {title:"Statue of Liberty · Pedestal Access",when:"強烈建議提前訂",level:"book",text:"Pedestal Access 名額有限；官方 ferry 請走 Statue City Cruises。基座票能進入 pedestal 內部與觀景層，和一般登島體驗不同。",link:"https://statuecitycruises.com/tickets/",label:"Statue City Cruises"},
  {title:"Edge NYC",when:"日落時段建議先鎖",level:"book",text:"Edge 位於 30 Hudson Yards，使用 timed entry。若目標是日落與夜景，先選好時間可以避免當天只剩不理想時段。",link:"https://www.edgenyc.com/",label:"Edge Official"},
  {title:"Top of the Rock",when:"日落時段建議先鎖",level:"book",text:"Top of the Rock 一般 Timed Admission 就足夠；日落前 60–90 分鐘入場可以一路看到 blue hour 與夜景。",link:"https://www.rockefellercenter.com/tickets/top-of-the-rock-observation-deck",label:"Rockefeller Center"},
  {title:"Harry Potter and the Cursed Child",when:"熱門日期提前買",level:"book",text:"Lyric Theatre 的 Broadway 演出。若劇目是行程核心，先買票再安排同日 West Side / Midtown 動線會比較安心。",link:"https://broadway.harrypottertheplay.com/",label:"Official Broadway Site"},
  {title:"Roosevelt Island Tram",when:"不用預約",level:"walkin",text:"直接現場搭乘即可；RIOC 官方列為標準 MTA fare，支援 OMNY tap-to-pay。很適合當臨時加入的景觀交通。",link:"https://www.rioc.ny.gov/community/transportation/tram",label:"RIOC Official"}
];

const SPECIALS=[
  ["10/03","Louis Vuitton Fifth Avenue personalization","Fifth Avenue 購物之外，加入客製燙印讓紀念品更有旅行記憶。","Louis Vuitton 6 E 57th St New York NY"],
  ["10/05","New York Attorney Bar Admission Ceremony","私人家庭行程。對一般旅客，可用 Bryant Park＋NYPL 取代上午時段，再接 Hudson Yards。","New York Public Library New York NY"],
  ["10/06","Avis rental car → Woodbury Common","把 outlet 完整切成自駕一日，適合購物量大或多人同行。","Woodbury Common Premium Outlets Central Valley NY"],
  ["10/10","Central Park picnic","最後一天不追景點數量，留一段真正坐下來的公園時間。","Central Park New York NY"]
];

const FOOD_DAYS=[
  ["10/03",["Utopia Bagel","The Grey Dog"]],
  ["10/04",["Paris Baguette","麻辣串串"]],
  ["10/05",["Apollo Bagels","Jollibee"]],
  ["10/06",["Utopia Bagel","Shake Shack"]],
  ["10/07",["Los Tacos No. 1","Blue Bottle Coffee","Joe's Pizza","The Halal Guys"]],
  ["10/08",["Ess-a-Bagel","Los Tacos No. 1","王記魚丸店"]],
  ["10/09",["787 Coffee","La Colombe Coffee","The Halal Guys"]],
  ["10/10",["Central Park picnic","Family dinner"]]
];

const journalMapsSearch=q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const wikiThumb=(title,size=1200)=>`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&origin=*&piprop=thumbnail&pithumbsize=${size}&titles=${encodeURIComponent(title)}`;

async function resolveWikiImage(title,size=1400){
  try{
    const r=await fetch(wikiThumb(title,size));
    if(!r.ok)return "";
    const d=await r.json();
    const p=Object.values(d.query?.pages||{})[0];
    return p?.thumbnail?.source||"";
  }catch(e){return ""}
}

async function renderHeroGallery(){
  const box=document.querySelector("#heroGallery");
  if(!box)return;
  box.innerHTML=HERO_IMAGES.map((x,i)=>`<figure class="hero-photo hero-photo-${i+1}"><div class="photo-placeholder">NYC</div><img alt="${x[1]}" loading="${i<2?"eager":"lazy"}"><figcaption>${x[1]}</figcaption></figure>`).join("");
  const imgs=[...box.querySelectorAll("img")];
  await Promise.all(imgs.map(async(img,i)=>{
    const src=await resolveWikiImage(HERO_IMAGES[i][0],1600);
    if(src){img.src=src;img.onload=()=>{img.classList.add("loaded");img.previousElementSibling?.remove();};}
  }));
}

async function renderJournalStrip(){
  const box=document.querySelector("#journalStrip");
  if(!box)return;
  box.innerHTML=JOURNAL_DAYS.map((x,i)=>`<article class="journal-card">
    <div class="journal-photo"><div class="photo-placeholder">0${i+1}</div><img alt="${x.title}" loading="lazy"></div>
    <div class="journal-copy"><span>${x.date}</span><h3>${x.title}</h3><p>${x.text}</p></div>
  </article>`).join("");
  const imgs=[...box.querySelectorAll("img")];
  await Promise.all(imgs.map(async(img,i)=>{
    const src=await resolveWikiImage(JOURNAL_DAYS[i].wiki,1000);
    if(src){img.src=src;img.onload=()=>{img.classList.add("loaded");img.previousElementSibling?.remove();};}
  }));
}

function spotCard(x){
  const images=x.wiki.slice(0,3).map(w=>`<div class="visited-shot"><div class="visited-placeholder">NYC</div><img data-wiki="${w}" alt="${x.title}" loading="lazy"></div>`).join("");
  return `<article class="visited-card" data-cat="${x.cat}">
    <div class="visited-media ${x.wiki.length>=3?"triple":x.wiki.length>1?"double":""}">${images}</div>
    <div class="visited-body">
      <div class="visited-meta"><span>${x.day}</span><b>${x.cat}</b></div>
      <h3>${x.title}<small>${x.en}</small></h3>
      <p>${x.intro}</p>
      <div class="visited-tip"><b>實際心得：</b>${x.tip}</div>
      <div class="visited-actions">
        <a href="${journalMapsSearch(x.map)}" target="_blank" rel="noopener">📍 Google Maps</a>
        <a href="${x.official}" target="_blank" rel="noopener">Official ↗</a>
      </div>
    </div>
  </article>`;
}

function renderVisited(){
  const grid=document.querySelector("#attractionGrid");
  const filters=document.querySelector("#visitedFilters");
  if(!grid)return;
  const cats=["全部",...new Set(VISITED_SPOTS.map(x=>x.cat))];
  const renderCards=cat=>{
    const rows=cat==="全部"?VISITED_SPOTS:VISITED_SPOTS.filter(x=>x.cat===cat);
    grid.innerHTML=rows.map(spotCard).join("");
    hydrateVisitedImages();
  };
  if(filters){
    filters.innerHTML=cats.map((x,i)=>`<button class="tab ${i===0?"active":""}" data-cat="${x}">${x}</button>`).join("");
    filters.addEventListener("click",e=>{
      const b=e.target.closest(".tab"); if(!b)return;
      filters.querySelectorAll(".tab").forEach(x=>x.classList.remove("active")); b.classList.add("active");
      renderCards(b.dataset.cat);
    });
  }
  renderCards("全部");
}

async function hydrateVisitedImages(){
  const imgs=[...document.querySelectorAll(".visited-shot img[data-wiki]")];
  await Promise.all(imgs.map(async img=>{
    let src=await resolveWikiImage(img.dataset.wiki,1200);
    if(!src)src=await resolveWikiImage("New_York_City",1200);
    if(src){
      img.src=src;
      img.onload=()=>{img.classList.add("loaded");img.previousElementSibling?.remove();};
    }
  }));
}

function momentCard(x,i){
  return `<article class="moment-card ${i===0||i===3?"wide":""}">
    <div class="moment-media">
      ${x.wiki.map((w,j)=>`<div class="moment-shot"><div class="photo-placeholder">NYC</div><img data-wiki="${w}" alt="${x.title}" loading="lazy"></div>`).join("")}
    </div>
    <div class="moment-copy">
      <span>${x.kicker}</span>
      <h3>${x.title}</h3>
      <p>${x.copy}</p>
      <div class="moment-why">✨ ${x.why}</div>
    </div>
  </article>`;
}

function renderMoments(){
  const box=document.querySelector("#momentsGrid"); if(!box)return;
  box.innerHTML=BEST_MOMENTS.map(momentCard).join("");
  const imgs=[...box.querySelectorAll(".moment-shot img[data-wiki]")];
  Promise.all(imgs.map(async img=>{
    const src=await resolveWikiImage(img.dataset.wiki,1400);
    if(src){img.src=src;img.onload=()=>{img.classList.add("loaded");img.previousElementSibling?.remove();};}
  }));
}

function renderBookings(){
  const box=document.querySelector("#bookingGrid"); if(!box)return;
  box.innerHTML=BOOKINGS.map(x=>`<article class="booking-card ${x.level}">
    <div class="booking-top"><span>${x.when}</span><b>${x.level==="book"?"需規劃":"Walk-in"}</b></div>
    <h3>${x.title}</h3>
    <p>${x.text}</p>
    <a href="${x.link}" target="_blank" rel="noopener">${x.label} ↗</a>
  </article>`).join("");
}

function renderSpecials(){
  const box=document.querySelector("#specialGrid"); if(!box)return;
  box.innerHTML=SPECIALS.map(x=>`<article class="special-card card">
    <span>${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p>
    <a href="${journalMapsSearch(x[3])}" target="_blank" rel="noopener">📍 Maps</a>
  </article>`).join("");
}

function renderFood(){
  const box=document.querySelector("#foodGrid"); if(!box)return;
  box.innerHTML=FOOD_DAYS.map(([day,items])=>`<article class="food-day card">
    <div class="food-day-date">${day}</div>
    <div class="food-chip-list">${items.map(name=>`<a href="${journalMapsSearch(name+" New York NY")}" target="_blank" rel="noopener">${name}<span>↗</span></a>`).join("")}</div>
  </article>`).join("");
}

renderHeroGallery();
renderJournalStrip();
renderMoments();
renderVisited();
renderBookings();
renderSpecials();
renderFood();