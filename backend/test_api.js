const fs = require('fs');

async function run() {
  try {
    const campaignPayload = {
      nombre: 'Campaña Prueba',
      descripcion: 'Prueba',
      ambientacion: 'Medieval',
      estado: 'activa',
      narrador_id: 1,
      max_jugadores: 5,
      sistema_reglas: 'D20'
    };

    const campRes = await fetch('http://localhost:3000/api/campaigns', {
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify(campaignPayload)
    });
    const camp = await campRes.json();
    fs.writeFileSync('test_campaign.json', JSON.stringify(camp, null, 2));

    const missionPayload = {
      titulo: 'Misión Prueba',
      descripcion: 'Desc',
      orden: 1,
      capitulo: 'Cap1',
      estado: 'pendiente'
    };

    const mid = camp.id;
    const missionRes = await fetch(`http://localhost:3000/api/campaigns/${mid}/missions`, {
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify(missionPayload)
    });
    const mission = await missionRes.json();
    fs.writeFileSync('test_mission.json', JSON.stringify(mission, null, 2));

    const listRes = await fetch(`http://localhost:3000/api/campaigns/${mid}/missions`);
    const list = await listRes.json();
    fs.writeFileSync('test_missions_list.json', JSON.stringify(list, null, 2));

    // initialize git if missing
    const {execSync} = require('child_process');
    if (!fs.existsSync('.git')) {
      execSync('git init -q');
      execSync('git add .');
      execSync('git commit -m "Initial module3 CRUDs and frontend" -q');
    }

    console.log('DONE');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
