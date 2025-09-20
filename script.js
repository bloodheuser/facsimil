/* =======================================================
   DEMO MULTI-ORG / MULTI-USUARIO (sin backend por ahora)
   ======================================================= */
const ADMIN_DEMO_KEY = 'admin123';

const LS_ORGS = 'facsimil.orgs';
const LS_SESSION = 'facsimil.session';
const LS_ACTIVE_TAB = 'facsimil.activeTab';

function lsGet(key, def){ try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } }
function lsSet(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function uid(){ return Math.random().toString(36).slice(2,10); }

function getSession(){ return lsGet(LS_SESSION, null); }
function setSession(sess){ lsSet(LS_SESSION, sess); }
function clearSession(){ localStorage.removeItem(LS_SESSION); }
function getOrgs(){ return lsGet(LS_ORGS, []); }
function setOrgs(orgs){ lsSet(LS_ORGS, orgs); }

function currentApprovedOrg(){
  const sess = getSession();
  if(!sess) return null;
  const org = getOrgs().find(o => o.id === sess.orgId);
  if(!org || org.estado !== 'aprobada') return null;
  return org;
}

/* =======================================================
   SECCIONES DEL FORMULARIO (COMPLETO)
   ======================================================= */
const sections = [
  {
    key: "transparencia",
    title: "Transparencia",
    groups: [
      {
        group: "Directorio de la Organización",
        items: [
          { q: "¿El Directorio de la Organización se eligió cumpliendo con el proceso eleccionario establecido en la Ley 19.418?", evidencia: "Certificado de vigencia del Servicio de Registro Civil" },
          { q: "¿En la última elección del Directorio, se eligió, igual número de suplentes en relación a los titulares?", evidencia: "Certificado de vigencia del Servicio de Registro Civil y Estatuto" },
          { q: "¿El Directorio de la organización es el mismo que el establecido en el estatuto de la organización?", evidencia: "Estatuto, Acta de la elección" },
          { q: "¿Los miembros del Directorio cumplen con las funciones establecidas en el estatuto de la organización?", evidencia: "Libro de actas del Directorio, Libro de actas asamblea" },
          { q: "¿El Directorio de la organización propone a la asamblea, en el mes de marzo el plan anual de actividades y el presupuesto de ingresos y gastos?", evidencia: "Libro de actas, Acuerdo asamblea" },
          { q: "¿El Directorio de la organización colabora con el presidente(a) en la ejecución de los acuerdos?", evidencia: "Actas de reunión del Directorio" }
        ]
      },
      {
        group: "Asambleas de la Organización",
        items: [
          { q: "¿Las asambleas ordinarias y extraordinarias son convocadas cumpliendo con la normativa vigente?", evidencia: "Convocatorias (Presidente, dos miembros del directorio, 25% afiliados)" },
          { q: "¿Las asambleas cumplen con el quórum para su funcionamiento?", evidencia: "Acta y registros de socios participantes, Estatuto" },
          { q: "¿Las actas de Asamblea son elaboradas por el/la secretario(a) de la organización?", evidencia: "Actas elaboradas y firmadas por el/la secretario(a)" },
          { q: "¿Las actas de asamblea se informan a los afiliados de la organización?", evidencia: "Publicación en redes sociales; Facebook, WSP, ficheros, etc." },
          { q: "¿Las asambleas extraordinarias se convocan cumpliendo la normativa y estatuto?", evidencia: "Actas de asambleas extraordinarias" },
          { q: "¿La Asamblea general elige anualmente la Comisión fiscalizadora de finanzas?", evidencia: "Acta de Asamblea" },
          { q: "¿El estatuto de la organización establece con claridad la periodicidad de las asambleas ordinarias?", evidencia: "Estatuto de la organización" },
          { q: "¿La postulación a proyectos de la organización es aprobada mediante acuerdo de Asamblea?", evidencia: "Acta de asamblea" }
        ]
      },
      {
        group: "Registro de Afiliados y Acceso a Libros",
        items: [
          { q: "¿La organización lleva registro público de todos sus afiliados, en la forma y condiciones que determinen sus estatutos?", evidencia: "Concordancia entre Estatuto y Registros de afiliados" },
          { q: "¿El registro de afiliados es actualizado y presentado en el mes de marzo en la Secretaría Municipal?", evidencia: "Registro de ingresos en la Secretaría Municipal" },
          { q: "¿El/la secretario(a) de la organización ha fijado días y horas de atención de los afiliados para consultar el registro de afiliados?", evidencia: "Comunicado, Acta de asamblea" },
          { q: "En proceso eleccionario, ¿se entrega copia actualizada y autorizada del registro de afiliados a los candidatos(as) por lo menos con un mes de anticipación?", evidencia: "Registro del Secretario de la organización entregando" },
          { q: "¿Los afiliados o miembros de la organización tienen acceso a los libros de actas y contabilidad de la organización?", evidencia: "Art 12 Ley 19.418; Registro del Secretario y Tesorero" }
        ]
      }
    ]
  },
  {
    key: "rendicion",
    title: "Rendición de Cuentas",
    groups: [
      {
        group: "Rendición de Cuentas según normativa",
        items: [
          { q: "¿La presidencia rinde cuenta anual a la asamblea del manejo e inversión de los recursos y del funcionamiento general de la organización?", evidencia: "Acta de asamblea" },
          { q: "¿El Directorio colabora con la presidencia en la elaboración de la cuenta anual?", evidencia: "Actas de reunión del Directorio" },
          { q: "¿La comisión fiscalizadora revisa las cuentas e informa a la asamblea general sobre balance, inventario y contabilidad?", evidencia: "Acta de asamblea, Acta conformación de la Comisión, Informe Comisión" },
          { q: "¿La organización tiene al día la rendición de cuentas de proyectos postulados a fuentes de financiamiento externo (subvenciones)?", evidencia: "Acta de asamblea, Rendición de cuentas" },
          { q: "¿Conoce la Resolución 30 de Contraloría que fija normas sobre Rendición de Cuentas?", evidencia: "Declaración simple" },
          { q: "¿El Tesorero cumple con mantener no más de dos unidades tributarias mensuales en caja en efectivo?", evidencia: "Informe Tesorero(a)" }
        ]
      }
    ]
  },
  {
    key: "participacion",
    title: "Participación Ciudadana",
    groups: [
      {
        group: "Participación Ciudadana",
        items: [
          { q: "¿La organización y afiliados han participado en proceso de elaboración de instrumentos de planificación comunal (PLADECO, Plan Regulador, plan de inversiones)?", evidencia: "Acta de Asamblea informando; Declaración jurada simple" },
          { q: "¿La organización y afiliados han participado en la implementación de mecanismos de participación ciudadana según la Ordenanza de Participación Ciudadana?", evidencia: "Acta de Asamblea; Declaración jurada simple" },
          { q: "¿La asamblea ha recibido capacitación sobre la Ley de Junta de Vecinos o de la Ordenanza de Participación Ciudadana?", evidencia: "Acta de Asamblea; Declaración jurada simple" },
          { q: "¿En Asamblea se han presentado iniciativas, proyectos o proposición de estudio al Directorio con el patrocinio del 10% de los afiliados?", evidencia: "Acta de Asamblea; Iniciativas" },
          { q: "¿Los socios colaboran permanentemente en la implementación del Plan Anual de Trabajo?", evidencia: "Acta de Asambleas" },
          { q: "¿Se ha realizado alguna capacitación sobre Desarrollo Sostenible en el marco de la Agenda 2030?", evidencia: "Acta de Asamblea; Acta de reunión abierta a la comunidad" }
        ]
      }
    ]
  },
  {
    key: "colaboracion",
    title: "Colaboración e Innovación",
    groups: [
      {
        group: "Colaboración e Innovación Ciudadana",
        items: [
          { q: "¿La organización pertenece a alguna Unión Comunal o Agrupación?", evidencia: "Actas de reunión del Directorio" },
          { q: "En situaciones complejas (desastres, emergencias), ¿la organización colabora con socios y vecinos del territorio?", evidencia: "Actas de reunión del Directorio" },
          { q: "¿La organización presenta proyectos o iniciativas a la autoridad local, regional o de Gobierno?", evidencia: "Actas de reunión del Directorio" },
          { q: "¿El Directorio ha recibido capacitación en temas relativos a alfabetización digital?", evidencia: "Actas de reunión del Directorio" },
          { q: "¿El Directorio informa a la Asamblea sobre los temas tratados en reuniones con autoridades locales o de gobierno?", evidencia: "Actas de Asamblea" }
        ]
      }
    ]
  }
];

/* =======================================================
   REFERENCIAS DOM Y ESTADO
   ======================================================= */
const contentArea = document.getElementById('content-area');
const validationMessages = document.getElementById('validationMessages');
const saveMenu = document.getElementById('saveMenu');        // menú original (oculto visualmente)
const saveBtn = document.getElementById('saveBtn');          // botón original (oculto)
const cancelBtn = document.getElementById('cancelBtn');      // botón original (oculto)

/* Dock elements */
const saveMenuDock = document.getElementById('saveMenuDock');
const saveBtnDock = document.getElementById('saveBtnDock');
const cancelBtnDock = document.getElementById('cancelBtnDock');

let totalQuestions = 0;
let answers = {}; // key -> { value:0|1|null, evidence:string, files:[] }

/* =======================================================
   HELPERS
   ======================================================= */
function keyFor(sectionKey, gi, ii){ return `${sectionKey}-${gi}-${ii}`; }
function computeScore(){ return Object.values(answers).reduce((acc, v) => acc + (v.value === 1 ? 1 : 0), 0); }

function resetActiveTab(){ localStorage.removeItem(LS_ACTIVE_TAB); }
function resetDock(){
  const sdScore = document.getElementById('sdScore');
  const sdMax   = document.getElementById('sdMax');
  const sdLevel = document.getElementById('sdLevel');
  const sdBar   = document.getElementById('sdBar');
  if (sdScore) sdScore.textContent = '0';
  if (sdMax)   sdMax.textContent   = '0';
  if (sdLevel) sdLevel.textContent = '-';
  if (sdBar)   sdBar.style.width   = '0%';
}

/* ===== Tabs dinámicos a partir de sections[] + ICONOS ===== */
const TAB_ICONS = {
  transparencia: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M10 14l2-2 2 2m-2-2V8"/></svg>`,
  rendicion: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg>`,
  participacion: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/></svg>`,
  colaboracion: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.18a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.18a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
};

function getActiveTabKey() {
  const k = localStorage.getItem(LS_ACTIVE_TAB);
  if (k && sections.some(s => s.key === k)) return k;
  return sections[0]?.key || null;
}
function setActiveTabKey(key) { localStorage.setItem(LS_ACTIVE_TAB, key); }

function buildTabs() {
  const tabsWrap = document.getElementById('tabs');
  if (!tabsWrap) return;
  tabsWrap.innerHTML = '';

  const activeKey = getActiveTabKey();
  sections.forEach((sec) => {
    const btn = document.createElement('button');
    btn.className = 'tab' + (sec.key === activeKey ? ' active' : '');
    btn.setAttribute('data-tab', sec.key);
    const icon = TAB_ICONS[sec.key] || '';
    btn.innerHTML = `${icon}<span>${sec.title}</span>`;
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tabs .tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      setActiveTabKey(sec.key);
      showSectionByActiveTab();
    });
    tabsWrap.appendChild(btn);
  });
}

