/* =======================================================
   DEMO MULTI-ORG / MULTI-USUARIO + TEMA + DOCK + PENDIENTES
   (Sin backend por ahora)
   ======================================================= */
   // === RUT utils (frontend) ===
function rutClean(str=''){
  return (str || '').toString().trim().replace(/[.\s]/g,'').replace(/-/g,'').toLowerCase();
}
function rutSplit(str){
  const clean = rutClean(str);
  if(!clean) return { cuerpo:null, dv:null };
  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);
  if(!/^\d+$/.test(cuerpo) || !/^[0-9k]$/.test(dv)) return { cuerpo:null, dv:null };
  return { cuerpo, dv };
}
function rutDV(cuerpoStr){
  // Módulo 11
  let num = parseInt(cuerpoStr,10);
  if(!Number.isFinite(num)) return null;
  let s=1, m=0;
  while (num>0){
    s = (s + (num % 10) * (9 - (m % 6))) % 11;
    m++; num = Math.floor(num/10);
  }
  return (s===0) ? 'k' : String(s-1);
}
function rutIsValid(str){
  const { cuerpo, dv } = rutSplit(str);
  if(!cuerpo || !dv) return false;
  return rutDV(cuerpo) === dv;
}
function rutFormat(str){
  const { cuerpo, dv } = rutSplit(str);
  if(!cuerpo || !dv) return '';
  // agrega puntos cada 3 y guion final
  let c = cuerpo.replace(/^0+/,'');
  let out = '';
  while (c.length > 3){
    out = '.' + c.slice(-3) + out;
    c = c.slice(0, -3);
  }
  out = c + out;
  return `${out}-${dv}`;
}

// === Adjunta comportamiento a inputs con id "rut" y "rep_run" ===
function attachRutBehavior(inputId){
  const el = document.getElementById(inputId);
  if(!el) return;
  const errorId = `${inputId}-err`;
  let err = document.getElementById(errorId);
  if(!err){
    err = document.createElement('div');
    err.id = errorId;
    err.style.fontSize = '12px';
    err.style.color = '#b91c1c';
    err.style.marginTop = '4px';
    el.insertAdjacentElement('afterend', err);
  }
  el.setAttribute('inputmode','numeric');
  el.setAttribute('autocomplete','off');
  el.setAttribute('maxlength','12'); // “12.345.678-5”

  el.addEventListener('input', () => {
    const raw = rutClean(el.value);
    const cuerpo = raw.slice(0, Math.max(0, raw.length - 1)).slice(-9); // hasta 9 dígitos
    const dv = raw.slice(-1);
    if(!cuerpo){ err.textContent = ''; return; }
    if(!/^[0-9k]$/.test(dv)) { err.textContent = ''; el.value = rutFormat(cuerpo + (dv||'')); return; }
    el.value = rutFormat(cuerpo + dv);
    err.textContent = '';
  });

  el.addEventListener('blur', () => {
    if(!el.value) { err.textContent = ''; return; }
    if(!rutIsValid(el.value)){
      err.textContent = 'RUT inválido. Revisa el dígito verificador.';
      el.focus();
    } else {
      el.value = rutFormat(el.value);
      err.textContent = '';
    }
  });
}

const ADMIN_DEMO_KEY = 'admin123';

const LS_ORGS = 'facsimil.orgs';
const LS_SESSION = 'facsimil.session';
const LS_ACTIVE_TAB = 'facsimil.activeTab';
const LS_THEME = 'facsimil.theme'; // light | dark
const LS_LANG  = 'facsimil.lang';  // es | en
function getLang(){ return lsGet(LS_LANG, 'es'); }
function setLang(l){
  const v = (l === 'en') ? 'en' : 'es';
  lsSet(LS_LANG, v);
  document.documentElement.setAttribute('lang', v === 'en' ? 'en' : 'es');
}

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
   I18N mínimo — ES/EN (solo tabs/formulario/validación)
   ======================================================= */
const I18N_TABS = {
  es: { transparencia:'Transparencia', rendicion:'Rendición de Cuentas', participacion:'Participación Ciudadana', colaboracion:'Colaboración e Innovación' },
  en: { transparencia:'Transparency',   rendicion:'Accountability',       participacion:'Citizen Participation', colaboracion:'Collaboration & Innovation' }
};

