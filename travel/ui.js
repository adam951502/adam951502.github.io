const RESERVATIONS = [
  {
    id:'statue',tier:'now',badge:'現在就訂',recommend:'★★★★★',date:'10/05（一）上午',
    name:'自由女神＋Ellis Island',en:'Statue of Liberty & Ellis Island',wiki:'Statue_of_Liberty',
    intro:'第一次紐約很值得正式登島。官方 ferry 一張票就包含 Liberty Island、Ellis Island、自由女神博物館與移民博物館；比只在岸邊拍照完整很多。',
    advice:'你們跟媽媽同行，我建議先看 General Admission；若 Pedestal Reserve 還有位、媽媽也願意走樓梯，再考慮升級。早場最適合，下午才有餘裕接 Wall Street／9/11。',
    fact:'官方票種：General / Pedestal Reserve / Crown Reserve。官方也提醒要預留安檢與登船時間。',
    link:'https://statuecitycruises.com/tickets',map:'Statue City Cruises Battery Park New York NY'
  },
  {
    id:'toprock',tier:'now',badge:'現在就訂',recommend:'★★★★★',date:'10/04（日）傍晚',
    name:'Top of the Rock',en:'Rockefeller Center Observation Deck',wiki:'30_Rockefeller_Plaza',
    intro:'如果整趟只買一個高樓觀景台，我仍然選它：向南能把 Empire State Building 放進 skyline，向北又能看 Central Park。',
    advice:'買一般 Timed Admission 就夠，不需要加 Beam / Skylift。想看日落，挑日落前約 60–90 分鐘的入場時段，熱門時段越早鎖越好。',
    fact:'官方 Timed Admission 目前從 US$42 起，需選日期與入場時間。',
    link:'https://www.rockefellercenter.com/buy-tickets/',map:'Top of the Rock New York NY'
  },
  {
    id:'broadway',tier:'now',badge:'劇目確定就訂',recommend:'★★★★★',date:'10/08（四）晚間',
    name:'Broadway',en:'Broadway Show',wiki:'Broadway_theatre',
    intro:'我把它列為第一次紐約的 Must-Go 夜間體驗。看完戲再去 Times Square 走 30–45 分鐘，會比單獨去時代廣場完整很多。',
    advice:'如果你有指定熱門劇，就現在從 Broadway.org 進官方售票渠道買；如果只是想「體驗一場」，可以晚一點再挑票價與座位。不要從不明 resale 網站下單。',
    fact:'Broadway.org 是 Broadway League 的官方資訊入口，會把你導向各劇院／製作的官方售票渠道。',
    link:'https://www.broadway.org/shows',map:'Theater District New York NY'
  },
  {
    id:'911',tier:'now',badge:'建議先訂',recommend:'★★★★½',date:'10/05（一）下午',
    name:'9/11 Museum',en:'National September 11 Memorial & Museum',wiki:'National_September_11_Memorial_%26_Museum',
    intro:'戶外 Memorial 免費，但如果你們想更完整理解事件與重建歷史，Museum 很值得。內容情緒較重，所以我仍保留「媽媽累了就只看戶外」的彈性。',
    advice:'如果確定要進館，就把它和自由女神同一天，抓下午 16:00 左右。這張票是 timed ticket，不要現場賭。',
    fact:'Museum admission 目前 US$24–36，可提前最多 6 個月購買；官方要求 timed tickets 先行購買。',
    link:'https://www.911memorial.org/visit/visit-museum-1',map:'9/11 Memorial & Museum New York NY'
  },
  {
    id:'nyff',tier:'optional',badge:'有興趣才搶',recommend:'★★★★',date:'10/09（五）晚間',
    name:'New York Film Festival',en:'NYFF64',wiki:'New_York_Film_Festival',
    intro:'你們整趟剛好撞上 NYFF64，10/9 又適合排 Lincoln Center。若片單裡有喜歡的導演／首映，這會是非常有「人在紐約」感的一晚。',
    advice:'一般單場票 9/15 12:00 ET 開賣；台灣時間是 9/16 00:00。熱門場次值得設鬧鐘，沒有喜歡的片就完全不用硬搶。',
    fact:'官方：一般單場票於 2026/9/15 12:00 ET 開賣。',
    link:'https://www.filmlinc.org/nyff/tickets-and-passes/',map:'Film at Lincoln Center New York NY'
  },
  {
    id:'nycc',tier:'optional',badge:'粉絲才買',recommend:'★★★',date:'10/08–10/10 可選',
    name:'New York Comic Con',en:'NYCC 2026',wiki:'New_York_Comic_Con',
    intro:'10/8–11 在 Javits Center，剛好完整撞期。內容很大、排隊和人潮也很大；跟媽媽同行，我仍優先選 MoMA＋Broadway，除非你真的對今年節目有興趣。',
    advice:'票已開賣，部分 Main Stage / Empire Stage 等另有 reservation 系統，而且 9/10 已經開放 reservations。若要去，先確認你最想看的 panel 再買對應日期。',
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
    advice:'一般票不算最需要搶，但先線上買能加快入場；若你要 Butterfly Vivarium、Planetarium 等 ticketed exhibition，就需要在結帳時選對應入場時間。',
    fact:'外州／海外成人 General Admission 目前 US$37；官方建議 advance tickets for faster entry。',
    link:'https://tickets.amnh.org/select',map:'American Museum of Natural History New York NY'
  }
];

