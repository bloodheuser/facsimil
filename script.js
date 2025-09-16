/* ======= Estructura de datos ======= */
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

/* ======= Referencias DOM ======= */
const contentArea = document.getElementById('content-area');
const validationMessages = document.getElementById('validationMessages');

/* ======= Estado ======= */
let totalQuestions = 0;
let answers = {}; // key -> {value: 0|1|null, evidence: string, files: [names]}
const ID_USUARIO_ACTUAL = 1;

function computeScore(){
  return Object.values(answers).reduce((acc, v) => acc + (v.value === 1 ? 1 : 0), 0);
}

/* ======= Helpers ======= */
function keyFor(sectionKey, gi, ii){ return `${sectionKey}-${gi}-${ii}`; }

/* ======= Construcción de UI ======= */
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
          <div class="radio">
            <input type="radio" id="${k}-si" name="${k}" value="1" />
            <label for="${k}-si">Si</label>
          </div>
          <div class="radio">
            <input type="radio" id="${k}-no" name="${k}" value="0" />
            <label for="${k}-no">No</label>
          </div>
        `;

        row.appendChild(left);
        row.appendChild(right);

        const filecol = document.createElement('div');
        filecol.className = 'filecol';
        filecol.innerHTML = `
          <input type="text" class="evidence-input"
                 placeholder="Referencia a evidencia (ej. Acta N°3, marzo 2023)"
                 data-key="${k}">
          <input type="file" class="file-input" data-key="${k}" multiple>
        `;

        const wrap = document.createElement('div');
        wrap.appendChild(row);
        wrap.appendChild(filecol);
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

            enviarRespuesta(ID_USUARIO_ACTUAL, k, answers[k].value, answers[k].evidence, answers[k].files);
          });
        });

        const evInput = filecol.querySelector('.evidence-input');
        evInput.addEventListener('input',(e)=>{
          answers[k].evidence = e.target.value.trim();
          enviarRespuesta(ID_USUARIO_ACTUAL, k, answers[k].value, answers[k].evidence, answers[k].files);
        });

        const fInput = filecol.querySelector('.file-input');
        fInput.addEventListener('change',(e)=>{
          const names = Array.from(e.target.files).map(f=>f.name);
          answers[k].files = names;
          enviarRespuesta(ID_USUARIO_ACTUAL, k, answers[k].value, answers[k].evidence, answers[k].files);
        });
      });

      sectionWrap.appendChild(gEl);
    });

    contentArea.appendChild(sectionWrap);
  });

  updateScore();
  showSectionByActiveTab();
}

/* ======= Puntaje y niveles ======= */
function updateScore(){
  const score = computeScore();

  const sdScore = document.getElementById('sdScore');
  const sdMax = document.getElementById('sdMax');
  const sdLevel = document.getElementById('sdLevel');
  const sdBar = document.getElementById('sdBar');

  if (sdScore && sdMax && sdLevel && sdBar){
    sdScore.textContent = score;
    sdMax.textContent = totalQuestions;
    sdLevel.textContent = levelFromScore(score);
    const pct = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;
    sdBar.style.width = pct + '%';
  }
}

function levelFromScore(score){
  if(score <= 12) return 'Nivel Inicial';
  if(score <= 24) return 'Nivel Intermedio';
  return 'Nivel Avanzado (Reconocimiento Público)';
}

/* ======= Validación ======= */
function runValidation(){
  validationMessages.innerHTML = '';
  validationMessages.classList.remove('error','ok');

  let unanswered = 0;
  let missingEvidence = 0;

  document.querySelectorAll('.group').forEach(g => g.classList.remove('warn'));

  sections.forEach((section, si)=>{
    section.groups.forEach((g, gi)=>{
      let groupHasUnanswered = false;
      g.items.forEach((it, ii)=>{
        const k = keyFor(section.key, gi, ii);
        const v = answers[k] || {};
        if(v.value !== 0 && v.value !== 1){
          unanswered++;
          groupHasUnanswered = true;
        }
        if(v.value === 1 && (!v.evidence || v.evidence.trim()==='')){
          missingEvidence++;
          const el = document.querySelector(`.evidence-input[data-key="${k}"]`);
          if(el) el.style.borderColor = '#dc2626';
        }
      });
      if(groupHasUnanswered){
        const groups = document.querySelectorAll('.group');
        const idx = Array.from(groups).findIndex((el)=> el.querySelector('h3')?.textContent === g.group);
        if(idx > -1) groups[idx].classList.add('warn');
      }
    });
  });

  if(unanswered > 0 || missingEvidence > 0){
    validationMessages.classList.add('error');
    const parts = [];
    if(unanswered > 0) parts.push(`Hay ${unanswered} pregunta(s) sin responder. Selecciona “Sí” o “No”.`);
    if(missingEvidence > 0) parts.push(`Hay ${missingEvidence} respuesta(s) “Sí” sin evidencia.`);
    validationMessages.textContent = parts.join(' ');
    return false;
  } else {
    validationMessages.classList.add('ok');
    validationMessages.textContent = 'Validación OK — todas las preguntas tienen respuesta y las “Sí” tienen evidencia.';
    return true;
  }
}

/* ======= Exportar ======= */
function saveJSON(){
  const score = computeScore();
  const payload = {
    generatedAt: new Date().toISOString(),
    totalQuestions,
    summary: { score, level: levelFromScore(score) },
    answers: {}
  };
  for(const [k,v] of Object.entries(answers)){
    payload.answers[k] = { value: v.value, evidence: v.evidence || '', files: v.files || [] };
  }
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'autoevaluacion_facsimil.json'; a.click();
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
  const a = document.createElement('a');
  a.href = url; a.download = 'autoevaluacion_facsimil.csv'; a.click();
  URL.revokeObjectURL(url);
}

/* ======= Reset ======= */
function resetAll(){
  answers = {};
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((t,i)=> t.classList.toggle('active', i === 0));
  buildUI();
  validationMessages.textContent = '';
  validationMessages.classList.remove('error','ok');

  // Cierra el menú guardar si estaba abierto
  const saveMenu = document.getElementById('saveMenu');
  if (saveMenu) saveMenu.classList.remove('open');

  showSectionByActiveTab();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ======= Tabs ======= */
function setupTabs(){
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.section-wrap').forEach(sec => sec.style.display='none');
      const key = btn.getAttribute('data-tab');
      const sectionIndex = sections.findIndex(s => s.key === key);
      if(sectionIndex >= 0){
        const sectionEl = document.querySelectorAll('.section-wrap')[sectionIndex];
        if(sectionEl) sectionEl.style.display = 'block';
      }
    });
  });
  showSectionByActiveTab();
}
function showSectionByActiveTab(){
  const wraps = document.querySelectorAll('.section-wrap');
  wraps.forEach(sec => sec.style.display = 'none');
  const activeTab = document.querySelector('.tab.active') || document.querySelector('.tab');
  if(!activeTab){ if(wraps[0]) wraps[0].style.display = 'block'; return; }
  const key = activeTab.getAttribute('data-tab');
  const idx = sections.findIndex(s => s.key === key);
  const sectionEl = (idx >= 0) ? wraps[idx] : wraps[0];
  if(sectionEl) sectionEl.style.display = 'block';
}

/* ======= Backend (autosave por cambio) ======= */
function enviarRespuesta(idUsuario, idPregunta, respuesta, evidencia, archivos){
  fetch("http://localhost:3001/api/respuestas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_usuario: idUsuario,
      id_pregunta: idPregunta,
      respuesta,
      evidencia,
      archivos: (archivos || []).join(",")
    })
  })
  .then(res => res.json())
  .then(data => console.log("Guardado en la BD:", data))
  .catch(err => console.error("Error al guardar:", err));
}

/* ======= Init ======= */
buildUI();
setupTabs();

/* ======= Botones en el dock ======= */
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn   = document.getElementById('saveBtn');
const saveMenu  = document.getElementById('saveMenu');

if (cancelBtn) {
  cancelBtn.addEventListener('click', ()=>{
    if(confirm('¿Cancelar y limpiar el formulario?')) resetAll();
  });
}

if (saveBtn && saveMenu) {
  // Guardar: validar -> abrir menú JSON/CSV
  saveBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    const ok = runValidation();
    if(!ok){
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    saveMenu.classList.toggle('open');
    saveMenu.setAttribute('aria-hidden', String(!saveMenu.classList.contains('open')));
  });

  // Clic dentro del menú no lo cierra
  saveMenu.addEventListener('click', (e)=> e.stopPropagation());

  // Clic fuera: cierra menú
  document.addEventListener('click', (e)=>{
    if (!saveBtn.contains(e.target) && !saveMenu.contains(e.target)) {
      saveMenu.classList.remove('open');
      saveMenu.setAttribute('aria-hidden','true');
    }
  });

  // Acciones del menú (si quieres, puedes volver a validar aquí también)
  const btnSaveJson  = document.getElementById('saveJson');
  const btnExportCsv = document.getElementById('exportCsv');

  if (btnSaveJson) {
    btnSaveJson.addEventListener('click', (e)=>{
      e.stopPropagation();
      saveJSON();
      saveMenu.classList.remove('open');
      saveMenu.setAttribute('aria-hidden','true');
    });
  }
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', (e)=>{
      e.stopPropagation();
      exportCSV();
      saveMenu.classList.remove('open');
      saveMenu.setAttribute('aria-hidden','true');
    });
  }
}
