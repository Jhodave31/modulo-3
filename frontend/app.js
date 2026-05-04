const API = '/api';
let editingCampaignId = null;
let editingMissionId = null;

function toast(title, message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  el.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

function badgeClass(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, '_');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function updateStats(campaigns, missions) {
  const campaignStat = document.getElementById('stat-campaigns');
  const missionStat = document.getElementById('stat-missions');
  if (campaignStat) campaignStat.textContent = `${campaigns} ${campaigns === 1 ? 'campaña' : 'campañas'} registradas`;
  if (missionStat) missionStat.textContent = `${missions} ${missions === 1 ? 'misión' : 'misiones'} registradas`;
}

function resetMissionForm() {
  document.getElementById('mission-campaign-id').disabled = false;
  document.getElementById('mission-campaign-id').value = '';
  document.getElementById('mission-title').value = '';
  document.getElementById('mission-desc').value = '';
  document.getElementById('mission-orden').value = '';
  document.getElementById('mission-cap').value = '';
  document.getElementById('mission-estado').value = 'pendiente';
  editingMissionId = null;
  document.getElementById('btn-create-mission').textContent = 'Crear misión';
  document.getElementById('btn-cancel-mission').style.display = 'none';
}

async function createCampaign() {
  const payload = {
    nombre: document.getElementById('camp-nombre').value,
    descripcion: document.getElementById('camp-desc').value,
    ambientacion: document.getElementById('camp-ambient').value,
    estado: document.getElementById('camp-estado').value,
    narrador_id: parseInt(document.getElementById('camp-narrador').value) || null,
    max_jugadores: parseInt(document.getElementById('camp-max').value) || null,
    sistema_reglas: document.getElementById('camp-sistema').value
  };
  if (editingCampaignId) {
    const res = await fetch(`${API}/campaigns/${editingCampaignId}`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data = await res.json();
    toast('Campaña actualizada', `ID ${data.id} · ${data.nombre}`);
    editingCampaignId = null;
    document.getElementById('btn-create-camp').textContent = 'Crear campaña';
    document.getElementById('btn-cancel-camp').style.display = 'none';
    listCampaigns();
  } else {
    const res = await fetch(`${API}/campaigns`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data = await res.json();
    toast('Campaña forjada', `ID ${data.id} · ${data.nombre}`);
    listCampaigns();
  }
}

async function createMission() {
  const campaignId = document.getElementById('mission-campaign-id').value;
  if(!campaignId) return alert('Ingresa campaign id');
  const payload = {
    titulo: document.getElementById('mission-title').value,
    descripcion: document.getElementById('mission-desc').value,
    orden: parseInt(document.getElementById('mission-orden').value) || 0,
    capitulo: document.getElementById('mission-cap').value,
    estado: document.getElementById('mission-estado').value
  };
  if (editingMissionId) {
    const res = await fetch(`${API}/missions/${editingMissionId}`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data = await res.json();
    toast('Misión actualizada', `ID ${data.id} · ${data.titulo}`);
    resetMissionForm();
    document.getElementById('list-missions-campaign').value = campaignId;
    listMissions();
  } else {
    const res = await fetch(`${API}/campaigns/${campaignId}/missions`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data = await res.json();
    toast('Misión registrada', `ID ${data.id} · ${data.titulo}`);
    document.getElementById('list-missions-campaign').value = campaignId;
    resetMissionForm();
    document.getElementById('list-missions-campaign').value = campaignId;
    listMissions();
  }
}

async function listCampaigns() {
  const container = document.getElementById('campaigns-list');
  container.innerHTML = 'Cargando...';
  const res = await fetch(`${API}/campaigns`);
  const rows = await res.json();
  updateStats(rows.length, document.querySelectorAll('#missions-list .entry').length);
  container.innerHTML = rows.length ? rows.map(r=>`<div class="entry"><div class="entry-top"><div class="entry-title"><b>${escapeHtml(r.id)} - ${escapeHtml(r.nombre)}</b><span class="badge ${badgeClass(r.estado)}">${escapeHtml(r.estado)}</span></div></div><div class="entry-meta">${escapeHtml(r.descripcion || '')}<br/>Ambientación: ${escapeHtml(r.ambientacion || '-') }<br/>Narrador: ${escapeHtml(r.narrador_id || '-')} · Máx. jugadores: ${escapeHtml(r.max_jugadores || '-')}<br/>Sistema: ${escapeHtml(r.sistema_reglas || '-')}</div><div class="entry-actions"><button class="warn" onclick="delCamp(${r.id})">Eliminar</button><button onclick="editCamp(${r.id})">Editar</button></div></div>`).join('') : '<div class="entry">Sin campañas todavía. Crea la primera aventura del reino.</div>';
}

async function listMissions() {
  const campaignId = document.getElementById('list-missions-campaign').value;
  const container = document.getElementById('missions-list');
  if(!campaignId) return alert('Ingresa campaign id');
  container.innerHTML = 'Cargando...';
  const res = await fetch(`${API}/campaigns/${campaignId}/missions`);
  const rows = await res.json();
  updateStats(document.querySelectorAll('#campaigns-list .entry').length, rows.length);
  container.innerHTML = rows.length ? rows.map(r=>`<div class="entry"><div class="entry-top"><div class="entry-title"><b>${escapeHtml(r.id)} - ${escapeHtml(r.titulo)}</b><span class="badge ${badgeClass(r.estado)}">${escapeHtml(r.estado)}</span></div></div><div class="entry-meta">${escapeHtml(r.descripcion || '')}<br/>Capítulo: ${escapeHtml(r.capitulo || '-')} · Orden: ${escapeHtml(r.orden || '-') }<br/>Campaign ID: ${escapeHtml(r.campaign_id)}</div><div class="entry-actions"><button class="warn" onclick="delMission(${r.id})">Eliminar</button><button onclick="editMission(${r.id})">Editar</button></div></div>`).join('') : '<div class="entry">No hay misiones para esta campaña.</div>';
}

async function delCamp(id){
  if(!confirm('Eliminar campaña '+id+'?')) return;
  await fetch(`${API}/campaigns/${id}`, {method:'DELETE'});
  toast('Campaña eliminada', `ID ${id}`);
  // if we were editing this campaign, cancel edit
  if (editingCampaignId === id) {
    editingCampaignId = null;
    document.getElementById('btn-create-camp').textContent = 'Crear campaña';
    document.getElementById('btn-cancel-camp').style.display = 'none';
  }
  listCampaigns();
}

async function delMission(id){
  if(!confirm('Eliminar misión '+id+'?')) return;
  await fetch(`${API}/missions/${id}`, {method:'DELETE'});
  toast('Misión eliminada', `ID ${id}`);
  if (editingMissionId === id) {
    editingMissionId = null;
    document.getElementById('btn-create-mission').textContent = 'Crear misión';
    document.getElementById('btn-cancel-mission').style.display = 'none';
    document.getElementById('mission-campaign-id').disabled = false;
  }
  const campaignId = document.getElementById('list-missions-campaign').value;
  if(campaignId) listMissions();
}

async function editCamp(id){
  const res = await fetch(`${API}/campaigns/${id}`);
  if (!res.ok) return toast('Error', 'No se pudo cargar la campaña');
  const c = await res.json();
  document.getElementById('camp-nombre').value = c.nombre || '';
  document.getElementById('camp-desc').value = c.descripcion || '';
  document.getElementById('camp-ambient').value = c.ambientacion || '';
  document.getElementById('camp-estado').value = c.estado || 'activa';
  document.getElementById('camp-narrador').value = c.narrador_id || '';
  document.getElementById('camp-max').value = c.max_jugadores || '';
  document.getElementById('camp-sistema').value = c.sistema_reglas || '';
  editingCampaignId = id;
  document.getElementById('btn-create-camp').textContent = 'Guardar cambios';
  document.getElementById('btn-cancel-camp').style.display = 'inline-block';
  window.scrollTo({top:0,behavior:'smooth'});
}

async function editMission(id){
  const res = await fetch(`${API}/missions/${id}`);
  if (!res.ok) return toast('Error', 'No se pudo cargar la misión');
  const m = await res.json();
  document.getElementById('mission-campaign-id').value = m.campaign_id || '';
  document.getElementById('mission-title').value = m.titulo || '';
  document.getElementById('mission-desc').value = m.descripcion || '';
  document.getElementById('mission-orden').value = m.orden || 0;
  document.getElementById('mission-cap').value = m.capitulo || '';
  document.getElementById('mission-estado').value = m.estado || 'pendiente';
  editingMissionId = id;
  document.getElementById('btn-create-mission').textContent = 'Guardar cambios';
  document.getElementById('btn-cancel-mission').style.display = 'inline-block';
  // avoid changing campaign while editing mission
  document.getElementById('mission-campaign-id').disabled = true;
  window.scrollTo({top:0,behavior:'smooth'});
}

function cancelEditCampaign(){
  editingCampaignId = null;
  document.getElementById('btn-create-camp').textContent = 'Crear campaña';
  document.getElementById('btn-cancel-camp').style.display = 'none';
}

function cancelEditMission(){
  editingMissionId = null;
  document.getElementById('btn-create-mission').textContent = 'Crear misión';
  document.getElementById('btn-cancel-mission').style.display = 'none';
  document.getElementById('mission-campaign-id').disabled = false;
}

document.getElementById('btn-create-camp').onclick = createCampaign;
document.getElementById('btn-create-mission').onclick = createMission;
document.getElementById('btn-refresh-camps').onclick = listCampaigns;
document.getElementById('btn-list-missions').onclick = listMissions;
document.getElementById('btn-cancel-camp').onclick = cancelEditCampaign;
document.getElementById('btn-cancel-mission').onclick = cancelEditMission;

// initial
listCampaigns();
