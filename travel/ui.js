const RESERVATIONS = [
  {
    id:'statue',tier:'now',badge:'現在就訂',recommend:'★★★★★',date:'10/07（三）上午',
    name:'自由女神＋Ellis Island',en:'Statue of Liberty & Ellis Island',wiki:'Statue_of_Liberty',
    intro:'第一次紐約很值得正式登島。官方 ferry 一張票就包含 Liberty Island、Ellis Island、自由女神博物館與移民博物館；比只在岸邊拍照完整很多。',
    advice:'10/5 已改為 Bar Admission Ceremony family day，因此自由女神移到 10/7 上午。可先考慮 General Admission；若 Pedestal Reserve 仍有名額且可接受較多樓梯，再考慮升級。早場結束後可接 Lower Manhattan＋DUMBO。',
    fact:'官方票種：General / Pedestal Reserve / Crown Reserve。官方也提醒要預留安檢與登船時間。',
    link:'https://statuecitycruises.com/tickets',map:'Statue City Cruises Battery Park New York NY'
  },
  {
    id:'toprock',tier:'now',badge:'現在就訂',recommend:'★★★★★',date:'10/04（日）傍晚',
    name:'Top of the Rock',en:'Rockefeller Center Observation Deck',wiki:'30_Rockefeller_Plaza',
    intro:'如果整趟只安排一個高樓觀景台，Top of the Rock 是很平衡的選擇：向南能把 Empire State Building 放進 skyline，向北又能看 Central Park。',
    advice:'買一般 Timed Admission 就夠，不需要加 Beam / Skylift。想看日落，挑日落前約 60–90 分鐘的入場時段，熱門時段越早鎖越好。',
    fact:'官方 Timed Admission 目前從 US$42 起，需選日期與入場時間。',
    link:'https://www.rockefellercenter.com/buy-tickets/',map:'Top of the Rock New York NY'
  },
  {
    id:'broadway',tier:'now',badge:'劇目確定就訂',recommend:'★★★★★',date:'10/08（四）晚間',
    name:'Broadway',en:'Broadway Show',wiki:'Broadway_theatre',
    intro:'Broadway 是第一次到紐約很經典的夜間體驗。看完戲再去 Times Square 走 30–45 分鐘，會比單獨去時代廣場完整很多。',
    advice:'若有指定熱門劇，建議從 Broadway.org 進入官方售票渠道購票；若只是想體驗一場 Broadway，可以保留彈性再比較票價與座位。避免使用來源不明的 resale 網站。',
    fact:'Broadway.org 是 Broadway League 的官方資訊入口，可連至各劇院／製作的官方售票渠道。',
    link:'https://www.broadway.org/shows',map:'Theater District New York NY'
  },
  {
    id:'911',tier:'now',badge:'建議先訂',recommend:'★★★★½',date:'彈性：10/05 或 10/07',
    name:'9/11 Museum',en:'National September 11 Memorial & Museum',wiki:'National_September_11_Memorial_%26_Museum',
    intro:'戶外 Memorial 免費；若想更完整理解事件與重建歷史，可再安排 Museum。內容情緒較重，也可只參觀戶外紀念區。',
    advice:'先等 10/5 Bar Admission Ceremony 的正式場地與時間確認。若典禮在 Manhattan 且較早結束，可排 10/5 下午；否則放在 10/7 Statue / Lower Manhattan 行程後。Museum 使用 timed ticket，確定日期後再鎖時段。',
    fact:'Museum admission 目前 US$24–36，可提前最多 6 個月購買；官方要求 timed tickets 先行購買。',
    link:'https://www.911memorial.org/visit/visit-museum-1',map:'9/11 Memorial & Museum New York NY'
  },
  {
    id:'nyff',tier:'optional',badge:'有興趣才搶',recommend:'★★★★',date:'10/09（五）晚間',
    name:'New York Film Festival',en:'NYFF64',wiki:'New_York_Film_Festival',
    intro:'旅程日期與 NYFF64 重疊，10/9 也適合安排 Lincoln Center。若片單裡有喜歡的導演或首映，會是很有紐約城市感的夜間活動。',
    advice:'一般單場票 9/15 12:00 ET 開賣；台灣時間是 9/16 00:00。熱門場次值得設鬧鐘，沒有喜歡的片就完全不用硬搶。',
    fact:'官方：一般單場票於 2026/9/15 12:00 ET 開賣。',
    link:'https://www.filmlinc.org/nyff/tickets-and-passes/',map:'Film at Lincoln Center New York NY'
  },
  {
    id:'nycc',tier:'optional',badge:'粉絲才買',recommend:'★★★',date:'10/08–10/10 可選',
    name:'New York Comic Con',en:'NYCC 2026',wiki:'New_York_Comic_Con',
    intro:'10/8–11 在 Javits Center 舉行，與旅程日期重疊。展會規模大、人潮也多；若沒有特定節目目標，可保留較輕鬆的 MoMA＋Broadway 行程。',
    advice:'票已開賣，部分 Main Stage / Empire Stage 等另有 reservation 系統，且 9/10 已開放 reservations。建議先確認想看的 panel，再購買對應日期。',
    fact:'2026 NYCC：10/8–11；官方 tickets on sale now，reservations 已於 9/10 開放。',
    link:'https://www.newyorkcomiccon.com/en-us/buy/tickets.html',map:'Jacob K Javits Convention Center New York NY'
  },
  {
    id:'nybg',tier:'optional',badge:'替換行程才訂',recommend:'★★★½',date:'10/03–10/10 任選',
    name:'NYBG Día de los Muertos',en:'New York Botanical Garden',wiki:'New_York_Botanical_Garden',
    intro:'2026 新的秋季活動，marigolds、ofrenda、calaveras 加上秋色，適合把某個博物館日替換成更鬆的戶外半日。',
    advice:'確定要去 Bronx 再買即可。活動包含在 All-Garden Pass；週末成人目前 US$39。',
    fact:'Día de los Muertos：10/3–11/2；NYBG 入園需要有效日期／時段票。',
    link:'https://www.nybg.org/visit/admission',map:'New York Botanical Garden Bronx NY'
  },
  {
    id:'amnh',tier:'optional',badge:'提前買較省事',recommend:'★★★½',date:'10/09（五）上午',
    name:'AMNH',en:'American Museum of Natural History',wiki:'American_Museum_of_Natural_History',
    intro:'如果選自然史博物館，恐龍、宇宙、海洋主題很適合第一次去；但館非常大，仍然只挑重點。',
    advice:'一般票不算最需要搶，但先線上購票可加快入場；若要參觀 Butterfly Vivarium、Planetarium 等 ticketed exhibition，需在結帳時選擇對應入場時間。',
    fact:'外州／海外成人 General Admission 目前 US$37；官方建議 advance tickets for faster entry。',
    link:'https://tickets.amnh.org/select',map:'American Museum of Natural History New York NY'
  }
];

