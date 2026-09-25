const stations=[
{name:"AIR Malayalam",loc:"Kerala",type:"news",icon:"📻",stream:"https://airmalayalam-lh.akamaihd.net/i/airmalayalam_1@507816/master.m3u8"},
{name:"Akashvani Kochi",loc:"Kochi",type:"fm",icon:"📻",stream:""},
{name:"FM Rainbow Kochi",loc:"Kochi 107.5 FM",type:"fm",icon:"🌈",stream:"https://air.pc.cdn.bitgravity.com/air/live/pbaudio044/playlist.m3u8"},
{name:"Akashvani Kannur",loc:"Kannur",type:"fm",icon:"📻",stream:""},
{name:"Akashvani Calicut",loc:"Kozhikode",type:"news",icon:"📻",stream:""},
{name:"Akashvani Kozhikode Real FM",loc:"Kozhikode",type:"fm",icon:"📻",stream:""},
{name:"Akashvani Manjeri",loc:"Manjeri",type:"fm",icon:"📻",stream:""},
{name:"Akashvani Thrissur",loc:"Thrissur",type:"fm",icon:"📻",stream:""},
{name:"Akashvani Kerala",loc:"Kerala",type:"news",icon:"📻",stream:""},
{name:"Akashvani Devikulam",loc:"Devikulam",type:"fm",icon:"📻",stream:""},
{name:"VB Malayalam",loc:"Kerala",type:"music",icon:"🎙️",stream:""},
{name:"Club FM 94.3",loc:"Kochi",type:"music",icon:"🎙️",stream:""},
{name:"Radio Mango 91.9",loc:"Kochi",type:"music",icon:"🥭",stream:""},
{name:"Red FM 93.5",loc:"Kochi",type:"music",icon:"🔴",stream:""},
{name:"Radio Mirchi",loc:"Kochi",type:"music",icon:"🎧",stream:""},
{name:"Jaihind Radio",loc:"Kerala",type:"news",icon:"📡",stream:""},
{name:"Kairali FM",loc:"Thiruvananthapuram",type:"talk",icon:"📻",stream:""},
{name:"Mathrubhumi Radio",loc:"Kerala",type:"news",icon:"📰",stream:""}
];

const audio=document.querySelector("#audio"),grid=document.querySelector("#grid");
let current=-1,hls=null;

function render(list=stations){
 grid.innerHTML=list.map(s=>{const i=stations.indexOf(s);return `<article class="card">
 <div class="top"><span class="tag">LIVE</span><span>🇮🇳</span></div>
 <div class="logo">${s.icon}</div><h3>${s.name}</h3><p>${s.loc}</p>
 <div class="bottom"><span class="un" id="u${i}"></span><button class="mini" onclick="playStation(${i})">▶</button></div>
 </article>`}).join("");
}

function stopCurrent(){
 if(hls){hls.destroy();hls=null}
 audio.pause();audio.removeAttribute("src");audio.load();
}

function unavailable(i){
 document.querySelector("#status").textContent="UNAVAILABLE";
 document.querySelector("#play").textContent="▶";
 const m=document.querySelector("#u"+i); if(m)m.textContent="Unavailable";
 alert("Live stream is currently unavailable for this station.");
}

window.playStation=function(i){
 current=i; const s=stations[i];
 document.querySelector("#name").textContent=s.name;
 document.querySelector("#location").textContent=s.loc;
 document.querySelector("#art").textContent=s.icon;
 document.querySelector("#now").textContent=s.name;
 document.querySelector("#status").textContent="CONNECTING";
 document.querySelector("#play").textContent="⏳";
 stopCurrent();

 if(!s.stream){unavailable(i);return}

 const start=()=>audio.play().then(()=>{
   document.querySelector("#status").textContent="LIVE";
   document.querySelector("#play").textContent="⏸";
 }).catch(()=>unavailable(i));

 if(s.stream.endsWith(".m3u8")){
   if(window.Hls && Hls.isSupported()){
     hls=new Hls({enableWorker:true});
     hls.loadSource(s.stream);
     hls.attachMedia(audio);
     hls.on(Hls.Events.MANIFEST_PARSED,start);
     hls.on(Hls.Events.ERROR,(e,d)=>{if(d.fatal)unavailable(i)});
   }else if(audio.canPlayType("application/vnd.apple.mpegurl")){audio.src=s.stream;start()}
   else unavailable(i);
 }else{audio.src=s.stream;start()}
};

document.querySelector("#play").onclick=()=>{
 if(current<0){playStation(0);return}
 if(!audio.src && !hls){playStation(current);return}
 if(audio.paused)audio.play().then(()=>{document.querySelector("#status").textContent="LIVE";document.querySelector("#play").textContent="⏸"}).catch(()=>unavailable(current));
 else{audio.pause();document.querySelector("#play").textContent="▶";document.querySelector("#status").textContent="PAUSED"}
};
audio.addEventListener("error",()=>{if(current>=0)unavailable(current)});
document.querySelector("#volume").oninput=e=>audio.volume=e.target.value;
document.querySelector("#theme").onclick=()=>document.body.classList.toggle("dark");
document.querySelector("#search").oninput=e=>{const q=e.target.value.toLowerCase();render(stations.filter(s=>(s.name+" "+s.loc).toLowerCase().includes(q)))};
document.querySelectorAll(".filters button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");const f=b.dataset.f;render(f==="all"?stations:stations.filter(s=>s.type===f))});
document.querySelector("#prev").onclick=()=>{if(current>0)playStation(current-1)};
document.querySelector("#next").onclick=()=>{if(current<stations.length-1)playStation(current+1)};
render();
