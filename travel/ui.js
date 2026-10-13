const MENU_ITEMS=[
  ["journal","旅程故事"],
  ["plan","每日路線"],
  ["highlights","照片景點"],
  ["food","吃喝紀錄"],
  ["special","特別行程"],
  ["base","住宿資訊"],
  ["booking","預約心得"],
  ["tips","旅行心得"]
];

function buildDrawer(){
  if(document.querySelector("#mobileDrawer"))return;

  const btn=document.createElement("button");
  btn.id="menuFab";
  btn.className="menu-fab";
  btn.type="button";
  btn.setAttribute("aria-label","開啟目錄");
  btn.innerHTML="<span>☰</span><small>目錄</small>";

  const shade=document.createElement("div");
  shade.id="drawerShade";
  shade.className="drawer-shade";

  const drawer=document.createElement("aside");
  drawer.id="mobileDrawer";
  drawer.className="mobile-drawer";
  drawer.innerHTML=`<div class="drawer-head">
    <div><b>NYC 2026</b><span>Trip Journal</span></div>
    <button type="button" class="drawer-close" aria-label="關閉">×</button>
  </div>
  <nav>${MENU_ITEMS.map(([id,label],i)=>`<a href="#${id}" data-target="${id}"><span>${String(i+1).padStart(2,"0")}</span>${label}</a>`).join("")}</nav>
  <a class="drawer-top" href="#top">↑ 回到最上方</a>`;

  document.body.prepend(shade);
  document.body.prepend(drawer);
  document.body.prepend(btn);

  const close=()=>{
    drawer.classList.remove("open");
    shade.classList.remove("open");
    document.body.classList.remove("drawer-open");
  };
  const open=()=>{
    drawer.classList.add("open");
    shade.classList.add("open");
    document.body.classList.add("drawer-open");
  };

  btn.onclick=open;
  drawer.querySelector(".drawer-close").onclick=close;
  shade.onclick=close;
  drawer.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));

  const links=[...drawer.querySelectorAll("nav a")];
  const observer=new IntersectionObserver(entries=>{
    entries
      .filter(e=>e.isIntersecting)
      .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)
      .slice(0,1)
      .forEach(e=>{
        links.forEach(a=>a.classList.toggle("active",a.dataset.target===e.target.id));
      });
  },{rootMargin:"-25% 0px -65% 0px",threshold:[0,.1,.5]});

  MENU_ITEMS.forEach(([id])=>{
    const el=document.getElementById(id);
    if(el)observer.observe(el);
  });
}

function ensureTravelIcon(){
  const iconUrl="https://cdn-icons-png.flaticon.com/512/284/284489.png";
  if(!document.querySelector('link[rel="icon"]')){
    const favicon=document.createElement("link");
    favicon.rel="icon";
    favicon.type="image/png";
    favicon.href=iconUrl;
    document.head.appendChild(favicon);
  }
  if(!document.querySelector('link[rel="apple-touch-icon"]')){
    const apple=document.createElement("link");
    apple.rel="apple-touch-icon";
    apple.href=iconUrl;
    document.head.appendChild(apple);
  }
}

buildDrawer();
ensureTravelIcon();