/* =======================================================
   BUILD UI
   ======================================================= */
function buildUI(){
  contentArea.innerHTML = '';
  totalQuestions = 0;

  sections.forEach(section => {
    const sectionWrap = document.createElement('div');
    sectionWrap.className = 'section-wrap';
    sectionWrap.style.display = 'none';

    const title = document.createElement('h2');
    title.textContent = section.title;
    sectionWrap.appendChild(title);

    section.groups.forEach((g, gi) => {
      const gEl = document.createElement('div');
      gEl.className = 'group';
      const hg = document.createElement('h3');
      hg.textContent = g.group;
      gEl.appendChild(hg);

      g.items.forEach((it, ii) => {
        const k = keyFor(section.key, gi, ii);
        totalQuestions++;
        if(!answers[k]) answers[k] = { value:null, evidence:'', files:[] };

        const row = document.createElement('div');
        row.className = 'item';

        const left = document.createElement('div');
        left.innerHTML = `
          <div class="question">${it.q}</div>
          <div class="evidence-hint">Evidencia sugerida: ${it.evidencia}</div>
        `;

        const right = document.createElement('div');
        right.className = 'yn';
        right.innerHTML = `
          <div class="radio"><input type="radio" id="${k}-si" name="${k}" value="1"><label for="${k}-si">Si</label></div>
          <div class="radio"><input type="radio" id="${k}-no" name="${k}" value="0"><label for="${k}-no">No</label></div>
        `;

        row.appendChild(left); row.appendChild(right);

        const filecol = document.createElement('div');
        filecol.className = 'filecol';
        filecol.innerHTML = `
          <input type="text" class="evidence-input" placeholder="Referencia a evidencia (ej. Acta N°3, marzo 2023)" data-key="${k}">
          <input type="file" class="file-input" data-key="${k}" multiple>
        `;

        const wrap = document.createElement('div');
        wrap.appendChild(row); wrap.appendChild(filecol);
        gEl.appendChild(wrap);

        // Radios
        right.querySelectorAll('input[type=radio]').forEach(r => {
          r.addEventListener('change',(e)=>{
            answers[k].value = parseInt(e.target.value,10);
            updateScore();
            const ev = filecol.querySelector('.evidence-input');
            if (answers[k].value === 1) {
              filecol.classList.add('active');
              ev.style.borderColor = (!ev.value.trim()) ? '#f59e0b' : 'var(--border)';
            } else {
              filecol.classList.remove('active');
              ev.value = '';
              answers[k].evidence = '';
              answers[k].files = [];
            }
          });
        });

        // Evidencia
        filecol.querySelector('.evidence-input').addEventListener('input',(e)=>{
          answers[k].evidence = e.target.value.trim();
        });

        // Archivos
        filecol.querySelector('.file-input').addEventListener('change',(e)=>{
          answers[k].files = Array.from(e.target.files).map(f=>f.name);
        });
      });
      sectionWrap.appendChild(gEl);
    });
    contentArea.appendChild(sectionWrap);
  });

  updateScore();
  showSectionByActiveTab();
}