const NO_RUSH = [
  ['The Met','一般票可先買，但官方明確寫 advance tickets 不要求；海外成人目前 US$30。','https://www.metmuseum.org/plan-your-visit'],
  ['MoMA','可線上買票（成人目前 US$30），但不是這趟最急的票；若 10/8 不去 NYCC，再排它。','https://www.moma.org/visit/'],
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
      <div class="reserve-advice"><b>我建議：</b>${x.advice}</div>
      <div class="reserve-fact">${x.fact}</div>
      <div class="reserve-actions"><a class="book-btn" href="${x.link}" target="_blank" rel="noopener">官方預約 / 購票 ↗</a><a class="map-btn" href="${googleMap(x.map)}" target="_blank" rel="noopener">📍 Maps</a></div>
    </div>
  </article>`;
  grid.innerHTML=`<div class="reservation-group"><div class="reservation-group-head"><h3>優先處理</h3><span>這 4 個最值得先鎖</span></div><div class="reservation-cards priority-reservations">${now.map(card).join('')}</div></div>
  <div class="reservation-group optional-group"><div class="reservation-group-head"><h3>有興趣才訂</h3><span>不要因為 FOMO 把行程塞滿</span></div><div class="reservation-cards">${optional.map(card).join('')}</div></div>`;
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

const USD_EUR=0.867077;
const USD_TWD=31.786;
const HOTEL_STAYS=[
  {
    id:'even',name:'EVEN Hotel Long Island City - New York by IHG',address:'42-59 Crescent Street, Long Island City, NY 11101',distance:'家人同飯店 · 0 km',price:2913,
    tags:[['family','家人同飯店'],['','最省時間']],quotes:[['Booking.com',2913],['IHG direct',2992]],
    summary:'如果「跟家人住同一棟」最重要，這仍是最省事的選擇。你提供的 Booking.com 價格比 IHG direct 少 US$79；你也註明目前已沒有 member points option。',
    official:'https://www.ihg.com/evenhotels/hotels/us/en/long-island-city/nycis/hoteldetail',booking:'https://www.booking.com/searchresults.html?ss=EVEN+Hotel+Long+Island+City+-+New+York+by+IHG&checkin=2026-10-02&checkout=2026-10-10&group_adults=2&no_rooms=1&group_children=0',
    map:'42-59 Crescent Street Long Island City NY 11101',image:'https://images.trvl-media.com/lodging/59000000/58160000/58150200/58150117/aacde280.jpg?impolicy=resizecrop&ra=fill&rh=575&rw=575',photo:'Representative King guest room'
  },
  {
    id:'hgi',name:'Hilton Garden Inn Long Island City New York',address:'29-21 41st Avenue, Long Island City, NY 11101',distance:'約 0.3 mi / 0.5 km from EVEN',price:2777,
    tags:[['','附近最佳價差'],['gold','Hilton Gold trade-off']],quotes:[['Booking.com',2777],['Hilton direct',3230]],
    summary:'離 EVEN 很近，而且 Booking.com 比 EVEN Booking 再少 US$136，是「靠家人＋省錢」最平衡的選項。不過若走 Booking.com，Hilton 官方規則不給 Honors points、stay/night credits 或額外會員 benefits。',
    official:'https://www.hilton.com/en/hotels/ispicgi-hilton-garden-inn-long-island-city-new-york/',booking:'https://www.booking.com/searchresults.html?ss=Hilton+Garden+Inn+Long+Island+City+New+York&checkin=2026-10-02&checkout=2026-10-10&group_adults=2&no_rooms=1&group_children=0',
    map:'29-21 41st Avenue Long Island City NY 11101',image:'https://www.hilton.com/im/en/ISPICGI/11276573/ispic-hgi-lic-standard-king-room.jpg?ch=3359&cw=6000&gravity=NorthWest&impolicy=crop&rh=430&rw=768&xposition=0&yposition=320',photo:'Hilton · Standard King Room'
  },
  {
    id:'doubletree',name:'DoubleTree by Hilton Long Island City New York',address:'38-15 9th Street, Long Island City, NY 11101',distance:'約 1.1 km from EVEN',price:2666,
    tags:[['cheapest','最低總價'],['gold','Hilton Gold eligible if direct']],quotes:[['Quoted rate',2666]],
    summary:'目前你列出的最低現金總價。若這個 US$2,666 是 Hilton direct rate，還可保留 Hilton Gold qualifying-stay benefits；缺點是離 EVEN 明顯比 Garden / Aloft / Courtyard 遠。',
    official:'https://www.hilton.com/en/hotels/lgapidt-doubletree-long-island-city-new-york/',map:'38-15 9th Street Long Island City NY 11101',image:'https://www.hilton.com/im/en/NYCCLDT/17148176/20220517-nyccl-king.jpg?ch=3333&cw=5000&gravity=NorthWest&impolicy=crop&rh=427&rw=640&xposition=0&yposition=0',photo:'Hilton · King guest room'
  },
  {
    id:'home2',name:'Home2 Suites by Hilton New York Long Island City/Manhattan View, NY',address:'39-06 30th St., Long Island City, NY 11101',distance:'約 0.5 mi / 0.8 km from EVEN',price:3199,
    tags:[['','Free hot breakfast'],['','Kitchenette / suite']],quotes:[['Quoted rate',3199]],
    summary:'總價較高，但房型更適合 8 晚長住：Home2 官方列有免費 hot breakfast，studio/suite 也有廚房機能。如果你很在意早餐與空間，它才有理由多付。',
    official:'https://www.hilton.com/en/hotels/ispmvht-home2-suites-new-york-long-island-city-manhattan-view-ny/',map:'39-06 30th Street Long Island City NY 11101',image:'https://www.hilton.com/im/en/ISPMVHT/19095304/ispmv-1-king-bed-studio-accessible-02.tif?ch=2799&cw=5000&gravity=NorthWest&impolicy=crop&rh=430&rw=768&xposition=0&yposition=267',photo:'Hilton · Studio King reference'
  },
  {
    id:'courtyard',name:'Courtyard by Marriott Long Island City/New York Manhattan View',address:'29-15 Queens Plaza North, Long Island City, NY 11101',distance:'約 0.3 mi / 0.5 km from EVEN',price:3372,
    tags:[['','很靠近 EVEN'],['','Queens Plaza transit']],quotes:[['Quoted rate',3372]],
    summary:'位置非常方便，官方也強調就在 Queens Plaza subway 附近；但以目前 US$3,372 的總價，除非你偏好 Marriott / 房型，否則性價比被 Garden 和 EVEN 壓過。',
    official:'https://www.marriott.com/en-us/hotels/nycql-courtyard-long-island-city-new-york-manhattan-view/overview/',map:'29-15 Queens Plaza North Long Island City NY 11101',image:'https://images.ctfassets.net/1aemqu6a6t65/3qiRrtWCoDR24V2LvE7Mit/073cf1ea32ec5b6b16200d4d05f7a235/king_bedroom_high_res?fit=fill&h=630&q=72&w=1200',photo:'NYC Tourism · King room reference'
  },
  {
    id:'aloft',name:'Aloft by Marriott Long Island City-Manhattan View',address:'27-45 Jackson Avenue, Long Island City, NY 11101',distance:'約 0.1 mi / 0.2 km from EVEN',price:3748,
    tags:[['family','幾乎隔壁'],['','最貴']],quotes:[['Quoted rate',3748]],
    summary:'是你清單裡離 EVEN 最近的替代飯店之一，官方也說多條地鐵線只約一個 block；但目前價格最高，而且官方確認不含免費早餐，所以這個價位我不會優先。',
    official:'https://www.marriott.com/en-us/hotels/ispva-aloft-long-island-city-manhattan-view/overview/',map:'27-45 Jackson Avenue Long Island City NY 11101',image:'https://images.ctfassets.net/1aemqu6a6t65/54kSYbk4kOUAXqWW3751hd/4825d757d661757f3429dae3f2900109/aloftlic_realhospitalitygroup_balcony-room-king',photo:'NYC Tourism · room reference'
  }
];

const HOTEL_WATCH=[
  {name:'Hyatt Place Long Island City / New York City',distance:'約 0.1 mi from EVEN',note:'非常近，官方列有 free breakfast。若你查到 8 晚總價接近 EVEN / Garden，就值得直接加入前三。',url:'https://www.hyatt.com/hyatt-place/en-US/lgazl-hyatt-place-long-island-city-new-york-city',map:'27-03 43rd Ave Long Island City NY 11101'},
  {name:'LIC Hotel',distance:'約 0.3 mi from EVEN',note:'位置靠 Court Square，常被列為 LIC 的 value option。若房價低於 DoubleTree 又能接受非大型連鎖，也值得比一次。',url:'https://www.lichotelny.com/',map:'44-04 21st Street Long Island City NY 11101'}
];

const money=(n,currency)=>new Intl.NumberFormat('en-US',{style:'currency',currency,maximumFractionDigits:0}).format(n);
const eur=n=>Math.round(n*USD_EUR);
const twd=n=>Math.round(n*USD_TWD);

function loadHotelStyle(){
  if(document.querySelector('link[href="./hotels.css"]'))return;
  const link=document.createElement('link');link.rel='stylesheet';link.href='./hotels.css';document.head.appendChild(link);
}

function renderHotelComparison(){
  const base=document.querySelector('#base');if(!base)return;
  const h2=base.querySelector('h2');if(h2)h2.textContent='住宿改以 EVEN Hotel 周邊為核心';
  const sub=base.querySelector('.sub');if(sub)sub.innerHTML='家人目前住在 <b>EVEN Hotel Long Island City - New York</b>，所以現在住宿比較不再以 Hunters Point 公寓為中心，而是以「離 EVEN 近、地鐵方便、8 晚總價」排序。以下價格是你在 <b>2026/09/17</b> 提供的 10/2→10/10、8 晚 snapshot。';
  const basegrid=base.querySelector('.basegrid');
  if(basegrid)basegrid.innerHTML=`<article class="card"><h3>👨‍👩‍👦 家人 anchor</h3><p><b>EVEN Hotel</b><br>42-59 Crescent Street。住同飯店最方便；Aloft / Hyatt Place 約 0.1 mi，Garden / Courtyard 約 0.3 mi。</p><div class="tagrow"><span>Queens Plaza</span><span>family-first</span></div></article><article class="card"><h3>🚇 交通</h3><p>EVEN 官方主打鄰近 Queensboro Plaza；Garden / Courtyard 也靠 Queens Plaza。這區進 Midtown 很快，比原本每天從 waterfront 走回來更直接。</p><div class="tagrow"><span>Midtown easy</span><span>多條 subway</span></div></article><article class="card"><h3>💳 Hilton Gold</h3><p>若選 Hilton 系並想保留 Gold benefits，盡量 direct book。Hilton 官方明確寫 Booking.com 等第三方不給 Points、stay/night credits 或額外會員 benefits。</p><div class="tagrow"><span>Direct matters</span><span>OTA trade-off</span></div></article>`;

  const old=base.querySelector('.hotel-details');
  const wrap=document.createElement('div');wrap.className='hotel-compare';
  const sorted=[...HOTEL_STAYS].sort((a,b)=>a.price-b.price);
  const tableRows=sorted.map((h,i)=>`<tr class="${h.id==='doubletree'?'best':''} ${h.id==='even'?'same':''}"><td>${i+1}</td><td><b>${h.name}</b><br><small>${h.distance}</small></td><td class="price-main">${money(h.price,'USD')}</td><td>${money(eur(h.price),'EUR')}</td><td>${money(twd(h.price),'TWD')}</td><td>${money(h.price/8,'USD')}</td></tr>`).join('');
  const cards=HOTEL_STAYS.map(h=>`<article class="hotel-card"><div class="hotel-photo"><img src="${h.image}" alt="${h.name} room reference" loading="lazy"><span class="hotel-photo-credit">${h.photo}</span></div><div class="hotel-card-body"><div class="hotel-card-top">${h.tags.map(t=>`<span class="hotel-pill ${t[0]}">${t[1]}</span>`).join('')}</div><h4>${h.name}</h4><div class="hotel-address">${h.address} · ${h.distance}</div><div class="hotel-total"><strong>${money(h.price,'USD')}</strong><span>lowest quoted / 8 nights</span></div><div class="hotel-fx">≈ ${money(eur(h.price),'EUR')} · ${money(twd(h.price),'TWD')} · ${money(h.price/8,'USD')}/night</div><div class="hotel-channel">${h.quotes.map(q=>`<div><b>${q[0]}</b> ${money(q[1],'USD')} · ${money(eur(q[1]),'EUR')} · ${money(twd(q[1]),'TWD')}</div>`).join('')}</div><p class="hotel-summary">${h.summary}</p><div class="hotel-actions"><a class="official" href="${h.official}" target="_blank" rel="noopener">Official ↗</a><a class="maps" href="${googleMap(h.map)}" target="_blank" rel="noopener">📍 Maps</a>${h.booking?`<a class="booking" href="${h.booking}" target="_blank" rel="noopener">Booking.com ↗</a>`:''}</div></div></article>`).join('');
  wrap.innerHTML=`<div class="hotel-compare-head"><div><div class="kicker">Hotel shortlist · 8 nights</div><h3>10/02 → 10/10 住宿比較</h3><p>先看「跟家人的距離」，再看 cash price。EUR / TWD 以 2026/09/17 即期參考匯率換算：1 USD ≈ €0.8671 / NT$31.786。</p></div><div class="hotel-rate-note">2 people · 1 room · 8 nights</div></div><div class="hotel-reco"><div class="card"><b>👨‍👩‍👦 最方便</b><span>EVEN Booking.com · 同一間飯店 · US$2,913</span></div><div class="card"><b>⚖️ 附近最佳平衡</b><span>Hilton Garden Inn Booking.com · 約 0.3 mi · US$2,777</span></div><div class="card"><b>💰 最低總價</b><span>DoubleTree · 約 1.1 km · US$2,666</span></div></div><div class="hotel-table-wrap"><table class="hotel-price-table"><thead><tr><th>#</th><th>Hotel / distance from EVEN</th><th>USD total</th><th>EUR approx.</th><th>NTD approx.</th><th>USD/night</th></tr></thead><tbody>${tableRows}</tbody></table></div><div class="hotel-cards">${cards}</div><div class="hotel-watch"><h4>另外值得查一次價格</h4><div class="hotel-watch-grid">${HOTEL_WATCH.map(x=>`<div class="card"><b>${x.name}</b><div class="rankbadge">${x.distance}</div><p>${x.note}</p><a href="${x.url}" target="_blank" rel="noopener">Official ↗</a> · <a href="${googleMap(x.map)}" target="_blank" rel="noopener">Maps ↗</a></div>`).join('')}</div></div><div class="hotel-disclaimer">價格以你提供的目前總價為 snapshot；我能驗證飯店名稱、地址、距離級距、官方 amenities 與網站，但動態訂房頁沒有穩定曝露你這組 10/2–10/10 的完整 final checkout total。房間照片以 standard / entry-level room reference 為主；實際最低房型會隨庫存改變。</div>`;
  if(old)old.replaceWith(wrap);else base.querySelector('.wrap')?.appendChild(wrap);
}

const MENU_ITEMS=[
  ['flight','航班與日期'],['base','住宿比較 / LIC'],['plan','每日行程'],['highlights','必去景點'],['reservations','預約中心'],['events','秋季限定'],['options','備選景點'],['community','PTT / IG'],['checklist','交通＋Checklist']
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
loadHotelStyle();
renderHotelComparison();
buildDrawer();
compactMobile();
applyTravelBranding();
