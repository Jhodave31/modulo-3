const API = '/api';

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
  const res = await fetch(`${API}/campaigns`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const data = await res.json();
  alert('Campaña creada: ID ' + data.id);
  listCampaigns();
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
  const res = await fetch(`${API}/campaigns/${campaignId}/missions`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const data = await res.json();
  alert('Misión creada: ID ' + data.id);
}

async function listCampaigns() {
  const container = document.getElementById('campaigns-list');
  container.innerHTML = 'Cargando...';
  const res = await fetch(`${API}/campaigns`);
  const rows = await res.json();
  container.innerHTML = rows.map(r=>`<div style="border-bottom:1px solid #eee;padding:6px"><b>${r.id} - ${r.nombre}</b><br/>${r.descripcion||''}<br/>Estado: ${r.estado} — Narrador: ${r.narrador_id || '-'}<br/><button onclick="delCamp(${r.id})">Eliminar</button> <button onclick="editCamp(${r.id})">Editar</button></div>`).join('') || 'Sin campañas';
}

async function listMissions() {
  const campaignId = document.getElementById('list-missions-campaign').value;
  const container = document.getElementById('missions-list');
  if(!campaignId) return alert('Ingresa campaign id');
  container.innerHTML = 'Cargando...';
  const res = await fetch(`${API}/campaigns/${campaignId}/missions`);
  const rows = await res.json();
  container.innerHTML = rows.map(r=>`<div style="border-bottom:1px solid #eee;padding:6px"><b>${r.id} - ${r.titulo}</b><br/>${r.descripcion||''}<br/>Estado: ${r.estado} — Orden: ${r.orden}<br/><button onclick="delMission(${r.id})">Eliminar</button> <button onclick="editMission(${r.id})">Editar</button></div>`).join('') || 'Sin misiones';
}

async function delCamp(id){
  if(!confirm('Eliminar campaña '+id+'?')) return;
  await fetch(`${API}/campaigns/${id}`, {method:'DELETE'});
  listCampaigns();
}

async function delMission(id){
  if(!confirm('Eliminar misión '+id+'?')) return;
  await fetch(`${API}/missions/${id}`, {method:'DELETE'});
  const campaignId = document.getElementById('list-missions-campaign').value;
  if(campaignId) listMissions();
}

function editCamp(id){
  const nombre = prompt('Nuevo nombre');
  if(nombre===null) return;
  fetch(`${API}/campaigns/${id}`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({nombre})}).then(()=>listCampaigns());
}

function editMission(id){
  const titulo = prompt('Nuevo título');
  if(titulo===null) return;
  fetch(`${API}/missions/${id}`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({titulo})}).then(()=>{
    const campaignId = document.getElementById('list-missions-campaign').value;
    if(campaignId) listMissions();
  });
}

document.getElementById('btn-create-camp').onclick = createCampaign;
document.getElementById('btn-create-mission').onclick = createMission;
document.getElementById('btn-refresh-camps').onclick = listCampaigns;
document.getElementById('btn-list-missions').onclick = listMissions;

// initial
listCampaigns();
