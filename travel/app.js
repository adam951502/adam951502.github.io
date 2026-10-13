const trip=window.NYC_TRIP;

const mapsSearch=q=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const mapBtn=m=>`<a class="timeline-map" href="${m.url||mapsSearch(m.q)}" target="_blank" rel="noopener">📍 ${m.label}</a>`;

const DAY_MAPS={
  oct2:[
    [{label:"JFK Terminal 1",q:"JFK Airport Terminal 1 Queens NY"}],
    [{label:"Hilton Garden Inn LIC",q:"Hilton Garden Inn Long Island City New York"}],
    [{label:"Hotel",q:"29-21 41st Ave Long Island City NY 11101"}]
  ],
  oct3:[
    [{label:"Roosevelt Island",q:"Roosevelt Island New York NY"}],
    [{label:"Roosevelt Island Tram",q:"Roosevelt Island Tramway New York NY"}],
    [{label:"Trump Tower",q:"Trump Tower New York NY"},{label:"Rockefeller Center",q:"Rockefeller Center New York NY"},{label:"St. Patrick's",q:"St Patrick's Cathedral New York NY"}],
    [{label:"Grand Central",q:"Grand Central Terminal New York NY"}],
    [{label:"Louis Vuitton Fifth Ave",q:"Louis Vuitton 6 E 57th St New York NY"}],
    [{label:"Times Square",q:"Times Square New York NY"},{label:"Broadway",q:"Broadway Theatre District New York NY"}]
  ],
  oct4:[
    [{label:"Battery Maritime Building",q:"Battery Maritime Building Slip 5 New York NY"}],
    [{label:"Battery Maritime Building",q:"10 South Street New York NY"}],
    [{label:"Bear Mountain",q:"Bear Mountain State Park New York"}],
    [{label:"Bear Mountain Dock",q:"Bear Mountain Dock Tompkins Cove NY"}],
    [{label:"Battery Maritime Building",q:"10 South Street New York NY"}],
    [{label:"Charging Bull",q:"Charging Bull New York NY"}]
  ],
  oct5:[
    [{label:"Ceremony map",url:"https://maps.app.goo.gl/QrwZngLEwEon2ouU7?g_st=il"}],
    [{label:"Family lunch area",q:"restaurants Midtown Manhattan New York NY"}],
    [{label:"NY Public Library",q:"New York Public Library Stephen A Schwarzman Building"}],
    [{label:"Vessel",q:"Vessel Hudson Yards New York NY"}],
    [{label:"Edge NYC",q:"Edge NYC Hudson Yards New York NY"}]
  ],
  oct6:[
    [{label:"Avis LIC",q:"Avis Car Rental Long Island City New York"}],
    [{label:"Woodbury Common",q:"Woodbury Common Premium Outlets 498 Red Apple Ct Central Valley NY"}],
    [{label:"Woodbury Common",q:"Woodbury Common Premium Outlets 498 Red Apple Ct Central Valley NY"}],
    [{label:"Long Island City",q:"Long Island City New York NY"}]
  ],
  oct7:[
    [{label:"Starbucks Reserve Roastery",q:"Starbucks Reserve Roastery New York 61 9th Ave"}],
    [{label:"Chelsea Market",q:"Chelsea Market New York NY"}],
    [{label:"Little Island",q:"Little Island New York NY"}],
    [{label:"High Line",q:"High Line New York NY"}],
    [{label:"Hudson Yards",q:"Hudson Yards New York NY"}],
    [{label:"Moynihan Train Hall",q:"Moynihan Train Hall New York NY"}],
    [{label:"Lyric Theatre",q:"Lyric Theatre 214 W 43rd St New York NY"}]
  ],
  oct8:[
    [{label:"Statue City Cruises",q:"Statue City Cruises Battery Park New York NY"}],
    [{label:"Statue of Liberty",q:"Statue of Liberty New York NY"}],
    [{label:"Battery Urban Farm",q:"Battery Urban Farm New York NY"}],
    [{label:"Charging Bull",q:"Charging Bull New York NY"},{label:"NYSE",q:"New York Stock Exchange New York NY"},{label:"Fearless Girl",q:"Fearless Girl New York NY"}],
    [{label:"One World Trade Center",q:"One World Trade Center New York NY"}],
    [{label:"Brooklyn Bridge",q:"Brooklyn Bridge New York NY"}],
    [{label:"DUMBO",q:"DUMBO Brooklyn NY"},{label:"Manhattan Bridge View",q:"Washington Street DUMBO Brooklyn NY"}],
    [{label:"Supreme New York",q:"Supreme New York store"}]
  ],
  oct9:[
    [{label:"Chinatown",q:"Chinatown Manhattan New York NY"}],
    [{label:"Washington Square Park",q:"Washington Square Park New York NY"}],
    [{label:"Rockefeller Center",q:"Rockefeller Center New York NY"}],
    [{label:"Top of the Rock",q:"Top of the Rock New York NY"}]
  ],
  oct10:[
    [{label:"Hotel",q:"Hilton Garden Inn Long Island City New York"}],
    [{label:"Central Park",q:"Central Park New York NY"}],
    [{label:"Dinner map",url:"https://maps.app.goo.gl/Tsmbo9DUGjYrwP1D6?g_st=il"}],
    [{label:"Hilton Garden Inn LIC",q:"Hilton Garden Inn Long Island City New York"}],
    [{label:"JFK Terminal 1",q:"JFK Airport Terminal 1 Queens NY"}],
    [{label:"JFK Terminal 1",q:"JFK Airport Terminal 1 Queens NY"}]
  ]
};

const tabs=document.querySelector("#dayTabs");
const panel=document.querySelector("#dayPanel");

function renderDay(d){
  const maps=DAY_MAPS[d.id]||[];
  panel.innerHTML=`<article class="card daydetail final-day">
    <div class="dayhero">
      <div>
        <div class="datebig">${d.date} <small>週${d.dow}</small></div>
        <h3>${d.title}</h3>
        <p>${d.area}</p>
      </div>
      <span class="tone ${d.tone}">實際走訪</span>
    </div>
    <div class="timeline">
      ${d.core.map((x,i)=>`<div class="time">
        <b>${x[0]}</b>
        <div class="timeline-copy">
          <span>${x[1]}</span>
          ${maps[i]?.length?`<div class="timeline-maps">${maps[i].map(mapBtn).join("")}</div>`:""}
        </div>
      </div>`).join("")}
    </div>
    <div class="daynotes">
      <div class="food"><b>🍴 當日吃喝</b><span>${d.food}</span></div>
      <div class="mom"><b>🧭 實際心得</b><span>${d.note}</span></div>
      <div class="optional"><b>💡 給其他旅客</b><span>${d.tip}</span></div>
    </div>
  </article>`;
}

tabs.innerHTML=trip.days.map((d,i)=>`<button class="tab ${i===0?"active":""}" data-id="${d.id}">${d.date}<small>週${d.dow}</small></button>`).join("");
tabs.addEventListener("click",e=>{
  const b=e.target.closest(".tab");
  if(!b)return;
  tabs.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  renderDay(trip.days.find(x=>x.id===b.dataset.id));
});
renderDay(trip.days[0]);