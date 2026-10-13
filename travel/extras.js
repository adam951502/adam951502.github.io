const VISITED_SPOTS=[
  {
    title:"Roosevelt Island Tram",en:"Roosevelt Island Aerial Tramway",day:"10/03",cat:"景觀",
    wiki:["Roosevelt_Island_Tramway","Roosevelt_Island"],
    intro:"從 Manhattan 東側跨越 East River 到 Roosevelt Island 的空中纜車，是少數能把日常大眾運輸直接變成觀景體驗的紐約交通工具。車廂沿 Queensboro Bridge 南側升高，幾分鐘內就能看到 Midtown、East River 與島岸。",
    tip:"很適合放在第一天或 Midtown 行程前後；不需要特別預約，直接當成一段交通搭乘。",
    map:"Roosevelt Island Tramway New York NY",official:"https://www.rioc.ny.gov/community/transportation/tram"
  },
  {
    title:"Grand Central Terminal",en:"Grand Central",day:"10/03",cat:"建築",
    wiki:["Grand_Central_Terminal"],
    intro:"Grand Central 不只是車站，主大廳的星空天花板、四面鐘與 Beaux-Arts 空間本身就是一個完整景點。從 Long Island City 搭 7 Train 過來尤其順路。",
    tip:"不用特別排很久；30–60 分鐘就足以看主大廳、中央時計與周邊建築。",
    map:"Grand Central Terminal New York NY",official:"https://www.grandcentralterminal.com/"
  },
  {
    title:"Rockefeller Center＋St. Patrick's Cathedral",en:"Fifth Avenue Midtown",day:"10/03",cat:"經典",
    wiki:["Rockefeller_Center","St._Patrick%27s_Cathedral_(Midtown_Manhattan)"],
    intro:"這組合是 Fifth Avenue 最有效率的經典散步：Rockefeller Center 的 Art Deco 城市尺度，正對面就是哥德復興式的 St. Patrick's Cathedral，兩種紐約建築語言只隔一條街。",
    tip:"可和 Fifth Avenue、Trump Tower、Top of the Rock 一次排在同一區。",
    map:"Rockefeller Center New York NY",official:"https://www.rockefellercenter.com/"
  },
  {
    title:"Times Square＋Broadway District",en:"Theater District",day:"10/03 & 10/07",cat:"經典",
    wiki:["Times_Square","Broadway_theatre"],
    intro:"Times Square 最適合放在晚上：大型 LED、劇院招牌與人流把 Broadway Theater District 的能量集中在幾個街區。單獨來看 30–60 分鐘就夠，搭配看一場 Broadway 會完整很多。",
    tip:"不必特別把白天行程浪費在 Times Square；夜間或散場後順路最有感。",
    map:"Times Square New York NY",official:"https://www.timessquarenyc.org/"
  },
  {
    title:"Bear Mountain Fall Foliage Cruise",en:"Hudson River Autumn Day Trip",day:"10/04",cat:"戶外",
    wiki:["Bear_Mountain_State_Park","Hudson_River"],
    intro:"從 Lower Manhattan 搭 Seastreak 沿 Hudson River 北上，在 Bear Mountain 下船停留數小時。秋天沿岸樹色、河谷與山景會一路變化，是很不一樣的紐約近郊一日體驗。",
    tip:"這不是純遊船：Bear Mountain 碼頭進公園要走一段上坡，鞋子要好走，整天也要保留足夠體力。",
    map:"Bear Mountain State Park New York",official:"https://seastreak.com/tour-and-event-cruises/fall-foliage-cruise-to-bear-mountain/"
  },
  {
    title:"New York Public Library",en:"Stephen A. Schwarzman Building",day:"10/05",cat:"建築",
    wiki:["New_York_Public_Library_Main_Branch"],
    intro:"第五大道 42 街的 NYPL 主館是免費又很值得看的室內建築景點。除了石獅與外觀，Astor Hall、McGraw Rotunda、Rose Main Reading Room 周邊與常設展覽都能感受到一座研究圖書館的尺度。",
    tip:"和 Bryant Park 幾乎是同一站，適合作為 Midtown 行程中的免費室內休息點。",
    map:"New York Public Library Stephen A Schwarzman Building",official:"https://www.nypl.org/spotlight/schwarzman-plan-your-visit"
  },
  {
    title:"Vessel＋Edge",en:"Hudson Yards",day:"10/05",cat:"景觀",
    wiki:["Vessel_(structure)","30_Hudson_Yards"],
    intro:"Hudson Yards 可以一次看兩種新紐約：Vessel 是 Thomas Heatherwick 設計的可步行雕塑式地標；Edge 則從 30 Hudson Yards 高空伸出戶外平台，玻璃地板和西側河景特別有辨識度。",
    tip:"傍晚來最划算：先看 Vessel，再把 Edge 的時段壓在日落前後。",
    map:"Hudson Yards New York NY",official:"https://www.hudsonyardsnewyork.com/discover"
  },
  {
    title:"Woodbury Common Premium Outlets",en:"Central Valley Day Trip",day:"10/06",cat:"購物",
    wiki:["Woodbury_Common_Premium_Outlets"],
    intro:"Woodbury Common 是紐約近郊大型 outlet shopping destination，品牌數量非常多，適合把購物需求一次集中處理。自駕最大的好處是購物袋可以直接放車上，不用整天提著走。",
    tip:"如果購物是主要目的，直接留一整天比硬塞回 Manhattan 景點更舒服。",
    map:"Woodbury Common Premium Outlets 498 Red Apple Ct Central Valley NY",official:"https://www.premiumoutlets.com/outlet/woodbury-common"
  },
  {
    title:"Starbucks Reserve Roastery New York",en:"Meatpacking District",day:"10/07",cat:"咖啡",
    wiki:["Starbucks_Reserve","Meatpacking_District,_Manhattan"],
    intro:"New York Roastery 是 Starbucks Reserve 最高規格的大型體驗店之一，把咖啡烘焙、吧台、特調、餐飲與零售放在同一個巨大空間。位置就在 Meatpacking District，接 Chelsea Market 很自然。",
    tip:"把它當景點而不是一般咖啡店；早上來人相對比較好控制，也方便直接開始 West Side 一日步行。",
    map:"Starbucks Reserve Roastery New York 61 9th Ave",official:"https://www.starbucksreserve.com/locations/new-york-roastery"
  },
  {
    title:"Chelsea Market",en:"Food Hall & Historic Market",day:"10/07",cat:"美食",
    wiki:["Chelsea_Market"],
    intro:"Chelsea Market 把舊 National Biscuit Company 工業建築變成室內美食與零售市場，紅磚、管線與舊工業空間本身就很好看。餐飲選擇密集，很適合當 High Line 前的午餐基地。",
    tip:"不要只把它當『吃飯的地方』；室內建築與 Meatpacking 周邊街景值得一起看。",
    map:"Chelsea Market New York NY",official:"https://www.chelseamarket.com/"
  },
  {
    title:"Little Island",en:"Hudson River Park",day:"10/07",cat:"戶外",
    wiki:["Little_Island_at_Pier_55"],
    intro:"Little Island 建在 Hudson River 上的花瓣狀混凝土柱群之上，兩英畝多的公園把花園、步道、表演空間與河景濃縮在一座人工小島裡。它所在的 Pier 54 還連著紐約很長的港口歷史。",
    tip:"免費、面積不大，安排 30–60 分鐘很剛好；和 Chelsea Market、High Line 是同一條線。",
    map:"Little Island New York NY",official:"https://littleisland.org/"
  },
  {
    title:"The High Line",en:"Elevated Rail Park",day:"10/07",cat:"戶外",
    wiki:["High_Line"],
    intro:"High Line 是由 1930 年代高架貨運鐵路改造而成的線性公園，保留舊鐵軌、工業痕跡與大量城市植栽。它把 Chelsea、Meatpacking、Hudson Yards 串成一條非常直覺的步行軸線。",
    tip:"最有效率的走法是單向前進，不要來回；南端接 Chelsea Market，北端直接到 Hudson Yards。",
    map:"The High Line New York NY",official:"https://www.thehighline.org/"
  },
  {
    title:"Moynihan Train Hall",en:"Penn Station / Farley Building",day:"10/07",cat:"建築",
    wiki:["Moynihan_Train_Hall"],
    intro:"Moynihan Train Hall 把歷史悠久的 Farley Post Office 改造成 Amtrak 與 LIRR 的現代車站，大跨度天窗讓候車大廳和傳統 Penn Station 的地下感完全不同。",
    tip:"如果剛走完 Hudson Yards，可以沿 High Line–Moynihan Connector 接過來，順便休息、吃東西再去 Theater District。",
    map:"Moynihan Train Hall New York NY",official:"https://moynihantrainhall.nyc/"
  },
  {
    title:"Harry Potter and the Cursed Child",en:"Lyric Theatre · Broadway",day:"10/07",cat:"表演",
    wiki:["Lyric_Theatre_(1998_New_York_City)","Harry_Potter_and_the_Cursed_Child"],
    intro:"《Harry Potter and the Cursed Child》在 Broadway 的 Lyric Theatre 演出。除了舞台本身，劇院也把魔法世界延伸到大廳、主題餐飲、商品與互動細節，適合把整晚都當成完整體驗。",
    tip:"熱門日期提前買票；Lyric Theatre 在 43rd St，散場後直接接 Times Square 最順。",
    map:"Lyric Theatre 214 W 43rd St New York NY",official:"https://broadway.harrypottertheplay.com/"
  },
  {
    title:"Statue of Liberty · Pedestal",en:"Liberty Island",day:"10/08",cat:"經典",
    wiki:["Statue_of_Liberty","Ellis_Island"],
    intro:"實際登島和只在岸上拍照差很多。Pedestal Access 可以進入自由女神基座並從較高的位置看 New York Harbor；同一套官方 ferry 行程也能串 Ellis Island。",
    tip:"一定從 Statue City Cruises 官方渠道處理船票與 Pedestal Access；Battery Park 周邊不要被非官方街頭售票帶走。",
    map:"Statue City Cruises Battery Park New York NY",official:"https://statuecitycruises.com/tickets/"
  },
  {
    title:"Financial District",en:"Charging Bull · NYSE · Fearless Girl",day:"10/08",cat:"經典",
    wiki:["New_York_Stock_Exchange","Charging_Bull","Fearless_Girl"],
    intro:"Lower Manhattan 幾個代表性符號彼此步行距離很短：Charging Bull、Wall Street、New York Stock Exchange 與正對 NYSE 的 Fearless Girl，可以在一個小時左右完成一組很有金融紐約辨識度的散步。",
    tip:"自由女神回 Battery Park 後直接往北走，不需要另外為這幾個點安排半天。",
    map:"New York Stock Exchange New York NY",official:"https://www.fearlessgirl.com/visit/"
  },
  {
    title:"One World Trade Center",en:"World Trade Center",day:"10/08",cat:"建築",
    wiki:["One_World_Trade_Center"],
    intro:"One World Trade Center 是 Lower Manhattan 天際線最清楚的定位點。即使不登 One World Observatory，從 Oculus、9/11 Memorial、Brookfield Place 一帶步行看建築與廣場也很完整。",
    tip:"和 Financial District、Battery Park 放同一天最合理，不需要額外跨區。",
    map:"One World Trade Center New York NY",official:"https://www.oneworldobservatory.com/"
  },
  {
    title:"Brooklyn Bridge＋DUMBO",en:"Brooklyn Waterfront",day:"10/08",cat:"經典",
    wiki:["Brooklyn_Bridge","Dumbo,_Brooklyn"],
    intro:"Brooklyn Bridge 的石造橋塔與懸索是紐約最經典的步行景觀之一；到 Brooklyn 端後，DUMBO 的 Washington Street 可以把 Manhattan Bridge 框在紅磚街廓之間，河岸又能回望 Manhattan skyline。",
    tip:"如果同一天已經走很多路，不一定要完整走橋來回；單向過橋＋DUMBO 就很夠。",
    map:"DUMBO Brooklyn NY",official:"https://www.nyc.gov/html/dot/html/infrastructure/brooklyn-bridge.shtml"
  },
  {
    title:"Washington Square Park",en:"Greenwich Village",day:"10/09",cat:"戶外",
    wiki:["Washington_Square_Park"],
    intro:"Washington Square Arch 是 Greenwich Village 的地標，公園本身則是 NYU 周邊最有街頭生活感的公共空間之一。音樂、棋桌、學生與居民讓這裡和 Midtown 的觀光氣氛完全不同。",
    tip:"適合和 SoHo、Nolita、Chinatown 或 West Village 排在同一天。",
    map:"Washington Square Park New York NY",official:"https://www.nycgovparks.org/parks/washington-square-park"
  },
  {
    title:"Top of the Rock",en:"Sunset & Night Views",day:"10/09",cat:"景觀",
    wiki:["30_Rockefeller_Plaza","Empire_State_Building"],
    intro:"Top of the Rock 最有優勢的地方不是單純『高』，而是觀景構圖：向南能把 Empire State Building 放進 Manhattan skyline，向北則能看到 Central Park。日落前入場可以一路看到城市從白天轉成夜景。",
    tip:"想看三個時段就抓日落前約 60–90 分鐘入場；不必為了拍照另外買三個觀景台。",
    map:"Top of the Rock New York NY",official:"https://www.rockefellercenter.com/tickets/top-of-the-rock-observation-deck"
  },
  {
    title:"Central Park Picnic",en:"Last-day Slow Travel",day:"10/10",cat:"戶外",
    wiki:["Central_Park"],
    intro:"最後一天把 Central Park 當成 picnic 而不是『景點打卡任務』，是很舒服的收尾方式。公園夠大，但沒有必要一次走完；選一塊草地、湖邊或熟悉的區域坐下來反而更像真的在紐約生活。",
    tip:"離境日最適合低風險行程：不需要預約、隨時能離開，也方便回飯店取行李。",
    map:"Central Park New York NY",official:"https://www.centralparknyc.org/"
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

const mapsSearch=q=>\`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(q)}\`;
const wikiThumb=title=>\`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&origin=*&piprop=thumbnail&pithumbsize=1200&titles=\${encodeURIComponent(title)}\`;

function spotCard(x){
  const images=x.wiki.slice(0,2).map(w=>\`<div class="visited-shot"><div class="visited-placeholder">NYC</div><img data-wiki="\${w}" alt="\${x.title}" loading="lazy"></div>\`).join("");
  return \`<article class="visited-card" data-cat="\${x.cat}">
    <div class="visited-media \${x.wiki.length>1?"double":""}">\${images}</div>
    <div class="visited-body">
      <div class="visited-meta"><span>\${x.day}</span><b>\${x.cat}</b></div>
      <h3>\${x.title}<small>\${x.en}</small></h3>
      <p>\${x.intro}</p>
      <div class="visited-tip"><b>實際心得：</b>\${x.tip}</div>
      <div class="visited-actions">
        <a href="\${mapsSearch(x.map)}" target="_blank" rel="noopener">📍 Google Maps</a>
        <a href="\${x.official}" target="_blank" rel="noopener">Official ↗</a>
      </div>
    </div>
  </article>\`;
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
    filters.innerHTML=cats.map((x,i)=>\`<button class="tab \${i===0?"active":""}" data-cat="\${x}">\${x}</button>\`).join("");
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
    try{
      const r=await fetch(wikiThumb(img.dataset.wiki));
      if(!r.ok)return;
      const d=await r.json();
      const p=Object.values(d.query?.pages||{})[0];
      const src=p?.thumbnail?.source;
      if(src){
        img.src=src;
        img.onload=()=>{img.classList.add("loaded");img.previousElementSibling?.remove();};
      }
    }catch(e){}
  }));
}

function renderBookings(){
  const box=document.querySelector("#bookingGrid"); if(!box)return;
  box.innerHTML=BOOKINGS.map(x=>\`<article class="booking-card \${x.level}">
    <div class="booking-top"><span>\${x.when}</span><b>\${x.level==="book"?"需規劃":"Walk-in"}</b></div>
    <h3>\${x.title}</h3>
    <p>\${x.text}</p>
    <a href="\${x.link}" target="_blank" rel="noopener">\${x.label} ↗</a>
  </article>\`).join("");
}

function renderSpecials(){
  const box=document.querySelector("#specialGrid"); if(!box)return;
  box.innerHTML=SPECIALS.map(x=>\`<article class="special-card card">
    <span>\${x[0]}</span><h3>\${x[1]}</h3><p>\${x[2]}</p>
    <a href="\${mapsSearch(x[3])}" target="_blank" rel="noopener">📍 Maps</a>
  </article>\`).join("");
}

function renderFood(){
  const box=document.querySelector("#foodGrid"); if(!box)return;
  box.innerHTML=FOOD_DAYS.map(([day,items])=>\`<article class="food-day card">
    <div class="food-day-date">\${day}</div>
    <div class="food-chip-list">\${items.map(name=>\`<a href="\${mapsSearch(name+" New York NY")}" target="_blank" rel="noopener">\${name}<span>↗</span></a>\`).join("")}</div>
  </article>\`).join("");
}

renderVisited();
renderBookings();
renderSpecials();
renderFood();