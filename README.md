# Avance Módulo 3 — Plataforma Digital 360° (CRUDs)

Proyecto mínimo con dos CRUDs (Campañas y Misiones) para el Módulo 3.

Backend:
- Node.js + Express
- SQLite (archivo: `backend/data.sqlite`)

Frontend:
- UI simple en `frontend/index.html` que consume la API.

Instrucciones:

1. Abrir terminal en la carpeta `backend` y ejecutar:

```bash
npm install
npm start
```

2. Abrir en el navegador: http://localhost:3000/  (la UI se sirve desde el backend)

Endpoints principales:
- `POST /api/campaigns` — crear campaña
- `GET /api/campaigns` — listar campañas
- `GET /api/campaigns/:id` — ver campaña
- `PUT /api/campaigns/:id` — actualizar campaña
- `DELETE /api/campaigns/:id` — eliminar campaña

- `POST /api/campaigns/:campaignId/missions` — crear misión
- `GET /api/campaigns/:campaignId/missions` — listar misiones
- `GET /api/missions/:id` — ver misión
- `PUT /api/missions/:id` — actualizar misión
- `DELETE /api/missions/:id` — eliminar misión

Notas:
- El servidor crea automáticamente las tablas SQLite al iniciarse.
- Para pruebas rápidas puede usarse `curl` o la UI incluida.
