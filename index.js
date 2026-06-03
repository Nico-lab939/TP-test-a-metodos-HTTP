import express from 'express';
import healthRouter from './src/routes/health.js';
import tasksRouter from './src/routes/tasks.js';

const PORT = process.env.PORT || 3000;
const API_PREFIX = "/api/v1";
const server = express();

server.set('view engine', 'ejs');
server.set('views', './views');

server.use(express.json());

// Ruta de inicio (index route) que muestra la documentación de la API en EJS
server.get('/', (req, res) => {
    // Definimos la documentación de los endpoints disponibles
    const apiDocs = [
        {
            method: 'GET',
            path: '/health',
            description: 'Comprueba que el servidor está en funcionamiento.',
            body: null,
        },
        {
            method: 'GET',
            path: `${API_PREFIX}/tasks`,
            description: 'Obtiene todas las tareas existentes.',
            body: null,
        },
        {
            method: 'GET',
            path: `${API_PREFIX}/tasks/:id`,
            description: 'Obtiene una tarea específica por su id.',
            body: null,
        },
        {
            method: 'POST',
            path: `${API_PREFIX}/tasks`,
            description: 'Crea una nueva tarea.',
            body: {
                title: 'string (obligatorio)',
                description: 'string (opcional)',
                priority: 'low | mid | high (opcional)',
            },
        },
        {
            method: 'PUT',
            path: `${API_PREFIX}/tasks/:id`,
            description: 'Actualiza campos de una tarea existente.',
            body: {
                title: 'string (opcional)',
                description: 'string (opcional)',
                priority: 'low | mid | high (opcional)',
                completed: 'boolean (opcional)',
            },
        },
        {
            method: 'DELETE',
            path: `${API_PREFIX}/tasks/:id`,
            description: 'Elimina una tarea por su id.',
            body: null,
        },
    ];

    // Renderizamos la plantilla EJS 'index' y le pasamos los datos de la API
    res.render('index', {
        title: 'API CRUD JSON',
        apiDocs,
        apiPrefix: API_PREFIX,
    });
});

// health check
server.use("/health", healthRouter);

server.use(`${API_PREFIX}/tasks`, tasksRouter);



// 404 Not Found
server.use((req, res, next) => {
    const error = new Error(`Not Found: ${req.method} ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

// Global Error Handler
server.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ status, error: err.message || 'Internal Server Error' });
});

server.listen(PORT, (err) => {
    if (err) {
        console.error('Error al iniciar el servidor:', err);
        return;
    }
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});