/* =======================================================
   SCORE DOCK
   ======================================================= */
function updateScore(){
  const score = computeScore();
  const sdScore = document.getElementById('sdScore');
  const sdMax = document.getElementById('sdMax');
  const sdLevel = document.getElementById('sdLevel');
  const sdBar = document.getElementById('sdBar');

  if (sdScore){
    sdScore.textContent = score;
    sdMax.textContent = totalQuestions;
    sdLevel.textContent = levelFromScore(score);
    const pct = totalQuestions ? Math.round((score/totalQuestions)*100) : 0;
    sdBar.style.width = pct+'%';
  }
}
function levelFromScore(score){
  if(score <= 12) return 'Nivel Inicial';
  if(score <= 24) return 'Nivel Intermedio';
  return 'Nivel Avanzado (Reconocimiento Público)';
}

/* =======================================================
   VALIDATION
   ======================================================= */
function runValidation(){
  validationMessages.innerHTML = '';
  let unanswered = 0, missingEvidence = 0;
  document.querySelectorAll('.group').forEach(g => g.classList.remove('warn'));

  sections.forEach((section)=>{
    section.groups.forEach((g, gi)=>{
      let groupHasUnanswered = false;
      g.items.forEach((it, ii)=>{
        const k = keyFor(section.key, gi, ii);
        const v = answers[k] || {};
        if(v.value !== 0 && v.value !== 1){ unanswered++; groupHasUnanswered = true; }
        if(v.value === 1 && (!v.evidence || v.evidence.trim()==='')){ missingEvidence++; }
      });
      if(groupHasUnanswered){
        // marca el grupo por título
        document.querySelectorAll('.group').forEach(gr => {
          if (gr.querySelector('h3')?.textContent === g.group) gr.classList.add('warn');
        });
      }
    });
  });

  if(unanswered > 0 || missingEvidence > 0){
    validationMessages.style.color = '#b91c1c';
    const parts = [];
    if(unanswered > 0) parts.push(`Hay ${unanswered} pregunta(s) sin responder. Selecciona “Sí” o “No”.`);
    if(missingEvidence > 0) parts.push(`Hay ${missingEvidence} respuesta(s) “Sí” sin evidencia.`);
    validationMessages.textContent = parts.join(' ');
    return false;
  } else {
    validationMessages.style.color = '#065f46';
    validationMessages.textContent = 'Validación OK — todas las preguntas tienen respuesta y las “Sí” tienen evidencia.';
    return true;
  }
}