// Traducción de grupos, preguntas y evidencias (ES->EN). Si no existe en EN, retorna ES.
const I18N_FORM_EN = {
  groups:{
    'Directorio de la Organización':'Organization Board',
    'Asambleas de la Organización':'Organization Assemblies',
    'Registro de Afiliados y Acceso a Libros':'Member Registry & Book Access',
    'Rendición de Cuentas según normativa':'Accountability per Regulations',
    'Participación Ciudadana':'Citizen Participation',
    'Colaboración e Innovación Ciudadana':'Citizen Collaboration & Innovation'
  },
  q:{
    '¿El Directorio de la Organización se eligió cumpliendo con el proceso eleccionario establecido en la Ley 19.418?':'Was the Organization Board elected following the election process established by Law 19.418?',
    '¿En la última elección del Directorio, se eligió, igual número de suplentes en relación a los titulares?':'In the last Board election, was an equal number of alternates elected relative to main members?',
    '¿El Directorio de la organización es el mismo que el establecido en el estatuto de la organización?':'Is the current Board the same as established in the organization’s bylaws?',
    '¿Los miembros del Directorio cumplen con las funciones establecidas en el estatuto de la organización?':'Do Board members fulfill the functions defined in the bylaws?',
    '¿El Directorio de la organización propone a la asamblea, en el mes de marzo el plan anual de actividades y el presupuesto de ingresos y gastos?':'Does the Board propose the annual activity plan and income/expense budget to the Assembly in March?',
    '¿El Directorio de la organización colabora con el presidente(a) en la ejecución de los acuerdos?':'Does the Board collaborate with the President in executing resolutions?',

    '¿Las asambleas ordinarias y extraordinarias son convocadas cumpliendo con la normativa vigente?':'Are ordinary and extraordinary assemblies convened in compliance with current regulations?',
    '¿Las asambleas cumplen con el quórum para su funcionamiento?':'Do assemblies meet quorum requirements for operation?',
    '¿Las actas de Asamblea son elaboradas por el/la secretario(a) de la organización?':'Are Assembly minutes prepared by the organization’s secretary?',
    '¿Las actas de asamblea se informan a los afiliados de la organización?':'Are Assembly minutes communicated to the organization’s members?',
    '¿Las asambleas extraordinarias se convocan cumpliendo la normativa y estatuto?':'Are extraordinary assemblies convened according to regulations and bylaws?',
    '¿La Asamblea general elige anualmente la Comisión fiscalizadora de finanzas?':'Does the General Assembly annually elect the Finance Oversight Committee?',
    '¿El estatuto de la organización establece con claridad la periodicidad de las asambleas ordinarias?':'Do the bylaws clearly define the frequency of ordinary assemblies?',
    '¿La postulación a proyectos de la organización es aprobada mediante acuerdo de Asamblea?':'Are project applications approved by an Assembly resolution?',

    '¿La organización lleva registro público de todos sus afiliados, en la forma y condiciones que determinen sus estatutos?':'Does the organization keep a public registry of all members as determined by its bylaws?',
    '¿El registro de afiliados es actualizado y presentado en el mes de marzo en la Secretaría Municipal?':'Is the member registry updated and submitted in March to the Municipal Office?',
    '¿El/la secretario(a) de la organización ha fijado días y horas de atención de los afiliados para consultar el registro de afiliados?':'Has the secretary set days and hours for members to consult the registry?',
    'En proceso eleccionario, ¿se entrega copia actualizada y autorizada del registro de afiliados a los candidatos(as) por lo menos con un mes de anticipación?':'During elections, is an updated and certified copy of the member registry provided to candidates at least one month in advance?',
    '¿Los afiliados o miembros de la organización tienen acceso a los libros de actas y contabilidad de la organización?':'Do members have access to the organization’s minute and accounting books?',

    '¿La presidencia rinde cuenta anual a la asamblea del manejo e inversión de los recursos y del funcionamiento general de la organización?':'Does the presidency present an annual report to the Assembly on resource management, investment, and overall functioning?',
    '¿El Directorio colabora con la presidencia en la elaboración de la cuenta anual?':'Does the Board collaborate with the presidency in preparing the annual account?',
    '¿La comisión fiscalizadora revisa las cuentas e informa a la asamblea general sobre balance, inventario y contabilidad?':'Does the oversight committee review accounts and report to the General Assembly on balance, inventory, and accounting?',
    '¿La organización tiene al día la rendición de cuentas de proyectos postulados a fuentes de financiamiento externo (subvenciones)?':'Is the organization up-to-date with accountability for projects funded by external sources (grants)?',
    '¿Conoce la Resolución 30 de Contraloría que fija normas sobre Rendición de Cuentas?':'Are you aware of Comptroller Resolution 30 setting accountability standards?',
    '¿El Tesorero cumple con mantener no más de dos unidades tributarias mensuales en caja en efectivo?':'Does the Treasurer keep no more than two monthly tax units (UTM) in cash?',

    '¿La organización y afiliados han participado en proceso de elaboración de instrumentos de planificación comunal (PLADECO, Plan Regulador, plan de inversiones)?':'Have the organization and members participated in drafting communal planning instruments (PLADECO, Regulatory Plan, investment plan)?',
    '¿La organización y afiliados han participado en la implementación de mecanismos de participación ciudadana según la Ordenanza de Participación Ciudadana?':'Have the organization and members participated in implementing citizen participation mechanisms per the ordinance?',
    '¿La asamblea ha recibido capacitación sobre la Ley de Junta de Vecinos o de la Ordenanza de Participación Ciudadana?':'Has the Assembly received training on the Neighborhood Council Law or the Citizen Participation Ordinance?',
    '¿En Asamblea se han presentado iniciativas, proyectos o proposición de estudio al Directorio con el patrocinio del 10% de los afiliados?':'Have initiatives/projects/study proposals been presented to the Board with sponsorship of 10% of members?',
    '¿Los socios colaboran permanentemente en la implementación del Plan Anual de Trabajo?':'Do members consistently collaborate in implementing the Annual Work Plan?',
    '¿Se ha realizado alguna capacitación sobre Desarrollo Sostenible en el marco de la Agenda 2030?':'Has any training on Sustainable Development been conducted within the 2030 Agenda framework?',

    '¿La organización pertenece a alguna Unión Comunal o Agrupación?':'Does the organization belong to any Communal Union or Association?',
    'En situaciones complejas (desastres, emergencias), ¿la organización colabora con socios y vecinos del territorio?':'In complex situations (disasters, emergencies), does the organization collaborate with members and local neighbors?',
    '¿La organización presenta proyectos o iniciativas a la autoridad local, regional o de Gobierno?':'Does the organization submit projects or initiatives to local, regional, or Government authorities?',
    '¿El Directorio ha recibido capacitación en temas relativos a alfabetización digital?':'Has the Board received training on digital literacy?',
    '¿El Directorio informa a la Asamblea sobre los temas tratados en reuniones con autoridades locales o de gobierno?':'Does the Board inform the Assembly about topics discussed with local or government authorities?'
  },
  ev:{
    'Certificado de vigencia del Servicio de Registro Civil':'Civil Registry certificate of validity',
    'Certificado de vigencia del Servicio de Registro Civil y Estatuto':'Civil Registry certificate of validity and Bylaws',
    'Estatuto, Acta de la elección':'Bylaws, Election Minutes',
    'Libro de actas del Directorio, Libro de actas asamblea':'Board Minutes Book, Assembly Minutes Book',
    'Libro de actas, Acuerdo asamblea':'Minutes Book, Assembly Agreement',
    'Actas de reunión del Directorio':'Board meeting minutes',
    'Convocatorias (Presidente, dos miembros del directorio, 25% afiliados)':'Calls (President, two board members, 25% of members)',
    'Acta y registros de socios participantes, Estatuto':'Minutes and participating members logs, Bylaws',
    'Actas elaboradas y firmadas por el/la secretario(a)':'Minutes prepared and signed by the Secretary',
    'Publicación en redes sociales; Facebook, WSP, ficheros, etc.':'Publication on social networks; Facebook, WhatsApp, notice boards, etc.',
    'Actas de asambleas extraordinarias':'Extraordinary assembly minutes',
    'Acta de Asamblea':'Assembly Minutes',
    'Estatuto de la organización':'Organization Bylaws',
    'Acta de asamblea':'Assembly Minutes',
    'Concordancia entre Estatuto y Registros de afiliados':'Consistency between Bylaws and Member Registry',
    'Registro de ingresos en la Secretaría Municipal':'Filing record at the Municipal Office',
    'Comunicado, Acta de asamblea':'Notice, Assembly Minutes',
    'Registro del Secretario de la organización entregando':'Secretary’s delivery record',
    'Art 12 Ley 19.418; Registro del Secretario y Tesorero':'Law 19.418 Art.12; Secretary and Treasurer registry',
    'Acta de asamblea, Acta conformación de la Comisión, Informe Comisión':'Assembly Minutes, Committee formation minutes, Committee report',
    'Acta de asamblea, Rendición de cuentas':'Assembly Minutes, Accountability report',
    'Declaración simple':'Simple statement',
    'Informe Tesorero(a)':'Treasurer’s report',
    'Acta de Asamblea informando; Declaración jurada simple':'Assembly minutes informing; Sworn statement',
    'Acta de Asamblea; Declaración jurada simple':'Assembly minutes; Sworn statement',
    'Acta de Asamblea; Iniciativas':'Assembly minutes; Initiatives',
    'Acta de Asambleas':'Assembly minutes',
    'Acta de asamblea; Acta de reunión abierta a la comunidad':'Assembly minutes; Open community meeting minutes',
    'Actas de Asamblea':'Assembly minutes'
    
  }
  
};
const I18N_HELP = {
  es: {
    title: '¿Necesitas ayuda?',
    closeAria: 'Cerrar ayuda',
    faqTitle: 'Preguntas frecuentes',
    q1: '¿Cómo adjunto evidencia?',
    a1: 'Responde “Sí” y se abrirá el campo de evidencia y archivos. Describe brevemente la fuente y adjunta documentos.',
    q2: '¿Por qué no se guarda en el servidor?',
    a2: 'Esta demo guarda local y permite exportar JSON/CSV. El guardado en servidor se activa cuando conectemos el backend.',
    q3: '¿Qué significa el nivel (Inicial/Intermedio/Avanzado)?',
    a3: 'Es una guía del grado de cumplimiento según tus respuestas “Sí”.',
    q4: 'No veo todas las preguntas',
    a4: 'Revisa la pestaña (tab) activa o desplázate. En móvil, las pestañas se mueven horizontalmente.',
    contactTitle: '¿Sigue tu duda? Escríbenos',
    emailLabel: 'Correo de contacto',
    emailPh: 'tu@correo.cl',
    msgLabel: 'Describe tu problema',
    msgPh: 'Cuéntanos qué sucede…',
    cancel: 'Cancelar',
    send: 'Enviar'
  },
  en: {
    title: 'Need help?',
    closeAria: 'Close help',
    faqTitle: 'Frequently asked questions',
    q1: 'How do I attach evidence?',
    a1: 'Choose “Yes” and the evidence and files fields will appear. Briefly describe the source and attach documents.',
    q2: 'Why doesn’t it save to the server?',
    a2: 'This demo saves locally and lets you export JSON/CSV. Server-side saving will work when we connect the backend.',
    q3: 'What does the level (Initial/Intermediate/Advanced) mean?',
    a3: 'It’s a guideline of compliance based on your “Yes” answers.',
    q4: 'I can’t see all questions',
    a4: 'Check the active tab or scroll. On mobile, tabs are horizontally scrollable.',
    contactTitle: 'Still stuck? Contact us',
    emailLabel: 'Contact email',
    emailPh: 'you@example.com',
    msgLabel: 'Describe your issue',
    msgPh: 'Tell us what’s happening…',
    cancel: 'Cancel',
    send: 'Send'
  }
};
// Traducción del modal de confirmación (Cancelar formulario)
const I18N_CANCEL = {
  es: {
    title: '¿Cancelar y limpiar el formulario?',
    msg: 'Se borrarán todas las respuestas y evidencias. ¿Deseas continuar?',
    no: 'No, continuar',
    yes: 'Sí, cancelar',
  },
  en: {
    title: 'Cancel and clear the form?',
    msg: 'All answers and evidence will be erased. Do you wish to continue?',
    no: 'No, keep editing',
    yes: 'Yes, cancel',
  }
};