const NO_RUSH = [
  ['The Met','一般票可先買，但官方明確寫 advance tickets 不要求；海外成人目前 US$30。','https://www.metmuseum.org/plan-your-visit'],
  ['MoMA','可線上買票（成人目前 US$30），但不屬於最急迫的票種；若 10/8 不安排 NYCC，可改排 MoMA。','https://www.moma.org/visit/'],
  ['Central Park / High Line / DUMBO / Gantry','免費公共空間，不需預約。',''],
  ['Grand Central / Times Square','直接去即可，不需預約。','']
];

const wikiSummary = title => `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
const googleMap = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

function renderReservations(){
  const grid=document.querySelector('#reservationGrid');
  if(!grid) return;
  const now=RESERVATIONS.filter(x=>x.tier==='now');
  const optional=RESERVATIONS.filter(x=>x.tier==='optional');
  const card=x=>`<article class="reservation-card" data-wiki="${x.wiki}">
    <div class="reservation-photo"><div class="reservation-placeholder">NYC</div><img alt="${x.name}" loading="lazy"></div>
    <div class="reservation-body">
      <div class="reservation-meta"><span class="reserve-badge ${x.tier}">${x.badge}</span><span class="reserve-stars">${x.recommend}</span></div>
      <h3>${x.name}<small>${x.en}</small></h3>
      <div class="reserve-date">📅 建議：${x.date}</div>
      <p>${x.intro}</p>
      <div class="reserve-advice"><b>行程建議：</b>${x.advice}</div>
      <div class="reserve-fact">${x.fact}</div>
      <div class="reserve-actions"><a class="book-btn" href="${x.link}" target="_blank" rel="noopener">官方預約 / 購票 ↗</a><a class="map-btn" href="${googleMap(x.map)}" target="_blank" rel="noopener">📍 Maps</a></div>
    </div>
  </article>`;
  grid.innerHTML=`<div class="reservation-group"><div class="reservation-group-head"><h3>優先處理</h3><span>這 4 個最值得先鎖</span></div><div class="reservation-cards priority-reservations">${now.map(card).join('')}</div></div>
  <div class="reservation-group optional-group"><div class="reservation-group-head"><h3>有興趣再預約</h3><span>依興趣選擇，避免過度排程</span></div><div class="reservation-cards">${optional.map(card).join('')}</div></div>`;
  const noRush=document.querySelector('#noRushList');
  if(noRush) noRush.innerHTML=NO_RUSH.map(x=>`<div class="no-rush-row"><b>${x[0]}</b><span>${x[1]}</span>${x[2]?`<a href="${x[2]}" target="_blank" rel="noopener">Official ↗</a>`:''}</div>`).join('');
  hydrateReservationImages();
}

async function hydrateReservationImages(){
  const cards=[...document.querySelectorAll('.reservation-card[data-wiki]')];
  await Promise.all(cards.map(async card=>{
    const title=card.dataset.wiki; const img=card.querySelector('img'); const ph=card.querySelector('.reservation-placeholder');
    try{const r=await fetch(wikiSummary(title),{headers:{Accept:'application/json'}});if(!r.ok)return;const d=await r.json();const src=d.originalimage?.source||d.thumbnail?.source;if(src){img.src=src;img.onload=()=>{img.classList.add('loaded');ph?.remove()}}}catch(e){}
  }));
}

function cleanCommunityDuplication(){
  const community=document.querySelector('#community');
  if(!community) return;
  const must=community.querySelector('.must-grid');
  if(must){const head=must.previousElementSibling;if(head?.classList.contains('community-head'))head.remove();must.remove();}
  const h2=community.querySelector('h2'); if(h2)h2.textContent='PTT＋IG 社群情報';
  const sub=community.querySelector('.sub'); if(sub)sub.textContent='必去景點已經合併到上面的「必去圖文指南」，這裡只保留社群來源：PTT 看實際動線與體力心得；IG 用來補出發前的即時活動與美食。';
  const options=document.querySelector('#options'); if(options) options.after(community);
}

function renderAccommodation(){
  const base=document.querySelector('#base');if(!base)return;
  const wrap=base.querySelector('.wrap');if(!wrap)return;
  wrap.innerHTML=`
    <div class="kicker">Accommodation · confirmed</div>
    <h2>住宿已確認｜Hilton Garden Inn Long Island City New York</h2>
    <p class="sub">10/02 入住 → 10/10 退房，共 <b>8 晚</b>；<b>1 間房、2 位成人</b>。入住、交通、設施與聯絡資訊集中整理如下。</p>

    <div class="stay-hero card">
      <div>
        <span class="stay-status">✓ CONFIRMED</span>
        <h3>Hilton Garden Inn Long Island City New York</h3>
        <p>29-21 41st Ave, Long Island City, NY 11101</p>
        <div class="stay-actions">
          <a class="map-btn" href="${googleMap('29-21 41st Ave Long Island City NY 11101')}" target="_blank" rel="noopener">📍 Google Maps</a>
          <a class="official-btn" href="https://www.hilton.com/en/hotels/ispicgi-hilton-garden-inn-long-island-city-new-york/" target="_blank" rel="noopener">Hilton Official ↗</a>
        </div>
      </div>
      <div class="stay-datebox">
        <strong>10/02 → 10/10</strong>
        <span>8 nights</span>
        <small>1 room · 2 adults</small>
      </div>
    </div>

    <div class="stay-quick-grid">
      <article class="card stay-quick">
        <span>CHECK-IN</span><b>15:00 起</b>
        <p>若提早抵達且有空房，可協助 Early Check-in；沒有房也可先寄放行李。</p>
      </article>
      <article class="card stay-quick">
        <span>CHECK-OUT</span><b>12:00</b>
        <p>Late Check-out 要在退房當天向櫃檯確認可否提供，以及能延後到幾點。</p>
      </article>
      <article class="card stay-quick">
        <span>CONTACT</span><b><a href="tel:+17187866001">(718) 786-6001</a></b>
        <p>Front Desk 24 小時。<a href="mailto:hiltongardeninnlic@gmail.com">hiltongardeninnlic@gmail.com</a></p>
      </article>
    </div>

    <div class="stay-details-grid">
      <details class="card stay-detail" open>
        <summary>🚕 機場與交通</summary>
        <div class="stay-detail-body">
          <p>飯店附近有多條 <b>Subway</b> 路線，飯店建議用 Transit App 查即時大眾運輸。</p>
          <p><b>沒有機場接駁車。</b>櫃檯可協助安排合作的當地 Car Service 往返紐約三大機場，也可以直接使用 Uber / Lyft。</p>
          <div class="tagrow"><span>Subway</span><span>Car Service</span><span>Uber / Lyft</span><span>No airport shuttle</span></div>
        </div>
      </details>

      <details class="card stay-detail" open>
        <summary>🅿️ 停車</summary>
        <div class="stay-detail-body">
          <p>飯店本身<b>沒有停車場</b>。</p>
          <p>隔壁 <b>Champion Parking</b> 約 <b>US$45–50 / 24 小時</b>，一般不提供自由進出（in-and-out privileges）。路邊停車可能有，但數量非常有限。</p>
        </div>
      </details>

      <details class="card stay-detail" open>
        <summary>🍳 餐飲與 24 小時補給</summary>
        <div class="stay-detail-body">
          <p><b>The Garden Grille</b>：提供早餐與晚餐。</p>
          <p><b>Pavillion Pantry</b>：Front Desk 旁，<b>24 小時</b>供應零食、飲料（含酒精飲品）與簡單食品。</p>
        </div>
      </details>

      <details class="card stay-detail" open>
        <summary>📶 Wi‑Fi / Fitness / 洗衣</summary>
        <div class="stay-detail-body">
          <p><b>免費 Wi‑Fi</b>：連線至 <b>“Honors”</b> 網路，以訂房姓氏＋入住後房號登入；還沒 Check-in 可向櫃檯索取 Promo Code。</p>
          <p><b>Fitness Center</b>：Level C，24 小時開放。</p>
          <p><b>自助洗衣</b>：Level C，可用投幣／App 操作。</p>
        </div>
      </details>
    </div>

    <div class="stay-points card">
      <div class="stay-points-icon">⭐</div>
      <div>
        <h3>Hilton Honors：不使用 Housekeeping 可拿 2,000 Points</h3>
        <p>如果是 <b>Hilton Honors 會員</b>且住宿 <b>3 晚以上</b>，可在 Check-in 時選擇整段住宿完全不使用 Housekeeping，飯店會加贈 <b>2,000 Hilton Honors Points</b>。</p>
        <p>即使選擇不打掃，仍可向飯店索取毛巾、備品等需要的物品。</p>
      </div>
    </div>

    <div class="family-stay card">
      <div>
        <div class="kicker">同行者住宿</div>
        <h3>EVEN Hotel Long Island City - New York by IHG</h3>
        <p>同行者住宿於 EVEN Hotel，可作為旅程期間的固定會合地點。</p>
      </div>
      <div class="stay-actions">
        <a class="map-btn" href="${googleMap('EVEN Hotel Long Island City New York by IHG')}" target="_blank" rel="noopener">📍 EVEN Hotel Maps</a>
        <a class="official-btn" href="https://www.ihg.com/evenhotels/hotels/us/en/long-island-city/nycis/hoteldetail" target="_blank" rel="noopener">IHG Official ↗</a>
      </div>
    </div>

    <div class="stay-source">
      <span>住宿資訊更新：2026/09/18 · 來源：飯店回覆</span>
    </div>
  `;
}


const MENU_ITEMS=[
  ['flight','航班與日期'],['base','住宿'],['plan','每日行程'],['highlights','必去景點'],['reservations','預約中心'],['events','秋季限定'],['options','備選景點'],['community','PTT / IG'],['checklist','交通＋Checklist']
];

function buildDrawer(){
  if(document.querySelector('#mobileDrawer')) return;
  const btn=document.createElement('button');btn.id='menuFab';btn.className='menu-fab';btn.type='button';btn.setAttribute('aria-label','開啟目錄');btn.innerHTML='<span>☰</span><small>目錄</small>';
  const shade=document.createElement('div');shade.id='drawerShade';shade.className='drawer-shade';
  const drawer=document.createElement('aside');drawer.id='mobileDrawer';drawer.className='mobile-drawer';drawer.innerHTML=`<div class="drawer-head"><div><b>NYC 2026</b><span>10/03–10/10</span></div><button type="button" class="drawer-close" aria-label="關閉">×</button></div><nav>${MENU_ITEMS.map(([id,label],i)=>`<a href="#${id}" data-target="${id}"><span>${String(i+1).padStart(2,'0')}</span>${label}</a>`).join('')}</nav><a class="drawer-top" href="#top">↑ 回到最上方</a>`;
  document.body.prepend(shade);document.body.prepend(drawer);document.body.prepend(btn);document.body.id='top';
  const close=()=>{drawer.classList.remove('open');shade.classList.remove('open');document.body.classList.remove('drawer-open')};
  const open=()=>{drawer.classList.add('open');shade.classList.add('open');document.body.classList.add('drawer-open')};
  btn.onclick=open;drawer.querySelector('.drawer-close').onclick=close;shade.onclick=close;drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  const links=[...drawer.querySelectorAll('nav a')];
  const observer=new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio).slice(0,1).forEach(e=>{links.forEach(a=>a.classList.toggle('active',a.dataset.target===e.target.id))})},{rootMargin:'-25% 0px -65% 0px',threshold:[0,.1,.5]});
  MENU_ITEMS.forEach(([id])=>{const el=document.getElementById(id);if(el)observer.observe(el)});
}

function compactMobile(){
  const hotel=document.querySelector('.hotel-details');if(hotel && window.matchMedia('(min-width: 901px)').matches)hotel.open=true;
}

function applyTravelBranding(){
  const iconUrl='https://cdn-icons-png.flaticon.com/512/284/284489.png';
  if(!document.querySelector('link[data-travel-favicon]')){
    const favicon=document.createElement('link');favicon.rel='icon';favicon.type='image/png';favicon.href=iconUrl;favicon.dataset.travelFavicon='1';document.head.appendChild(favicon);
    const apple=document.createElement('link');apple.rel='apple-touch-icon';apple.href=iconUrl;apple.dataset.travelFavicon='1';document.head.appendChild(apple);
  }
  const footer=document.querySelector('footer .wrap')||document.querySelector('footer');
  if(footer && !footer.querySelector('.icon-credit')){const credit=document.createElement('span');credit.className='icon-credit';credit.innerHTML=' · New York icon by <a href="https://www.flaticon.com/authors/icon-pond" target="_blank" rel="noopener">Icon Pond</a> on <a href="https://www.flaticon.com/free-icon/new-york_284489" target="_blank" rel="noopener">Flaticon</a>';footer.appendChild(credit)}
}

renderReservations();
cleanCommunityDuplication();
renderAccommodation();
buildDrawer();
compactMobile();
applyTravelBranding();
