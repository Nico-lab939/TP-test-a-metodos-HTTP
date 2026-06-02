// Módulo de persistencia: maneja la lectura y escritura de tareas en un archivo JSON
// Mantiene una copia en memoria que se sincroniza con el archivo.

import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE_PATH = join(__dirname, '../data/tasks.json');

let tasks = [];

// Cargar tareas desde el archivo al iniciar el servidor
function loadTasks() {
    try {
        const jsonData = readFileSync(FILE_PATH, 'utf-8');
        tasks = JSON.parse(jsonData);
    } catch (err) {
        if (err.code !== 'ENOENT') {
            const error = new Error("Error al cargar tareas: " + err.message);
            error.status = 500;
            return next(error);
        }
        // Si el archivo no existe, inicializamos con un array vacío
        save();
    }
}

function save() {
    writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2), 'utf-8');
}

// Devuelve una copia de todas las tareas en memoria
function getAllTasks() {
    return [...tasks];
}

// Busca una tarea por id; devuelve undefined si no existe
function getById(id) {
    return tasks.find(task => task.id === id);
}

// Crea una tarea, la guarda en memoria y persiste en el archivo JSON
function createTask({ title, description, priority }) {
    const now = new Date().toISOString();
    const newTask = {
        id: randomUUID(),
        title,
        description,
        priority,
        completed: false,
        createdAt: now,
        updatedAt: now,
    };
    tasks.push(newTask);
    save();
    return newTask;
}

// Actualiza una tarea existente y persiste en el archivo JSON
function updateTask(id, updates) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return null;

    const task = tasks[index];
    if (updates.title !== undefined) task.title = updates.title;
    if (updates.description !== undefined) task.description = updates.description;
    if (updates.priority !== undefined) task.priority = updates.priority;
    if (updates.completed !== undefined) task.completed = updates.completed;
    task.updatedAt = new Date().toISOString();

    save();
    return { ...task };
}

// Elimina una tarea por id y persiste en el archivo JSON
function deleteTask(id) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return null;

    const [deleted] = tasks.splice(index, 1);
    save();
    return deleted;
}

loadTasks();

export { getAllTasks, getById, createTask, updateTask, deleteTask };