function updateCancelModalTexts() {
  const t = I18N_CANCEL[getLang()] || I18N_CANCEL.es;
  const $ = (id) => document.getElementById(id);

  $('#cancelTitle')?.replaceChildren(document.createTextNode(t.title));
  $('#cancelModal .modal-body p')?.replaceChildren(document.createTextNode(t.msg));
  $('#cancelNo')?.replaceChildren(document.createTextNode(t.no));
  $('#cancelYes')?.replaceChildren(document.createTextNode(t.yes));
}

function updateHelpModalTexts(){
  const t = I18N_HELP[getLang()] || I18N_HELP.es;
  const $ = (id)=> document.getElementById(id);

  $('#helpTitle')?.replaceChildren(document.createTextNode(t.title));
  $('#helpClose')?.setAttribute('aria-label', t.closeAria);

  $('#helpFaqTitle')?.replaceChildren(document.createTextNode(t.faqTitle));
  $('#helpQ1')?.replaceChildren(document.createTextNode(t.q1));
  $('#helpA1')?.replaceChildren(document.createTextNode(t.a1));
  $('#helpQ2')?.replaceChildren(document.createTextNode(t.q2));
  $('#helpA2')?.replaceChildren(document.createTextNode(t.a2));
  $('#helpQ3')?.replaceChildren(document.createTextNode(t.q3));
  $('#helpA3')?.replaceChildren(document.createTextNode(t.a3));
  $('#helpQ4')?.replaceChildren(document.createTextNode(t.q4));
  $('#helpA4')?.replaceChildren(document.createTextNode(t.a4));

  $('#helpContactTitle')?.replaceChildren(document.createTextNode(t.contactTitle));
  $('#helpEmailLabel')?.replaceChildren(document.createTextNode(t.emailLabel));
  $('#helpEmail')?.setAttribute('placeholder', t.emailPh);
  $('#helpMsgLabel')?.replaceChildren(document.createTextNode(t.msgLabel));
  $('#helpMsg')?.setAttribute('placeholder', t.msgPh);

  $('#helpCancel')?.replaceChildren(document.createTextNode(t.cancel));
  $('#helpSendBtn')?.replaceChildren(document.createTextNode(t.send));
}

function tabTitle(key, fallback){ return (I18N_TABS[getLang()]?.[key]) || fallback; }
function groupTitle(es){ return (getLang()==='en' ? (I18N_FORM_EN.groups[es] || es) : es); }
function qText(es){ return (getLang()==='en' ? (I18N_FORM_EN.q[es] || es) : es); }
function evText(es){ return (getLang()==='en' ? (I18N_FORM_EN.ev[es] || es) : es); }
function pctLabel(p){ return getLang()==='en' ? `${p}% completed` : `${p}% completado`; }

// === RUT utils ===
function limpiaRut(rut) {
  return (rut || '')
    .toString()
    .replace(/[^0-9kK]/g, '')
    .toUpperCase();
}

function formateaRut(rut) {
  const limpio = limpiaRut(rut);
  if (limpio.length === 0) return '';

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  if (!cuerpo) return dv;

  let invertido = cuerpo.split('').reverse().join('');
  let conPuntos = invertido.replace(/(\d{3})(?=\d)/g, '$1.');
  conPuntos = conPuntos.split('').reverse().join('');

  return `${conPuntos}-${dv}`;
}

function calculaDV(cuerpo) {
  let suma = 0, multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = (multiplo === 7) ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return '0';
  if (resto === 10) return 'K';
  return String(resto);
}

