const trip=window.NYC_TRIP;
const tabs=document.querySelector('#dayTabs'),panel=document.querySelector('#dayPanel');
function renderDay(d){panel.innerHTML=`<article class="card daydetail"><div class="dayhero"><div><div class="datebig">${d.date} <small>週${d.dow}</small></div><h3>${d.title}</h3><p>${d.area}</p></div><span class="tone ${d.tone}">${d.tone}</span></div><div class="timeline">${d.core.map(x=>`<div class="time"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div><div class="daynotes"><div class="food"><b>🍴 吃什麼</b><span>${d.food}</span></div><div class="mom"><b>👩‍👦 媽媽同行</b><span>${d.mom}</span></div><div class="optional"><b>↪ Optional / B plan</b><span>${d.optional}</span></div></div></article>`}
tabs.innerHTML=trip.days.map((d,i)=>`<button class="tab ${i===0?'active':''}" data-id="${d.id}">${d.date}<small>週${d.dow}</small></button>`).join('');
tabs.addEventListener('click',e=>{const b=e.target.closest('.tab');if(!b)return;tabs.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderDay(trip.days.find(x=>x.id===b.dataset.id));});renderDay(trip.days[0]);

const cats=['全部',...new Set(trip.options.map(x=>x.cat))],filters=document.querySelector('#optionFilters'),grid=document.querySelector('#optionGrid');
filters.innerHTML=cats.map((c,i)=>`<button class="tab ${i===0?'active':''}" data-cat="${c}">${c}</button>`).join('');
function dots(n){return `<span class="dots">${'●'.repeat(n)}${'○'.repeat(5-n)}</span>`}
function renderOptions(cat='全部'){const list=cat==='全部'?trip.options:trip.options.filter(x=>x.cat===cat);grid.innerHTML=list.map(o=>`<article class="card option"><div class="optop"><span class="badge">${o.cat}</span><h3>${o.name}</h3></div><p>${o.note}</p><div class="meters"><div><span>體力負擔</span>${dots(6-o.effort)}</div><div><span>雨天友善</span>${dots(o.indoor)}</div><div><span>媽媽友善</span>${dots(o.mom)}</div></div></article>`).join('')}
filters.addEventListener('click',e=>{const b=e.target.closest('.tab');if(!b)return;filters.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderOptions(b.dataset.cat)});renderOptions();
