Guion breve para la demo de Campaign Forge

Slide 0 — Introducción (15–20s)
- Saludo rápido y elevator pitch: "Campaign Forge — mini-app para administrar campañas y misiones."
- Mencionar stack y objetivo (CRUDs, evidencia en GitHub).

Slide 1 — Arquitectura (20–30s)
- Explicar backend (Node/Express) y SQLite como DB ligera.
- Enseñar principales endpoints y dónde están en el repo (`backend/index.js`).

Slide 2 — Demo (2–3 min)
- Ejecutar: `node backend/index.js` y abrir `http://localhost:3000`.
- Crear campaña (mostrar toast y el ID que se genera).
- Pulsar Editar en la campaña → señalar que el formulario se rellena con todos los campos; modificar y Guardar → toast.
- Crear misión para esa campaña → Listar misiones → Editar y Eliminar una misión → mostrar toasts.

Slide 3 — Próximos pasos (20s)
- Comentarios sobre mejoras: autenticación, migrar DB, tests, UI/UX.

Checklist para la demo en vivo
- ✅ Servidor arrancado y puerto 3000 disponible
- ✅ Tener una campaña preparada (opcional)
- ✅ Navegador abierto en la URL

Recursos / links
- Repo: https://github.com/Jhodave31/modulo-3
- Archivos clave: `frontend/index.html`, `frontend/app.js`, `backend/index.js`, `backend/db.js`