function validaRut(rut) {
  const limpio = limpiaRut(rut);
  if (limpio.length < 2) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (!/^\d{7,8}$/.test(cuerpo)) return false;

  return calculaDV(cuerpo) === dv;
}

function wireRutInput(inputEl) {
  if (!inputEl) return;

  inputEl.addEventListener('input', () => {
    const pos = inputEl.selectionStart;
    const antes = inputEl.value;
    inputEl.value = formateaRut(antes);
    const delta = inputEl.value.length - antes.length;
    const newPos = Math.max(0, (pos || 0) + delta);
    inputEl.setSelectionRange(newPos, newPos);
  });

  inputEl.addEventListener('blur', () => {
    const ok = validaRut(inputEl.value);
    inputEl.dataset.valid = ok ? 'true' : 'false';
    inputEl.classList.toggle('is-invalid', !ok);
    inputEl.classList.toggle('is-valid', ok);
  });
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

/* Dock elements */
const saveMenuDock = document.getElementById('saveMenuDock');
const saveBtnDock = document.getElementById('saveBtnDock');
const cancelBtnDock = document.getElementById('cancelBtnDock');
const dockToggle = document.getElementById('dockToggle');

let totalQuestions = 0;
let answers = {}; // key -> { value:0|1|null, evidence:string, files:[] }

// Pendientes (para la hoja)
let lastUnansweredItems = [];      // [{k, section, group, q}]
let lastMissingEvidenceItems = []; // [{k, section, group, q}]

/* =======================================================
   HELPERS & TABS STATE
   ======================================================= */
function keyFor(sectionKey, gi, ii){ return `${sectionKey}-${gi}-${ii}`; }
function computeScore(){ return Object.values(answers).reduce((acc, v) => acc + (v.value === 1 ? 1 : 0), 0); }
function computeAnsweredCount(){ return Object.values(answers).reduce((acc, v) => acc + ((v.value===0 || v.value===1) ? 1 : 0), 0); }

function resetActiveTab(){ localStorage.removeItem(LS_ACTIVE_TAB); }

function getActiveTabKey() {
  const k = localStorage.getItem(LS_ACTIVE_TAB);
  if (k && sections.some(s => s.key === k)) return k;
  return sections[0]?.key || null;
}
function setActiveTabKey(key) { localStorage.setItem(LS_ACTIVE_TAB, key); }

function resetDock(){
  const sdScore = document.getElementById('sdScore');
  const sdMax   = document.getElementById('sdMax');
  const sdLevel = document.getElementById('sdLevel');
  const sdBar   = document.getElementById('sdBar');
  const sdPct   = document.getElementById('sdPct');

  if (sdScore) sdScore.textContent = '0';
  if (sdMax)   sdMax.textContent   = totalQuestions.toString();
  if (sdLevel) sdLevel.textContent = '-';
  if (sdBar)   sdBar.style.width   = '0%';
  if (sdPct){
    sdPct.textContent = pctLabel(0);
    sdPct.classList.remove('is-low','is-mid','is-high');
    sdPct.classList.add('is-low');
  }
}

/* ===== Tabs dinámicos a partir de sections[] + ICONOS ===== */
const TAB_ICONS = {
  transparencia: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M10 14l2-2 2 2m-2-2V8"/></svg>`,
  rendicion: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg>`,
  participacion: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/></svg>`,
  colaboracion: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1z"/></svg>`
};

function buildTabs() {
  const tabsWrap = document.getElementById('tabs');
  if (!tabsWrap) return;
  tabsWrap.innerHTML = '';

  // ARIA tablist
  tabsWrap.setAttribute('role','tablist');
  tabsWrap.setAttribute('aria-label','Secciones del formulario');

  const activeKey = getActiveTabKey();
  sections.forEach((sec) => {
    const btn = document.createElement('button');
    const isActive = (sec.key === activeKey);

    btn.className = 'tab' + (isActive ? ' active' : '');
    btn.setAttribute('data-tab', sec.key);

    // Accesibilidad
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    btn.setAttribute('tabindex', isActive ? '0' : '-1');
    btn.id = `tab-${sec.key}`;

    const icon = TAB_ICONS[sec.key] || '';
    btn.innerHTML = `${icon}<span>${tabTitle(sec.key, sec.title)}</span>`;

    // Click clásico
    btn.addEventListener('click', () => activateTab(sec.key));

    // Enter/Espacio activan el tab
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateTab(sec.key);
      }
    });

    tabsWrap.appendChild(btn);
  });
}