/* =======================================================
   EXPORT JSON / CSV
   ======================================================= */
function saveJSON(){
  const payload = {
    generatedAt: new Date().toISOString(),
    totalQuestions,
    summary: {
      score: computeScore(),
      level: levelFromScore(computeScore())
    },
    answers: {}
  };
  for(const [k,v] of Object.entries(answers)){
    payload.answers[k] = { value: v.value, evidence: v.evidence || '', files: v.files || [] };
  }
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'autoevaluacion_facsimil.json'; a.click();
  URL.revokeObjectURL(url);
}
function exportCSV(){
  const header = ['item','seccion','grupo','pregunta','respuesta','evidencia','archivos'];
  const lines = [header.join(',')];
  sections.forEach(section=>{
    section.groups.forEach((g,gi)=>{
      g.items.forEach((it,ii)=>{
        const k = keyFor(section.key, gi, ii);
        const a = answers[k] || {};
        const row = [
          `"${k}"`,
          `"${section.title}"`,
          `"${g.group}"`,
          `"${it.q.replace(/"/g,'""')}"`,
          (a.value===1 ? 'Si' : a.value===0 ? 'No' : ''),
          `"${(a.evidence||'').replace(/"/g,'""')}"`,
          `"${(a.files||[]).join(';').replace(/"/g,'""')}"`,
        ];
        lines.push(row.join(','));
      });
    });
  });
  const csv = lines.join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'autoevaluacion_facsimil.csv'; a.click();
  URL.revokeObjectURL(url);
}

