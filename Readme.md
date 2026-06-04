Rutas de prueba para los distintos métodos HTTP:

- GET /health
  - URL: http://localhost:3000/health
  - Prueba el estado del servidor.

- GET /api/v1/tasks
  - URL: http://localhost:3000/api/v1/tasks
  - Obtiene todas las tareas.

- GET /api/v1/tasks/:id
  - URL de ejemplo: http://localhost:3000/api/v1/tasks/d11406b4-9c8e-4fc4-8cb6-dee2eb9e9967
  - Obtiene una tarea por su id.

- POST /api/v1/tasks
  - URL: http://localhost:3000/api/v1/tasks
  - Crea una nueva tarea.
  - Body JSON de ejemplo:
    {
      "title": "Mi nueva tarea",
      "description": "Descripción opcional",
      "priority": "mid"
    }

- PUT /api/v1/tasks/:id
  - URL de ejemplo: http://localhost:3000/api/v1/tasks/d11406b4-9c8e-4fc4-8cb6-dee2eb9e9967
  - Actualiza una tarea existente.
  - Body JSON de ejemplo:
    {
      "title": "Tarea actualizada",
      "completed": true
    }

- DELETE /api/v1/tasks/:id
  - URL de ejemplo: http://localhost:3000/api/v1/tasks/d11406b4-9c8e-4fc4-8cb6-dee2eb9e9967
  - Elimina una tarea por su id.