function activateTab(key){
  setActiveTabKey(key);
  document.querySelectorAll('#tabs .tab').forEach(t => {
    const isThis = t.getAttribute('data-tab') === key;
    t.classList.toggle('active', isThis);
    t.setAttribute('aria-selected', isThis ? 'true' : 'false');
    t.setAttribute('tabindex', isThis ? '0' : '-1');
  });
  showSectionByActiveTab();
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
    title.textContent = tabTitle(section.key, section.title);
    sectionWrap.appendChild(title);

    section.groups.forEach((g, gi) => {
      const gEl = document.createElement('div');
      gEl.className = 'group';
      const hg = document.createElement('h3');
      hg.textContent = groupTitle(g.group);
      gEl.appendChild(hg);

      g.items.forEach((it, ii) => {
        const k = keyFor(section.key, gi, ii);
        totalQuestions++;
        if(!answers[k]) answers[k] = { value:null, evidence:'', files:[] };

        const row = document.createElement('div');
        row.className = 'item';

        const left = document.createElement('div');
        left.innerHTML = `
        <div class="question">${qText(it.q)}</div>
        <div class="evidence-hint">${getLang()==='en'?'Suggested evidence':'Evidencia sugerida'}: ${evText(it.evidencia)}</div>
      `;

        const right = document.createElement('div');
        right.className = 'yn';
        right.innerHTML = `
          <div class="radio"><input type="radio" id="${k}-si" name="${k}" value="1"><label for="${k}-si">${getLang()==='en'?'Yes':'Si'}</label></div>
          <div class="radio"><input type="radio" id="${k}-no" name="${k}" value="0"><label for="${k}-no">${getLang()==='en'?'No':'No'}</label></div>
        `;

        row.appendChild(left); row.appendChild(right);

        const filecol = document.createElement('div');
        filecol.className = 'filecol';
        filecol.innerHTML = `
        <input type="text" class="evidence-input" placeholder="${getLang()==='en' ? 'Reference to evidence (e.g., Minutes #3, March 2023)' : 'Referencia a evidencia (ej. Acta N°3, marzo 2023)'}" data-key="${k}">
          <input type="file" class="file-input" data-key="${k}" multiple>
        `;

        const wrap = document.createElement('div');
        wrap.id = `item-${k}`; // para “Ir”
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

  // Asegura que Ver pendientes esté siempre en el menú
  ensurePendingMenuItem();
}

/* =======================================================
   SCORE DOCK
   ======================================================= */
function updateScore(){
  const score   = computeScore();           // cuenta “Sí”
  const answered = computeAnsweredCount();  // cuenta “Sí” + “No”

  const sdScore = document.getElementById('sdScore');
  const sdMax   = document.getElementById('sdMax');
  const sdLevel = document.getElementById('sdLevel');
  const sdBar   = document.getElementById('sdBar');
  const sdPct   = document.getElementById('sdPct');

  if (!sdScore) return;

  sdScore.textContent = score;
  sdMax.textContent   = totalQuestions;
  sdLevel.textContent = levelFromScore(score);

  const completedPct = totalQuestions ? Math.round((answered/totalQuestions)*100) : 0;
  if (sdBar) sdBar.style.width = completedPct + '%';

  if (sdPct){
    sdPct.textContent = pctLabel(completedPct);
    sdPct.classList.remove('is-low','is-mid','is-high');
    sdPct.classList.add(classForPctCompleted(completedPct));
  }
  const dockTitle = document.getElementById('dockTitle');
  if (dockTitle) dockTitle.textContent = getLang()==='en' ? 'Score' : 'Puntaje';

  const h = document.getElementById('helpBtnLabel');
    const c = document.getElementById('cancelBtnLabel');
    const s = document.getElementById('saveBtnLabel');
    if (h) h.textContent = getLang()==='en' ? 'Need help?' : '¿Necesitas ayuda?';
    if (c) c.textContent = getLang()==='en' ? 'Cancel' : 'Cancelar';
    if (s) s.textContent = getLang()==='en' ? 'Save' : 'Guardar';
  
    const sj = document.getElementById('saveJsonLabel');
    const ec = document.getElementById('exportCsvLabel');
    if (sj) sj.textContent = getLang()==='en' ? 'Save JSON' : 'Guardar JSON';
    if (ec) ec.textContent = getLang()==='en' ? 'Export CSV' : 'Exportar CSV';

}

function levelFromScore(score){
  if(getLang()==='en'){
    if(score <= 12) return 'Initial Level';
    if(score <= 24) return 'Intermediate Level';
    return 'Advanced Level (Public Recognition)';
  } else {
    if(score <= 12) return 'Nivel Inicial';
    if(score <= 24) return 'Nivel Intermedio';
    return 'Nivel Avanzado (Reconocimiento Público)';
  }
}
function classForPctCompleted(pct){
  if (pct < 34) return 'is-low';
  if (pct < 67) return 'is-mid';
  return 'is-high';
}

/* =======================================================
   VALIDATION (guarda pendientes para la hoja)
   ======================================================= */
function runValidation(){
  validationMessages.innerHTML = '';
  let unanswered = 0, missingEvidence = 0;

  lastUnansweredItems = [];
  lastMissingEvidenceItems = [];

  // limpiar marcas
  document.querySelectorAll('.group').forEach(g => g.classList.remove('warn'));

  sections.forEach((section)=>{
    section.groups.forEach((g, gi)=>{
      let groupHasUnanswered = false;
      g.items.forEach((it, ii)=>{
        const k = keyFor(section.key, gi, ii);
        const v = answers[k] || {};
        const isAnswered = (v.value === 0 || v.value === 1);

        if(!isAnswered){
          unanswered++; groupHasUnanswered = true;
          lastUnansweredItems.push({ k, section: section.title, group: g.group, q: it.q });
        }
        if(v.value === 1 && (!v.evidence || v.evidence.trim()==='')){
          missingEvidence++;
          lastMissingEvidenceItems.push({ k, section: section.title, group: g.group, q: it.q });
        }
      });
      if(groupHasUnanswered){
        document.querySelectorAll('.group').forEach(gr => {
          if (gr.querySelector('h3')?.textContent === g.group) gr.classList.add('warn');
        });
      }
    });
  });

  if(unanswered > 0 || missingEvidence > 0){
    validationMessages.style.color = '#b91c1c';
    const parts = [];
    if(unanswered > 0) parts.push(getLang()==='en'
      ? `There are ${unanswered} unanswered question(s). Select “Yes” or “No”.`
      : `Hay ${unanswered} pregunta(s) sin responder. Selecciona “Sí” o “No”.`);
    if(missingEvidence > 0) parts.push(getLang()==='en'
      ? `${missingEvidence} “Yes” answer(s) without evidence.`
      : `Hay ${missingEvidence} respuesta(s) “Sí” sin evidencia.`);
        validationMessages.textContent = parts.join(' ');

    ensurePendingMenuItem();
    return false;
  } else {
    validationMessages.style.color = '#065f46';
    validationMessages.textContent = getLang()==='en'
  ? 'Validation OK — all questions are answered and “Yes” answers include evidence.'
  : 'Validación OK — todas las preguntas tienen respuesta y las “Sí” tienen evidencia.';

    return true;
  }
}

/* =======================================================
   MENÚ DOCK: botón "Ver pendientes" siempre y hoja
   ======================================================= */
function ensurePendingMenuItem(){
  const menu = document.getElementById('saveMenuDock');
  if(!menu) return;

  // si ya existe, no lo duplicamos
  if(menu.querySelector('#viewPendingDock')) return;

  const btn = document.createElement('button');
  btn.id = 'viewPendingDock';
  btn.type = 'button';
  btn.className = 'menu-item';
  btn.textContent = getLang()==='en' ? 'View pending' : 'Ver pendientes';
  btn.addEventListener('click', () => {
    openPendingSheet();
    menu.classList.remove('open');
  });
  menu.appendChild(btn);
}

// elementos globales para hoja y backdrop
let sheetEscHandler = null;

function openPendingSheet(){
  const hasAny = (lastUnansweredItems.length + lastMissingEvidenceItems.length) > 0;

  let sheet = document.getElementById('dockSheet');
  if(!sheet){
    sheet = document.createElement('div');
    sheet.id = 'dockSheet';
    sheet.className = 'dock-sheet ps-sheet'; // añadimos clase ps-* sin romper las actuales
    sheet.setAttribute('role','dialog');
    sheet.setAttribute('aria-modal','true');
    document.body.appendChild(sheet);
  }

  // Backdrop clicable (ps-*)
  let backdrop = document.getElementById('dockSheetBackdrop');
  if(!backdrop){
    backdrop = document.createElement('div');
    backdrop.id = 'dockSheetBackdrop';
    backdrop.className = 'ps-backdrop';
    backdrop.addEventListener('click', closePendingSheet);
    document.body.appendChild(backdrop);
  }

  const mkList = (arr) => arr.map(it => `
    <li>
      <span class="val-path">[${it.section} › ${it.group}]</span>
      <span class="val-q">${it.q}</span>
      <button class="link-jump" data-jump="${it.k}" type="button">${getLang()==='en'?'Go':'Ir'}</button>

    </li>
  `).join('');

  sheet.innerHTML = `
    <div class="ds-head ps-head">
      <strong id="psTitle" class="ps-title">${getLang()==='en'?'Pending':'Pendientes'}</strong>
      <button class="ds-close ps-close" type="button" aria-label="Cerrar">×</button>
    </div>
    <div class="ds-body ps-body" aria-labelledby="psTitle">
      ${
        hasAny ? `
        ${lastUnansweredItems.length ? `
         <h4 class="val-h">${getLang()==='en'?'Unanswered':'Sin responder'} (${lastUnansweredItems.length})</h4>
          <ul class="val-list">${mkList(lastUnansweredItems)}</ul>
        ` : ''}

        ${lastMissingEvidenceItems.length ? `
          <h4 class="val-h">${getLang()==='en'?'“Yes” without evidence':'“Sí” sin evidencia'} (${lastMissingEvidenceItems.length})</h4>

          <ul class="val-list">${mkList(lastMissingEvidenceItems)}</ul>
        ` : ''}
        ` : `
        <div class="val-summary ok">${getLang()==='en'?'No pending 🎉':'No hay pendientes 🎉'}</div>

        `
      }
    </div>
  `;

  sheet.classList.add('open');
  backdrop.classList.add('open');

  const closeBtn = sheet.querySelector('.ds-close');
  closeBtn.onclick = closePendingSheet;

  // delegar “Ir”
  sheet.addEventListener('click', (e) => {
    const btn = e.target.closest('.link-jump');
    if(!btn) return;
    const key = btn.getAttribute('data-jump');
    if(!key) return;

    const sectionKey = key.split('-')[0];
    if (sectionKey){
      setActiveTabKey(sectionKey);
      showSectionByActiveTab();
      document.querySelectorAll('#tabs .tab').forEach(t => {
        const k = t.getAttribute('data-tab');
        if (k === sectionKey) t.classList.add('active');
        else t.classList.remove('active');
      });
    }

    const target = document.getElementById(`item-${key}`);
    if (target){
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.add('pulse');
      setTimeout(()=> target.classList.remove('pulse'), 1200);
    }
  }, { once:false });

  // Cierre por ESC
  sheetEscHandler = (ev)=>{
    if(ev.key === 'Escape'){ closePendingSheet(); }
  };
  document.addEventListener('keydown', sheetEscHandler, { passive:true });

  // foco accesible al abrir
  closeBtn.focus();
}

function closePendingSheet(){
  const sheet = document.getElementById('dockSheet');
  const backdrop = document.getElementById('dockSheetBackdrop');
  if (sheet) sheet.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  if (sheetEscHandler){
    document.removeEventListener('keydown', sheetEscHandler);
    sheetEscHandler = null;
  }
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
  if (saveMenuDock) saveMenuDock.classList.remove('open');
  resetDock();
  window.scrollTo({top:0,behavior:'smooth'});
}

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

  // ✅ Mostrar dock solo dentro del formulario
  const dock = document.getElementById('scoreDock');
  if (dock) dock.style.display = 'block';

  if (!localStorage.getItem(LS_ACTIVE_TAB) && sections[0]) setActiveTabKey(sections[0].key);
  buildTabs();
  buildUI();
  refreshTopbarUser();
}
function showGate(){
  document.getElementById('appMain').style.display='none';
  document.getElementById('authGate').style.display='block';

  // 🚫 Ocultar dock mientras no haya sesión
  const dock = document.getElementById('scoreDock');
  if (dock) dock.style.display = 'none';

  refreshTopbarUser();
}
function checkSessionAndRender(){
  const org = currentApprovedOrg();
  if(org){ showApp(); } else { showGate(); }
}

/* =======================================================
   BOTONES: Guardar/Cancelar (DOCK)
   ======================================================= */
/* =======================================================
   MODAL CONFIRMAR CANCELAR (accesible)
   ======================================================= */
const cancelModal   = document.getElementById('cancelModal');
const cancelOverlay = document.getElementById('cancelOverlay');
const cancelDialog  = document.getElementById('cancelDialog');
const cancelClose   = document.getElementById('cancelClose');
const cancelNo      = document.getElementById('cancelNo');
const cancelYes     = document.getElementById('cancelYes');

let cancelReturnFocus = null;
let cancelEscHandler = null;

function openCancel(){
  if (!cancelModal) return;
  cancelReturnFocus = document.activeElement;
  cancelModal.classList.add('open');
  cancelModal.removeAttribute('aria-hidden');
  document.body.classList.add('modal-open');
  cancelDialog.focus();
  cancelEscHandler = (e)=>{
    if (e.key === 'Escape'){ e.preventDefault(); closeCancel(); }
    if (e.key === 'Tab'){ trapCancelFocus(e); }
  };
  document.addEventListener('keydown', cancelEscHandler);
}

function closeCancel(){
  if (!cancelModal) return;
  cancelModal.classList.remove('open');
  cancelModal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
  if (cancelEscHandler){
    document.removeEventListener('keydown', cancelEscHandler);
    cancelEscHandler = null;
  }
  if (cancelReturnFocus && typeof cancelReturnFocus.focus === 'function'){
    cancelReturnFocus.focus();
  }
}

function trapCancelFocus(e){
  const focusables = cancelDialog.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0];
  const last  = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first){
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last){
    e.preventDefault(); first.focus();
  }
}

// Reemplazo de onCancel: abrimos modal en vez de confirm()
function onCancel(){
  openCancel();
}

// Listeners del modal
cancelOverlay?.addEventListener('click', closeCancel);
cancelClose?.addEventListener('click', closeCancel);
cancelNo?.addEventListener('click', closeCancel);
cancelYes?.addEventListener('click', ()=>{
  // Resetea el formulario
  resetAll();
  closeCancel();
});

function onSaveClick(menuEl){
  const ok = runValidation();
  if(!ok){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showSaveIndicator('fail');

    // menú y hoja con pendientes
    ensurePendingMenuItem();
    if (menuEl){
      menuEl.classList.add('open');
      menuEl.setAttribute('aria-hidden', false);
    }
    openPendingSheet();

    setTimeout(()=> hideSaveIndicator(), 2000);
    return;
  }
  // OK: toggle del menú normal
  if (!menuEl) return;
  menuEl.classList.toggle('open');
  menuEl.setAttribute('aria-hidden', !menuEl.classList.contains('open'));
}

/* Dock listeners */
if (cancelBtnDock) cancelBtnDock.addEventListener('click', onCancel);
if (saveBtnDock) saveBtnDock.addEventListener('click', ()=> onSaveClick(saveMenuDock));

// Guardar JSON (agregamos implementación)
if (document.getElementById('saveJsonDock'))
  document.getElementById('saveJsonDock').addEventListener('click', ()=>{
    showSaveIndicator('saving');
    setTimeout(()=>{
      saveJSON(); // <== ahora existe
      showSaveIndicator('fail'); // falla intencional (hasta backend real)
      setTimeout(()=> hideSaveIndicator(), 2500);
    }, 800);
    saveMenuDock.classList.remove('open');
  });

// Exportar CSV (agregamos implementación)
if (document.getElementById('exportCsvDock'))
  document.getElementById('exportCsvDock').addEventListener('click', ()=>{
    showSaveIndicator('saving');
    setTimeout(()=>{
      exportCSV(); // <== ahora existe
      showSaveIndicator('fail'); // falla intencional (hasta backend real)
      setTimeout(()=> hideSaveIndicator(), 2500);
    }, 800);
    saveMenuDock.classList.remove('open');
  });

/* Cerrar menú del dock al click fuera */
document.addEventListener('click', (e)=>{
  const clickInsideMenu = saveMenuDock?.contains(e.target);
  const isSaveBtn = e.target === saveBtnDock || saveBtnDock?.contains(e.target);
  if (!clickInsideMenu && !isSaveBtn) saveMenuDock?.classList.remove('open');
});

/* Dock toggle (colapsar/expandir) con animación y aria-pressed */
if (dockToggle){
  dockToggle.setAttribute('aria-pressed','false');
  dockToggle.addEventListener('click', ()=>{
    const dock = document.getElementById('scoreDock');
    if(!dock) return;
    const collapsingClass = dock.classList.contains('collapsed') ? 'collapsing-open' : 'collapsing-close';
    dock.classList.add(collapsingClass);

    const isCollapsed = dock.classList.toggle('collapsed');
    dockToggle.setAttribute('aria-pressed', isCollapsed ? 'true' : 'false');

    // quitar clase de animación al terminar
    setTimeout(()=> dock.classList.remove(collapsingClass), 220);
  });
}

/* =======================================================
   THEME TOGGLE (light/dark)
   ======================================================= */
function applyTheme(theme){
  const t = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
  lsSet(LS_THEME, t);
}
function initTheme(){
  const saved = lsGet(LS_THEME, null);
  if (saved){ applyTheme(saved); return; }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn){
  themeToggleBtn.addEventListener('click', ()=>{
    const now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(now);
  });
}

/* =======================================================
   SAVE INDICATOR (en el dock)
   estados: 'saving' | 'fail'
   ======================================================= */
function ensureSaveIndicatorEl(){
  let el = document.getElementById('saveIndicator');
  if (!el){
    el = document.createElement('div');
    el.id = 'saveIndicator';
    el.innerHTML = `
      <svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" class="spinner"/></svg>
      <span class="label">Guardando…</span>
    `;
    document.getElementById('scoreDock')?.appendChild(el);
  }
  return el;
}
function showSaveIndicator(state){
  const el = ensureSaveIndicatorEl();
  const label = el.querySelector('.label');

  el.classList.add('show');

  if (state === 'saving'){
  label.textContent = getLang()==='en' ? 'Saving…' : 'Guardando…';
  } else if (state === 'fail'){
  label.textContent = getLang()==='en' ? 'Save failed (configure backend)' : 'Guardado falló (configurar backend)';
  }
}
function hideSaveIndicator(){
  const el = document.getElementById('saveIndicator');
  if (el) el.classList.remove('show');
}

/* =======================================================
   EXPORTADORES (JSON / CSV) — DEMO local
   ======================================================= */
function flattenRows(){
  const rows = [];
  sections.forEach((section, gi0)=>{
    section.groups.forEach((g, gi)=>{
      g.items.forEach((it, ii)=>{
        const k = keyFor(section.key, gi, ii);
        const v = answers[k] || {};
        rows.push({
          sectionKey: section.key,
          section: section.title,
          group: g.group,
          question: it.q,
          answer: (v.value===1 ? 'Sí' : (v.value===0 ? 'No' : '')),
          evidence: v.evidence || '',
          files: (v.files||[]).join('; ')
        });
      });
    });
  });
  return rows;
}

function downloadBlob(filename, mime, content){
  const blob = new Blob([content], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}

function saveJSON(){
  const org = currentApprovedOrg();
  const payload = {
    meta: {
      exportedAt: new Date().toISOString(),
      totalQuestions,
      score: computeScore(),
      answered: computeAnsweredCount(),
      org: org ? { id: org.id, razon: org.razon, rut: org.rut } : null,
      user: getSession()?.email || null
    },
    answers,                 // mapa crudo
    rows: flattenRows()      // plano útil para backend/planillas
  };
  downloadBlob('facsimil_respuestas.json', 'application/json;charset=utf-8', JSON.stringify(payload, null, 2));
}

function exportCSV(){
  const rows = flattenRows();
  const headers = ['Sección','Grupo','Pregunta','Respuesta','Evidencia','Archivos'];
  const csv = [
    '\uFEFF' + headers.join(','), // BOM + cabecera
    ...rows.map(r => [
      r.section, r.group, r.question, r.answer, r.evidence, r.files
    ].map(val => `"${String(val).replace(/"/g,'""')}"`).join(','))
  ].join('\r\n');
  downloadBlob('facsimil_respuestas.csv', 'text/csv;charset=utf-8', csv);
}

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
    alert(getLang()==='en' ? 'Organization registered. Status: PENDING until admin approval.' : 'Organización inscrita. Queda en estado PENDIENTE hasta aprobación de administrador.');

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
    if(!found){ alert(getLang()==='en' ? 'Invalid credentials.' : 'Credenciales inválidas.');return; }
    if(org.estado!=='aprobada'){ alert(getLang()==='en' ? 'Organization not yet approved by admin.' : 'Organización aún no aprobada por el administrador.'); return; }
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
/* =======================================================
   AYUDA / FAQ MODAL (accesible)
   ======================================================= */
const helpBtnDock  = document.getElementById('helpBtnDock');
const helpModal    = document.getElementById('helpModal');
const helpOverlay  = document.getElementById('helpOverlay');
const helpDialog   = document.getElementById('helpDialog');
const helpClose    = document.getElementById('helpClose');
const helpCancel   = document.getElementById('helpCancel');
const helpForm     = document.getElementById('helpForm');

let helpReturnFocus = null;

function openHelp(){
  if (!helpModal) return;

  // ⬅️ añadido: refrescar traducciones del modal antes de abrirlo
  updateHelpModalTexts();

  helpReturnFocus = document.activeElement;
  helpModal.classList.add('open');
  helpModal.removeAttribute('aria-hidden');
  document.body.classList.add('modal-open');
  helpDialog.focus();

  // ⬅️ añadido: asegurar idioma actualizado si se cambió mientras estaba cerrado
  const langLabel = document.getElementById('langLabel');
  if (langLabel) langLabel.textContent = getLang().toUpperCase();

  document.addEventListener('keydown', onHelpKeydown);
}

function closeHelp(){
  if (!helpModal) return;
  helpModal.classList.remove('open');
  helpModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onHelpKeydown);
  if (helpReturnFocus && typeof helpReturnFocus.focus === 'function') {
    helpReturnFocus.focus();
  }
}

function onHelpKeydown(e){
  if (e.key === 'Escape') { e.preventDefault(); closeHelp(); return; }
  if (e.key === 'Tab') trapHelpFocus(e);
}

// Focus trap simple dentro del diálogo
function trapHelpFocus(e){
  const focusables = helpDialog.querySelectorAll(
    'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last  = focusables[focusables.length - 1];

  if (e.shiftKey && document.activeElement === first){
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last){
    e.preventDefault(); first.focus();
  }
}

// Listeners
helpBtnDock?.addEventListener('click', openHelp);
helpOverlay?.addEventListener('click', closeHelp);
helpClose?.addEventListener('click', closeHelp);
helpCancel?.addEventListener('click', closeHelp);
helpForm?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = (new FormData(helpForm).get('email') || '').trim();
  const msg   = (new FormData(helpForm).get('msg') || '').trim();

  if (!email || !msg){
    alert(getLang()==='en'
      ? 'Please fill in your email and message.'
      : 'Por favor completa tu correo y el mensaje.');
    return;
  }

  // DEMO: sin backend—solo muestra mensaje de éxito
  alert(getLang()==='en'
    ? 'Thank you! Your message has been recorded (demo without backend).'
    : '¡Gracias! Tu mensaje ha sido registrado (demo sin backend).');

  helpForm.reset();
  closeHelp();
});