/* =======================================================
   RESET / TABS
   ======================================================= */
function resetAll(){
  answers = {};
  resetActiveTab();
  buildTabs();
  buildUI();
  if (validationMessages) validationMessages.textContent = '';
  if (saveMenu) saveMenu.classList.remove('open');
  if (saveMenuDock) saveMenuDock.classList.remove('open');
  resetDock();
  window.scrollTo({top:0,behavior:'smooth'});
}

function setupTabs(){ /* listeners ya se crean en buildTabs() */ }

function showSectionByActiveTab(){
  const wraps = document.querySelectorAll('.section-wrap');
  wraps.forEach(sec => sec.style.display='none');

  const activeKey = getActiveTabKey();
  const idx = sections.findIndex(s => s.key === activeKey);
  const el = (idx >= 0) ? wraps[idx] : wraps[0];
  if (el) el.style.display = 'block';
}

/* =======================================================
   TOPBAR USER
   ======================================================= */
function refreshTopbarUser(){
  const sess = getSession();
  const org  = currentApprovedOrg();
  const logoutBtn = document.getElementById('logoutBtn');
  const topOrgName = document.getElementById('topOrgName');
  const topUserLabel = document.getElementById('topUserLabel');

  if (org && sess){
    if (topOrgName) topOrgName.textContent = org.razon || 'Organización aprobada';
    if (topUserLabel) topUserLabel.textContent = (sess.email || 'USER');
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
  } else {
    if (topOrgName) topOrgName.textContent = 'Organización Comunitaria';
    if (topUserLabel) topUserLabel.textContent = 'USER';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

/* =======================================================
   APP / GATE
   ======================================================= */
function showApp(){
  document.getElementById('authGate').style.display='none';
  document.getElementById('appMain').style.display='block';

  if (!localStorage.getItem(LS_ACTIVE_TAB) && sections[0]) setActiveTabKey(sections[0].key);
  buildTabs();
  buildUI();
  setupTabs();
  refreshTopbarUser();
}
function showGate(){
  document.getElementById('appMain').style.display='none';
  document.getElementById('authGate').style.display='block';
  refreshTopbarUser();
}
function checkSessionAndRender(){
  const org = currentApprovedOrg();
  if(org){ showApp(); } else { showGate(); }
}
document.addEventListener('DOMContentLoaded', ()=>{
  checkSessionAndRender();
  refreshTopbarUser();
});

/* =======================================================
   BOTONES: Guardar/Cancelar (originales + DOCK)
   ======================================================= */
function onCancel(){
  if(confirm('¿Cancelar y limpiar el formulario?')) resetAll();
}
function onSaveClick(menuEl){
  const ok = runValidation();
  if(!ok){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  // Toggle del menú asociado (puede ser el original o el del dock)
  if (!menuEl) return;
  menuEl.classList.toggle('open');
  menuEl.setAttribute('aria-hidden', !menuEl.classList.contains('open'));
}

/* Originales (ocultos, pero funcionales) */
if (cancelBtn) cancelBtn.addEventListener('click', onCancel);
if (saveBtn) saveBtn.addEventListener('click', ()=> onSaveClick(saveMenu));
if (document.getElementById('saveJson'))
  document.getElementById('saveJson').addEventListener('click', ()=>{ saveJSON(); saveMenu.classList.remove('open'); });
if (document.getElementById('exportCsv'))
  document.getElementById('exportCsv').addEventListener('click', ()=>{ exportCSV(); saveMenu.classList.remove('open'); });

/* Dock */
if (cancelBtnDock) cancelBtnDock.addEventListener('click', onCancel);
if (saveBtnDock) saveBtnDock.addEventListener('click', ()=> onSaveClick(saveMenuDock));
if (document.getElementById('saveJsonDock'))
  document.getElementById('saveJsonDock').addEventListener('click', ()=>{ saveJSON(); saveMenuDock.classList.remove('open'); });
if (document.getElementById('exportCsvDock'))
  document.getElementById('exportCsvDock').addEventListener('click', ()=>{ exportCSV(); saveMenuDock.classList.remove('open'); });

/* Cerrar menús al clickear fuera (aplica a ambos) */
document.addEventListener('click', (e)=>{
  const clickInsideAnyMenu =
    (saveMenu && saveMenu.contains(e.target)) ||
    (saveMenuDock && saveMenuDock.contains(e.target)) ||
    (e.target === saveBtn) || (e.target === saveBtnDock);

  if (!clickInsideAnyMenu){
    if (saveMenu) saveMenu.classList.remove('open');
    if (saveMenuDock) saveMenuDock.classList.remove('open');
  }
});

/* =======================================================
   CERRAR SESIÓN
   ======================================================= */
const logoutBtnEl = document.getElementById('logoutBtn');
if (logoutBtnEl){
  logoutBtnEl.addEventListener('click', ()=>{
    if (!confirm('¿Cerrar sesión?')) return;

    clearSession();
    resetActiveTab();

    answers = {};
    if (validationMessages) validationMessages.textContent = '';
    if (saveMenu) saveMenu.classList.remove('open');
    if (saveMenuDock) saveMenuDock.classList.remove('open');

    const tabsWrap = document.getElementById('tabs');
    const content  = document.getElementById('content-area');
    if (tabsWrap) tabsWrap.innerHTML = '';
    if (content)  content.innerHTML  = '';
    resetDock();

    showGate();
    refreshTopbarUser();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =======================================================
   AUTH GATE: Registro, Login, Admin DEMO
   ======================================================= */
const orgRegisterForm=document.getElementById('orgRegisterForm');
if(orgRegisterForm){
  orgRegisterForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const fd=new FormData(orgRegisterForm);
    const orgs=getOrgs();
    const orgId=uid();
    const newOrg={
      id:orgId, razon:fd.get('razon').trim(), rut:fd.get('rut').trim(),
      dom_org:fd.get('dom_org').trim(),
      representante:{ run:fd.get('rep_run').trim(), nombre:fd.get('rep_nombre').trim(), dom:fd.get('rep_dom').trim() },
      estado:'pendiente',
      usuarios:[{ email:fd.get('email').trim().toLowerCase(), nombre:fd.get('rep_nombre').trim(), role:'owner', pass:fd.get('pass')}],
      createdAt:new Date().toISOString()
    };
    orgs.push(newOrg); setOrgs(orgs); orgRegisterForm.reset();
    alert('Organización inscrita. Queda en estado PENDIENTE hasta aprobación de administrador.');
  });
}

const loginForm=document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const fd=new FormData(loginForm);
    const email=fd.get('email').trim().toLowerCase();
    const pass=fd.get('pass');
    const orgs=getOrgs(); let found=null,org=null;
    for(const o of orgs){ const u=(o.usuarios||[]).find(u=>u.email===email&&u.pass===pass); if(u){found=u;org=o;break;} }
    if(!found){ alert('Credenciales inválidas.'); return; }
    if(org.estado!=='aprobada'){ alert('Organización aún no aprobada por el administrador.'); return; }
    setSession({orgId:org.id,email:found.email,role:found.role});
    loginForm.reset(); checkSessionAndRender();
  });
}

const adminForm=document.getElementById('adminForm');
const adminPanel=document.getElementById('adminPanel');
const adminLogout=document.getElementById('adminLogout');
const pendingList=document.getElementById('pendingList');

function renderPending(){
  const orgs=getOrgs(); const pend=orgs.filter(o=>o.estado==='pendiente');
  if(pend.length===0){ pendingList.innerHTML='Sin pendientes…'; return; }
  pendingList.innerHTML=pend.map(o=>`
    <div class="pending-item">
      <div><b>${o.razon}</b> — RUT: ${o.rut}</div>
      <div class="muted">Rep: ${o.representante.nombre} (${o.representante.run})</div>
      <div class="pending-actions">
        <button class="btn tiny success" data-approve="${o.id}">Aprobar</button>
        <button class="btn tiny danger" data-reject="${o.id}">Rechazar</button>
      </div>
    </div>`).join('');
}

if(adminForm){
  adminForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const key=new FormData(adminForm).get('adminkey');
    if(key===ADMIN_DEMO_KEY){ adminPanel.classList.remove('hidden'); renderPending(); }
    else alert('Clave admin inválida (usa "admin123" en DEMO).');
  });
}
if(adminLogout){
  adminLogout.addEventListener('click',()=>{ adminPanel.classList.add('hidden'); });
}
if(pendingList){
  pendingList.addEventListener('click',(e)=>{
    const ap=e.target.getAttribute('data-approve'); const rj=e.target.getAttribute('data-reject');
    if(!ap&&!rj) return;
    const orgs=getOrgs(); const id=ap||rj; const idx=orgs.findIndex(o=>o.id===id); if(idx===-1) return;
    orgs[idx].estado=ap?'aprobada':'rechazada'; orgs[idx].updatedAt=new Date().toISOString();
    setOrgs(orgs); renderPending();
    alert(`Organización ${ap?'APROBADA':'RECHAZADA'}: ${orgs[idx].razon}`);
  });
}
