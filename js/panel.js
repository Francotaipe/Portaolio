const $=id=>document.getElementById(id);
const esc=v=>{const d=document.createElement("div");d.textContent=v??"";return d.innerHTML};
const typeIcon=n=>{const x=String(n||"").split(".").pop().toLowerCase();if(x==="pdf")return"PDF";if(["png","jpg","jpeg","gif","webp"].includes(x))return"IMG";if(["doc","docx"].includes(x))return"DOC";if(["zip","rar","7z"].includes(x))return"ZIP";return"FILE"};
const courseName=k=>k==="desarrollo"?"Desarrollo de Aplicaciones":"Algoritmos y Estructura de Datos";
const globalWeekNumber=(period,week)=>((Number(period)-1)*4)+Number(week);
function normalizeCourse(value){
  const s=String(value??"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  if(s.includes("desarrollo") && (s.includes("aplic") || s.includes("software") || s.includes("program")))return "desarrollo";
  if(s.includes("algorit") || s.includes("estructura") || s.includes("datos"))return "algoritmos";
  return String(value??"").trim();
}
function normalizeWorkRecord(w){return {...w,curso:normalizeCourse(w.curso)};}
let user=null,works=[],selectedCourse=null,selectedPeriod=null,selectedWeek=null,activityColumnAvailable=true;
const fmtDate=v=>v?new Date(v+"T00:00:00").toLocaleDateString("es-PE",{day:"2-digit",month:"short",year:"numeric"}):"";
const cleanTitle=v=>String(v??"").replace(/^actividad\s*#?\s*\d+\s*[-:–—]?\s*/i,"").trim();

function normalizeStoredText(value){
  if(value===null||value===undefined)return "";
  if(typeof value==="string"){
    const raw=value.trim();
    if(!raw)return "";
    // Compatibilidad con datos antiguos que pudieron quedar como JSON serializado.
    if((raw.startsWith("{")&&raw.endsWith("}"))||(raw.startsWith("[")&&raw.endsWith("]"))){
      try{
        const parsed=JSON.parse(raw);
        if(parsed&&typeof parsed==="object"){
          const candidate=parsed.nombre??parsed.nombre_trabajo??parsed.titulo??parsed.title??parsed.name;
          if(typeof candidate==="string"&&candidate.trim())return candidate.trim();
        }
      }catch(_e){}
    }
    return raw;
  }
  if(typeof value==="object"){
    const candidate=value.nombre??value.nombre_trabajo??value.titulo??value.title??value.name;
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

function workDisplayTitle(w){
  let title=cleanTitle(normalizeStoredText(w?.titulo));
  if(!isBadDisplayTitle(title))return title;
  const alt=cleanTitle(normalizeStoredText(w?.nombre??w?.nombre_trabajo));
  if(!isBadDisplayTitle(alt))return alt;
  return fileBaseName(w?.archivo_nombre)||"Trabajo";
}

function extractActivityNumber(t){
  const text=normalizeStoredText(t);
  const m=text.match(/\bactividad\s*#?\s*(\d+)\b/i);
  return m?Number(m[1]):null;
}

function activityNumber(w){
  const n=Number(w?.actividad);
  if(Number.isFinite(n)&&n>=1&&n<=5)return n;
  const fromTitle=extractActivityNumber(w?.titulo);
  return fromTitle&&fromTitle>=1&&fromTitle<=5?fromTitle:null;
}

// Reglas de actividades para la interfaz de carga.
// Algoritmos: Semana 1 = 2 actividades; Semana 2 = 1 actividad; Semana 3+ = hasta 5.
// Desarrollo: hasta 5 actividades por semana.
function activitiesForWeek(course,week){
  const w=Number(week);
  if(course==="algoritmos"){
    if(w===1)return [1,2];
    if(w===2)return [1];
  }
  return [1,2,3,4,5];
}

function setMsg(text,type=""){
  const e=$("uploadMsg");
  if(!e)return;
  e.textContent=text;
  e.className=`msg ${type}`;
}

function populateSelect(selectId,items,current="",placeholder="Selecciona..."){
  const s=$(selectId);if(!s)return;
  s.innerHTML=`<option value="">${placeholder}</option>`+items.map(x=>`<option value="${x.value}">${esc(x.label)}</option>`).join("");
  if(current!==""&&current!=null)s.value=String(current);
}

function populateWeeks(selectId,period,current=""){
  populateSelect(selectId,[1,2,3,4].map(n=>({value:n,label:`Semana ${globalWeekNumber(period,n)}`})),current,"Selecciona una semana");
}

function populateActivitySelect(selectId,course,week,current=""){
  const allowed=activitiesForWeek(course,week);
  const select=$(selectId);if(!select)return;
  select.innerHTML=`<option value="">Selecciona una actividad</option>`+allowed.map(n=>`<option value="${n}">Actividad ${n}</option>`).join("");
  if(current!==""&&allowed.includes(Number(current)))select.value=String(current);
  else if(allowed.length===1)select.value=String(allowed[0]);
}

function countWorks(course,period,week){
  return works.filter(w=>normalizeCourse(w.curso)===course&&Number(w.periodo)===Number(period)&&Number(w.semana)===Number(week));
}

function groupByActivity(rows){
  const map=new Map();
  const legacy=[];
  rows.forEach(w=>{
    const n=activityNumber(w);
    if(n===null){legacy.push(w);return;}
    if(!map.has(n))map.set(n,{activityNumber:n,items:[]});
    map.get(n).items.push(w);
  });
  const groups=[...map.values()].sort((a,b)=>a.activityNumber-b.activityNumber);
  if(legacy.length)groups.push({activityNumber:null,items:legacy,legacy:true});
  return groups;
}

function renderCourseExplorer(course){
  selectedCourse=course;selectedPeriod=null;selectedWeek=null;
  document.querySelectorAll(".course-select-card").forEach(b=>b.classList.toggle("active",b.dataset.course===course));
  const box=$("privateCourseExplorer");
  box.innerHTML=`<div class="explorer-head"><div><div class="panel-label">${course==="desarrollo"?"CURSO 01":"CURSO 02"}</div><h3>${courseName(course)}</h3><p>Selecciona un período y después una semana para administrar sus trabajos.</p></div><span class="course-count">${works.filter(w=>normalizeCourse(w.curso)===course).length} trabajos</span></div><div class="period-explorer" id="privatePeriodExplorer"></div>`;
  const explorer=$("privatePeriodExplorer");
  for(let p=1;p<=4;p++){
    const pCount=works.filter(w=>normalizeCourse(w.curso)===course&&Number(w.periodo)===p).length;
    const block=document.createElement("div");
    block.className="period-explorer-card";
    block.innerHTML=`<div class="period-explorer-head"><button class="period-select-button" type="button">Período ${p}</button><span>${pCount} ${pCount===1?"trabajo":"trabajos"}</span></div><div class="week-buttons-row"></div>`;
    const row=block.querySelector(".week-buttons-row");
    for(let w=1;w<=4;w++){
      const n=groupByActivity(countWorks(course,p,w)).length;
      const b=document.createElement("button");
      b.type="button";
      b.className="week-select-button";
      b.innerHTML=`<strong>Semana ${globalWeekNumber(p,w)}</strong><span>${n} ${n===1?"actividad":"actividades"}</span>`;
      row.appendChild(b);
      b.addEventListener("click",()=>{
        selectedPeriod=p;selectedWeek=w;
        explorer.querySelectorAll(".period-select-button").forEach(x=>x.classList.remove("active"));
        block.querySelector(".period-select-button").classList.add("active");
        explorer.querySelectorAll(".week-select-button").forEach(x=>x.classList.remove("active"));
        b.classList.add("active");
        showSelectedWeek();
      });
    }
    block.querySelector(".period-select-button").addEventListener("click",()=>{
      explorer.querySelectorAll(".period-select-button").forEach(x=>x.classList.remove("active"));
      block.querySelector(".period-select-button").classList.add("active");
    });
    explorer.appendChild(block);
  }
}

function showSelectedWeek(){
  if(!selectedCourse||!selectedPeriod||!selectedWeek)return;
  $("noSelectedWeek").classList.add("hidden");
  $("selectedWeekPanel").classList.remove("hidden");
  $("selectedWeekTitle").textContent=`${courseName(selectedCourse)} · Período ${selectedPeriod} · Semana ${globalWeekNumber(selectedPeriod,selectedWeek)}`;
  $("selectedWeekSub").textContent="Sube un trabajo nuevo. Para editarlo puedes cambiar su período, semana o actividad.";
  $("selectedInfo").textContent=`${courseName(selectedCourse)} · Período ${selectedPeriod} · Semana ${globalWeekNumber(selectedPeriod,selectedWeek)}`;
  $("fecha").value=new Date().toISOString().slice(0,10);
  populateActivitySelect("actividad",selectedCourse,selectedWeek);
  renderSelectedWeek();
  $("trabajos").scrollIntoView({behavior:"smooth",block:"start"});
}

function renderSelectedWeek(){
  const rows=countWorks(selectedCourse,selectedPeriod,selectedWeek);
  const groups=groupByActivity(rows);
  $("selectedWeekCount").textContent=`${groups.length} ${groups.length===1?"actividad":"actividades"}`;
  $("adminWeekList").innerHTML=groups.length?groups.map((group,i)=>`
    <section class="activity-block">
      <div class="activity-header">
        <div>
          <span class="activity-label">${group.legacy?"TRABAJOS ANTERIORES":`ACTIVIDAD ${group.activityNumber}`}</span>
          <h4>${group.legacy?"Trabajos anteriores":`Actividad ${group.activityNumber}`}</h4>
          <small class="activity-files-count">${group.items.length} ${group.items.length===1?"archivo":"archivos"} agrupados</small>
        </div>
        <span class="activity-number">${group.activityNumber||i+1}</span>
      </div>
      ${group.items.map(w=>`<article class="admin-row">
        <div class="file-type">${typeIcon(w.archivo_nombre)}</div>
        <div class="work-info">
          <strong>${esc(workDisplayTitle(w))}</strong>
          <span>${esc(normalizeStoredText(w.descripcion)||"Trabajo académico")} · ${fmtDate(w.fecha)}</span>
        </div>
        <div class="admin-actions">
          ${w.archivo_url?`<a class="btn-view" href="${esc(w.archivo_url)}" target="_blank" rel="noopener">Ver</a>`:""}
          <button class="btn-edit" data-id="${esc(w.id)}">Editar</button>
          <button class="btn-delete" data-id="${esc(w.id)}" data-url="${encodeURIComponent(w.archivo_url||"")}">Eliminar</button>
        </div>
      </article>`).join("")}
    </section>`).join(""):`<div class="empty-week">No hay trabajos registrados en esta semana. Usa el formulario de arriba para subir uno.</div>`;

  $("adminWeekList").querySelectorAll(".btn-edit").forEach(b=>b.addEventListener("click",()=>openEditWork(b.dataset.id)));
  $("adminWeekList").querySelectorAll(".btn-delete").forEach(b=>b.addEventListener("click",()=>deleteWork(b.dataset.id,decodeURIComponent(b.dataset.url))));
}

async function loadWorks(){
  let result=await supabaseClient.from("trabajos").select("id,curso,periodo,semana,actividad,titulo,descripcion,fecha,archivo_url,archivo_nombre,creado_en").eq("usuario_id",user.id).order("fecha",{ascending:false}).order("creado_en",{ascending:false});
  activityColumnAvailable=!result.error;
  if(result.error){
    result=await supabaseClient.from("trabajos").select("id,curso,periodo,semana,titulo,descripcion,fecha,archivo_url,archivo_nombre,creado_en").eq("usuario_id",user.id).order("fecha",{ascending:false}).order("creado_en",{ascending:false});
  }
  if(result.error){
    $("privateCourseExplorer").innerHTML=`<div class="empty-state"><h3>No se pudieron cargar tus trabajos</h3><p>${esc(result.error.message)}</p></div>`;
    return;
  }
  works=(result.data||[]).map(normalizeWorkRecord);
  $("totalAdmin").textContent=works.length;
  if(selectedCourse)renderCourseExplorer(selectedCourse);
  if(selectedCourse&&selectedPeriod&&selectedWeek)showSelectedWeek();
}

async function uploadWork(e){
  e.preventDefault();
  if(!selectedCourse||!selectedPeriod||!selectedWeek){setMsg("Selecciona curso, período y semana primero.","error");return;}
  const form=e.currentTarget,file=$("archivo").files[0];
  if(!file){setMsg("Selecciona un archivo.","error");return;}
  const activity=Number($("actividad").value);
  const allowedActivities=activitiesForWeek(selectedCourse,selectedWeek);
  const title=$("titulo").value.trim();
  if(!allowedActivities.includes(activity)){setMsg("Selecciona una actividad válida para esta semana.","error");return;}
  if(!title){setMsg("Escribe el nombre del trabajo.","error");return;}
  const btn=form.querySelector("button[type=submit]");
  btn.disabled=true;
  setMsg("Subiendo trabajo...");
  const description=$("descripcion").value.trim();
  const date=$("fecha").value||new Date().toISOString().slice(0,10);
  const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");
  const path=`${user.id}/${Date.now()}_${safe}`;

  const {error:upError}=await supabaseClient.storage.from("trabajos").upload(path,file,{cacheControl:"3600",upsert:false});
  if(upError){btn.disabled=false;setMsg("No se pudo subir: "+upError.message,"error");return;}

  const {data:urlData}=supabaseClient.storage.from("trabajos").getPublicUrl(path);

  // La columna actividad es la forma principal de separar las entregas.
  // Si el proyecto Supabase todavía no tiene esa columna (o su caché de esquema
  // aún no la reconoce), usamos una compatibilidad segura: guardamos el número
  // de actividad dentro del título. La interfaz lo oculta al mostrarlo y así
  // las actividades siguen quedando separadas sin tocar trabajos anteriores.
  let rowError=null;
  const payload={usuario_id:user.id,curso:selectedCourse,periodo:selectedPeriod,semana:selectedWeek,actividad,titulo,descripcion:description,fecha:date,archivo_url:urlData.publicUrl,archivo_nombre:file.name};
  if(activityColumnAvailable){
    rowError=(await supabaseClient.from("trabajos").insert(payload)).error;
  }
  if(rowError || !activityColumnAvailable){
    if(rowError && !/actividad|column|schema cache/i.test(rowError.message||"")){
      await supabaseClient.storage.from("trabajos").remove([path]);
      btn.disabled=false;
      setMsg("No se pudo guardar el trabajo: "+rowError.message,"error");
      return;
    }
    const legacyPayload={...payload};
    delete legacyPayload.actividad;
    legacyPayload.titulo=`Actividad ${activity} - ${title}`;
    const legacyResult=await supabaseClient.from("trabajos").insert(legacyPayload);
    rowError=legacyResult.error;
    activityColumnAvailable=false;
  }
  if(rowError){
    await supabaseClient.storage.from("trabajos").remove([path]);
    btn.disabled=false;
    setMsg("No se pudo guardar el trabajo: "+rowError.message,"error");
    return;
  }

  form.reset();
  $("fecha").value=new Date().toISOString().slice(0,10);
  btn.disabled=false;
  setMsg("Trabajo guardado correctamente.","success");
  await loadWorks();
}

function openEditWork(id){
  const w=works.find(item=>String(item.id)===String(id));
  if(!w)return;
  const activity=activityNumber(w);
  $("editId").value=w.id;
  populateSelect("editCurso",[
    {value:"desarrollo",label:"Desarrollo de Aplicaciones"},
    {value:"algoritmos",label:"Algoritmos y Estructura de Datos"}
  ],w.curso,"Selecciona un curso");
  populateSelect("editPeriodo",[1,2,3,4].map(n=>({value:n,label:`Período ${n}`})),w.periodo,"Selecciona un período");
  populateWeeks("editSemana",w.periodo,w.semana);
  populateActivitySelect("editActividad",w.curso,w.semana,activity);
  $("editTitulo").value=cleanTitle(normalizeStoredText(w.titulo))||fileBaseName(w.archivo_nombre);
  $("editFecha").value=w.fecha||"";
  $("editDescripcion").value=normalizeStoredText(w.descripcion);
  $("editMsg").textContent="";
  $("editMsg").className="msg";
  $("editModal").classList.remove("hidden");
  $("editModal").setAttribute("aria-hidden","false");
}

function closeEditWork(){
  $("editModal").classList.add("hidden");
  $("editModal").setAttribute("aria-hidden","true");
}

async function saveEditWork(e){
  e.preventDefault();
  const id=$("editId").value;
  const course=$("editCurso").value;
  const period=Number($("editPeriodo").value);
  const week=Number($("editSemana").value);
  const activity=Number($("editActividad").value);
  const name=$("editTitulo").value.trim();
  const date=$("editFecha").value||null;
  const description=$("editDescripcion").value.trim();
  const em=$("editMsg");
  const allowedActivities=activitiesForWeek(course,week);
  if(!course||!period||!week||!activity||!name||!allowedActivities.includes(activity)){
    em.textContent="Completa la ruta Período → Semana → Actividad y el nombre del trabajo.";
    em.className="msg error";
    return;
  }
  const btn=e.currentTarget.querySelector("button[type=submit]");
  btn.disabled=true;
  em.textContent="Guardando cambios...";
  em.className="msg";
  let error=null;
  const updatePayload={curso:course,periodo:period,semana:week,actividad,titulo:name,fecha,descripcion};
  if(activityColumnAvailable){
    error=(await supabaseClient.from("trabajos").update(updatePayload).eq("id",id).eq("usuario_id",user.id)).error;
  }
  if(error || !activityColumnAvailable){
    if(error && !/actividad|column|schema cache/i.test(error.message||"")){
      btn.disabled=false;
      em.textContent="No se pudo guardar: "+error.message;
      em.className="msg error";
      return;
    }
    const legacyPayload={curso:course,periodo:period,semana:week,titulo:`Actividad ${activity} - ${name}`,fecha,descripcion};
    error=(await supabaseClient.from("trabajos").update(legacyPayload).eq("id",id).eq("usuario_id",user.id)).error;
    activityColumnAvailable=false;
  }
  btn.disabled=false;
  if(error){em.textContent="No se pudo guardar: "+error.message;em.className="msg error";return;}
  closeEditWork();
  selectedCourse=course;selectedPeriod=period;selectedWeek=week;
  await loadWorks();
  showSelectedWeek();
}

async function deleteWork(id,url){
  if(!confirm("¿Seguro que deseas eliminar este trabajo?"))return;
  const {error:rowError}=await supabaseClient.from("trabajos").delete().eq("id",id).eq("usuario_id",user.id);
  if(rowError){alert("No se pudo eliminar el trabajo: "+rowError.message);return;}
  if(url){
    const marker="/storage/v1/object/public/trabajos/";
    const i=url.indexOf(marker);
    if(i!==-1){
      const path=decodeURIComponent(url.slice(i+marker.length));
      const {error:storageError}=await supabaseClient.storage.from("trabajos").remove([path]);
      if(storageError)console.warn("El registro se eliminó, pero el archivo físico no pudo borrarse:",storageError.message);
    }
  }
  await loadWorks();
  if(selectedCourse&&selectedPeriod&&selectedWeek)showSelectedWeek();
}

document.querySelectorAll(".course-select-card").forEach(b=>b.addEventListener("click",()=>renderCourseExplorer(b.dataset.course)));
$("uploadForm").addEventListener("submit",uploadWork);
$("editForm").addEventListener("submit",saveEditWork);
$("editClose").addEventListener("click",closeEditWork);
$("editCancel").addEventListener("click",closeEditWork);
$("editCurso").addEventListener("change",()=>{
  populateActivitySelect("editActividad",$("editCurso").value,$("editSemana").value,$("editActividad").value);
});
$("editPeriodo").addEventListener("change",()=>{
  const currentWeek=$("editSemana").value;
  populateWeeks("editSemana",Number($("editPeriodo").value)||1,currentWeek);
  populateActivitySelect("editActividad",$("editCurso").value,Number($("editSemana").value)||0);
});
$("editSemana").addEventListener("change",()=>populateActivitySelect("editActividad",$("editCurso").value,Number($("editSemana").value)||0));
$("editModal").addEventListener("click",e=>{if(e.target.id==="editModal")closeEditWork()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("editModal").classList.contains("hidden"))closeEditWork()});
$("logout").addEventListener("click",async()=>{await supabaseClient.auth.signOut();location.href="index.html"});

(async()=>{
  const {data}=await supabaseClient.auth.getUser();
  if(!data.user){location.href="login.html";return;}
  user=data.user;
  const name=user.user_metadata?.nombre||"Franco Taipe Quispe";
  $("userName").textContent=name;
  $("userNameHero").textContent=name.split(" ")[0];
  await loadWorks();
})();