/* =======================================================
   INIT
   ======================================================= */
document.addEventListener('DOMContentLoaded', ()=>{
    attachRutBehavior('rut');      // RUT de la organización
  attachRutBehavior('rep_run');  // RUN del representante

  // Idioma inicial
  setLang(getLang());
  updateHelpModalTexts();
  const langToggle = document.getElementById('langToggle');
  if (langToggle){
    langToggle.addEventListener('click', ()=>{
      setLang(getLang()==='en' ? 'es' : 'en');
      // Actualiza etiqueta del botón
      const langLabel = document.getElementById('langLabel');
      if (langLabel) langLabel.textContent = getLang().toUpperCase();
      // Re-render del formulario y tabs para aplicar textos
      buildTabs();
      buildUI();
      refreshTopbarUser();
      updateScore(); // refresca el texto del porcentaje en el dock
      updateHelpModalTexts();
      updateCancelModalTexts(); // refresca textos del modal cancelar
    });
    const langLabel = document.getElementById('langLabel');
    if (langLabel) langLabel.textContent = getLang().toUpperCase();
    // ===== AUTH TABS (Login / Registro / Admin)
function authSetActive(tab){
  const tabs = [
    {btn: 'tabLogin', pane: 'paneLogin'},
    {btn: 'tabRegister', pane: 'paneRegister'},
    {btn: 'tabAdmin', pane: 'paneAdmin'},
  ];
  tabs.forEach(t=>{
    const b = document.getElementById(t.btn);
    const p = document.getElementById(t.pane);
    if(!b || !p) return;
    const is = (t.btn === tab);
    b.classList.toggle('active', is);
    b.setAttribute('aria-selected', is ? 'true' : 'false');
    p.classList.toggle('active', is);
  });
}

document.getElementById('tabLogin')?.addEventListener('click', ()=>authSetActive('tabLogin'));
document.getElementById('tabRegister')?.addEventListener('click', ()=>authSetActive('tabRegister'));
document.getElementById('tabAdmin')?.addEventListener('click', ()=>authSetActive('tabAdmin'));
// ===== ADMIN DEMO PREDEFINIDO
const DEMO_ADMIN_EMAIL = 'admin@demo.cl';
const DEMO_ADMIN_PASS  = 'Admin123!';

const adminFormRevamp = document.getElementById('adminFormRevamp');
const adminPanelRevamp = document.getElementById('adminPanelRevamp');
const adminLogoutRevamp = document.getElementById('adminLogoutRevamp');
const pendingListRevamp = document.getElementById('pendingListRevamp');

function renderPendingRevamp(){
  const orgs = getOrgs();
  const pend = orgs.filter(o=>o.estado==='pendiente');
  if (!pend.length){
    pendingListRevamp.innerHTML = 'Sin pendientes…';
    return;
  }
  pendingListRevamp.innerHTML = pend.map(o=>`
    <div class="pending-item">
      <div><b>${o.razon}</b> — RUT: ${o.rut}</div>
      <div class="muted">Rep: ${o.representante?.nombre || '-'} (${o.representante?.run || '-'})</div>
      <div class="pending-actions">
        <button class="btn tiny success" data-approve="${o.id}">Aprobar</button>
        <button class="btn tiny danger" data-reject="${o.id}">Rechazar</button>
      </div>
    </div>
  `).join('');
}

adminFormRevamp?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd = new FormData(adminFormRevamp);
  const email = (fd.get('adminEmail')||'').trim().toLowerCase();
  const pass  = fd.get('adminPass')||'';
  if (email===DEMO_ADMIN_EMAIL && pass===DEMO_ADMIN_PASS){
    adminPanelRevamp.classList.remove('hidden');
    renderPendingRevamp();
  } else {
    alert('Credenciales admin inválidas (usa admin@demo.cl / Admin123!)');
  }
});

adminLogoutRevamp?.addEventListener('click', ()=>{
  adminPanelRevamp.classList.add('hidden');
});

pendingListRevamp?.addEventListener('click', (e)=>{
  const ap = e.target.getAttribute('data-approve');
  const rj = e.target.getAttribute('data-reject');
  if (!ap && !rj) return;
  const orgs = getOrgs();
  const id = ap || rj;
  const idx = orgs.findIndex(o=>o.id===id);
  if (idx === -1) return;
  orgs[idx].estado = ap ? 'aprobada' : 'rechazada';
  orgs[idx].updatedAt = new Date().toISOString();
  setOrgs(orgs);
  renderPendingRevamp();
  alert(`Organización ${ap?'APROBADA':'RECHAZADA'}: ${orgs[idx].razon}`);
});

  }

  initTheme();
  ensurePendingMenuItem();

  checkSessionAndRender();
  refreshTopbarUser();
});
