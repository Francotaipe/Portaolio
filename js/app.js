
const $ = id => document.getElementById(id);
const esc = value => { const e=document.createElement("div"); e.textContent=value??""; return e.innerHTML; };
const iconType = name => {
  const x=String(name||"").split(".").pop().toLowerCase();
  if(x==="pdf") return "PDF";
  if(["png","jpg","jpeg","gif","webp"].includes(x)) return "IMG";
  if(["doc","docx"].includes(x)) return "DOC";
  if(["zip","rar","7z"].includes(x)) return "ZIP";
  return "FILE";
};
const fmtDate = value => value ? new Date(value+"T00:00:00").toLocaleDateString("es-PE",{day:"2-digit",month:"short",year:"numeric"}) : "";
const courseName = key => key==="desarrollo" ? "Desarrollo de Aplicaciones" : "Algoritmos y Estructura de Datos";

// Compatibilidad con trabajos antiguos: no se modifican sus datos, solo se normalizan
// para poder mostrarlos aunque el nombre del curso haya cambiado ligeramente.
function normalizeCourse(value){
  const s=String(value??"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  if(s.includes("desarrollo") && (s.includes("aplic") || s.includes("software") || s.includes("program")))return "desarrollo";
  if(s.includes("algorit") || s.includes("estructura") || s.includes("datos"))return "algoritmos";
  return String(value??"").trim();
}

function normalizeWorkRecord(w){
  return {...w,curso:normalizeCourse(w.curso)};
}

let allWorks = [];
let selectedCourse = null;
let selectedPeriod = null;
let selectedWeek = null;


function normalizeStoredText(value){
  if(value===null||value===undefined)return "";
  if(typeof value==="string"){
    const raw=value.trim();
    if(!raw)return "";
    if((raw.startsWith("{")&&raw.endsWith("}"))||(raw.startsWith("[")&&raw.endsWith("]"))){
      try{
        const parsed=JSON.parse(raw);
        if(parsed&&typeof parsed==="object"){
          const candidate=parsed.enunciado??parsed.enunciado_actividad??parsed.nombre??parsed.nombre_trabajo??parsed.titulo??parsed.title??parsed.name;
          if(typeof candidate==="string"&&candidate.trim())return candidate.trim();
        }
      }catch(_e){}
    }
    return raw;
  }
  if(typeof value==="object"){
    const candidate=value.enunciado??value.enunciado_actividad??value.nombre??value.nombre_trabajo??value.titulo??value.title??value.name;
    if(typeof candidate==="string"&&candidate.trim())return candidate.trim();
  }
  return String(value);
}

function isBadDisplayTitle(value){
  const x=String(value||"").trim().toLowerCase();
  return !x || x==="{}" || x==="[object object]" || x==="null" || x==="undefined";
}

function fileBaseName(name){
  const x=String(name||"").trim();
  if(!x)return "";
  return x.replace(/\.[^.]+$/i,"").replace(/[_]+/g," ").trim();
}

function cleanTitle(value){
  return String(value??"").replace(/^actividad\s*#?\s*\d+\s*[-:–—]?\s*/i,"").trim();
}

function workDisplayTitle(w){
  let title=cleanTitle(normalizeStoredText(w?.titulo));
  if(!isBadDisplayTitle(title))return title;
  const alt=cleanTitle(normalizeStoredText(w?.enunciado??w?.nombre??w?.nombre_trabajo));
  if(!isBadDisplayTitle(alt))return alt;
  const desc=cleanTitle(normalizeStoredText(w?.descripcion));
  if(!isBadDisplayTitle(desc)&&desc.toLowerCase()!=="trabajo académico")return desc;
  return fileBaseName(w?.archivo_nombre)||"Trabajo";
}

function extractActivityNumber(value){
  const text=normalizeStoredText(value);
  const m=text.match(/\bactividad\s*#?\s*(\d+)\b/i);
  return m?Number(m[1]):null;
}

function activityNumber(w){
  const n=Number(w?.actividad);
  if(Number.isFinite(n)&&n>=1&&n<=5)return n;
  const fromTitle=extractActivityNumber(w?.titulo);
  return fromTitle&&fromTitle>=1&&fromTitle<=5?fromTitle:null;
}

function activitiesForWeek(course,week){
  const w=Number(week);
  if(course==="algoritmos"){
    if(w===1)return [1,2];
    if(w===2)return [1];
  }
  return [1,2,3,4,5];
}

function groupByActivity(rows,course,week){
  const allowed=activitiesForWeek(course,week);
  const map=new Map();
  const legacy=[];
  const extra=[];
  rows.forEach(w=>{
    const n=activityNumber(w);
    if(n===null){legacy.push(w);return;}
    if(!allowed.includes(n)){extra.push(w);return;}
    if(!map.has(n))map.set(n,{key:`actividad-${n}`,activityNumber:n,title:null,items:[]});
    map.get(n).items.push(w);
  });
  const groups=[...map.values()].sort((a,b)=>a.activityNumber-b.activityNumber);
  if(legacy.length)groups.push({key:"legacy",activityNumber:null,title:"Trabajos anteriores",items:legacy,legacy:true});
  if(extra.length)groups.push({key:"extra",activityNumber:null,title:"Trabajos adicionales",items:extra,extra:true});
  return groups;
}

function countFor(course, period, week) {
  return allWorks.filter(w =>
    normalizeCourse(w.curso)===course &&
    Number(w.periodo)===Number(period) &&
    Number(w.semana)===Number(week)
  );
}

function renderCourseExplorer(course) {
  selectedCourse = course;
  selectedPeriod = null;
  selectedWeek = null;

  document.querySelectorAll(".course-select-card").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.course===course)
  );

  const explorer = $("publicCourseExplorer");
  explorer.innerHTML = `
    <div class="explorer-head">
      <div>
        <div class="panel-label">${course==="desarrollo" ? "CURSO 01" : "CURSO 02"}</div>
        <h3>${courseName(course)}</h3>
        <p>Selecciona un período y luego una semana para consultar los trabajos.</p>
      </div>
      <span class="course-count">${allWorks.filter(w=>normalizeCourse(w.curso)===course).length} trabajos</span>
    </div>
    <div class="period-explorer" id="periodExplorer"></div>
  `;

  const periodExplorer = $("periodExplorer");
  for(let p=1;p<=4;p++){
    const pCount = allWorks.filter(w=>normalizeCourse(w.curso)===course && Number(w.periodo)===p).length;
    const block = document.createElement("div");
    block.className = "period-explorer-card";
    block.innerHTML = `
      <div class="period-explorer-head">
        <button class="period-select-button" data-period="${p}">Período ${p}</button>
        <span>${pCount} ${pCount===1?"trabajo":"trabajos"}</span>
      </div>
      <div class="week-buttons-row"></div>
    `;
    const row = block.querySelector(".week-buttons-row");

    for(let w=1;w<=4;w++){
      const n = groupByActivity(countFor(course,p,w),course,w).length;
      const btn = document.createElement("button");
      btn.className = "week-select-button";
      btn.dataset.period=p;
      btn.dataset.week=w;
      btn.innerHTML = `<strong>Semana ${w}</strong><span>${n} ${n===1?"actividad":"actividades"}</span>`;
      row.appendChild(btn);
      btn.addEventListener("click", ()=>{
        selectedPeriod=p;
        selectedWeek=w;
        row.querySelectorAll(".week-select-button").forEach(x=>x.classList.remove("active"));
        btn.classList.add("active");
        showPublicWeek(course,p,w);
      });
    }

    block.querySelector(".period-select-button").addEventListener("click", ()=>{
      periodExplorer.querySelectorAll(".period-select-button").forEach(x=>x.classList.remove("active"));
      block.querySelector(".period-select-button").classList.add("active");
    });

    periodExplorer.appendChild(block);
  }
}

function showPublicWeek(course, period, week) {
  const rows = countFor(course,period,week);
  const groups = groupByActivity(rows,course,week);
  $("publicNoWeek").classList.add("hidden");
  $("publicWeekDetail").classList.remove("hidden");
  $("publicWeekTitle").textContent = `${courseName(course)} · Período ${period} · Semana ${week}`;
  $("publicWeekSub").textContent = "Las actividades se separan por su actividad guardada. Los trabajos antiguos se muestran sin modificar.";
  $("publicWeekCount").textContent = `${groups.length} ${groups.length===1?"actividad":"actividades"}`;

  const list = $("publicWorkList");
  list.innerHTML = groups.length ? groups.map((group,i)=>`
    <section class="activity-block public-activity">
      <div class="activity-header">
        <div><span class="activity-label">${group.legacy?"TRABAJOS ANTERIORES":group.extra?"TRABAJOS ADICIONALES":`ACTIVIDAD ${group.activityNumber}`}</span><h4>${esc(group.legacy?"Trabajos anteriores":group.extra?"Trabajos adicionales":(workDisplayTitle(group.items[0])||`Actividad ${group.activityNumber}`))}</h4><small class="activity-files-count">${group.items.length} ${group.items.length===1?"archivo":"archivos"} en esta actividad</small></div>
        <span class="activity-number">${group.legacy?"↺":group.extra?"＋":group.activityNumber}</span>
      </div>
      ${group.items.map(w=>`<article class="work-row">
        <div class="file-type">${iconType(w.archivo_nombre)}</div>
        <div class="work-info">
          <strong>${esc(w.archivo_nombre||"Archivo")}</strong>
          <span>${esc(w.descripcion||"Trabajo académico")} · ${fmtDate(w.fecha)}</span>
        </div>
        <div class="work-actions">
          ${w.archivo_url
            ? `<a class="btn-view" href="${esc(w.archivo_url)}" target="_blank" rel="noopener">Ver</a>
               <a class="btn-download" href="${esc(w.archivo_url)}" target="_blank" rel="noopener" download>Descargar</a>`
            : `<span class="no-file">Sin archivo</span>`}
        </div>
      </article>`).join("")}
    </section>
  `).join("") : `<div class="empty-week">No hay trabajos registrados en esta semana.</div>`;

  $("trabajos").scrollIntoView({behavior:"smooth",block:"start"});
}

async function setupSessionUI() {
  if(!supabaseClient) return;
  const {data} = await supabaseClient.auth.getUser();
  if(!data.user) return;
  $("loginLink").textContent="Panel de trabajos";
  $("loginLink").href="panel.html";
  $("privateNav").href="panel.html";
  $("privateNav").innerHTML='<span class="nav-icon">✎</span>Panel privado';
}

async function load() {
  document.querySelectorAll(".course-select-card").forEach(btn =>
    btn.addEventListener("click", ()=>renderCourseExplorer(btn.dataset.course))
  );

  await setupSessionUI();

  let result=await supabaseClient.from("trabajos")
    .select("id,curso,periodo,semana,actividad,titulo,descripcion,fecha,archivo_url,archivo_nombre,creado_en")
    .order("fecha",{ascending:false})
    .order("creado_en",{ascending:false});
  if(result.error && /actividad|column/i.test(result.error.message||"")){
    result=await supabaseClient.from("trabajos")
      .select("id,curso,periodo,semana,titulo,descripcion,fecha,archivo_url,archivo_nombre,creado_en")
      .order("fecha",{ascending:false})
      .order("creado_en",{ascending:false});
  }
  const {data,error}=result;

  if(error){
    $("publicCourseExplorer").innerHTML=`<div class="empty-state"><h3>No se pudieron cargar los trabajos</h3><p>${esc(error.message)}</p></div>`;
    return;
  }

  allWorks=(data||[]).map(normalizeWorkRecord);
  $("totalWorks").textContent=allWorks.length;
  $("totalPeriods").textContent=new Set(allWorks.map(w=>`${w.curso}-${w.periodo}`)).size;
  $("totalWeeks").textContent=new Set(allWorks.map(w=>`${w.curso}-${w.semana}`)).size;
}
load();
