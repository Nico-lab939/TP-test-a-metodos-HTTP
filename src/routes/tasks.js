import { Router } from 'express';
const router = Router();
import { getAllTasks, getById, createTask, updateTask, deleteTask } from '../services/fileStore.js';

const validPriorities = ["low", "mid", "high"];

// Obtener todas las tareas
router.get("/", (req, res, next) => {
    const tareas = getAllTasks();
    if (tareas.length === 0) {
        const error = new Error("No se encontraron tareas");
        error.status = 404;
        return next(error);
    }
    res.json(tareas);
});

// Buscar una tarea por su id
router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    try {
        const tarea = getById(id);
        if (!tarea) {
            const error = new Error("Tarea no encontrada");
            error.status = 404;
            return next(error);
        }
        res.json(tarea);
    } catch (error) {
        return next(error);
    }
});

// Crear una tarea nueva
router.post("/", (req, res, next) => {
    const { title, description, priority } = req.body;
    // title es obligatorio y no puede estar vacío
    if (typeof title !== "string" || title.trim() === "") {
        const error = new Error("El campo title es obligatorio y debe ser una cadena de texto no vacía");
        error.status = 400;
        return next(error);
    }

    // description es opcional; por defecto cadena vacía
    const finalDescription = description === undefined ? "" : description;
    if (typeof finalDescription !== "string") {
        const error = new Error("El campo description debe ser una cadena de texto");
        error.status = 400;
        return next(error);
    }

    // priority es opcional; por defecto "low"
    let finalPriority = "low";
    if (priority !== undefined) {
        if (!validPriorities.includes(priority)) {
            const error = new Error('El campo priority debe ser "low", "mid" o "high"');
            error.status = 400;
            return next(error);
        }
        finalPriority = priority;
    }

    try {
        const tarea = createTask({
            title: title.trim(),
            description: finalDescription,
            priority: finalPriority,
        });
        res.status(201).json(tarea);
    } catch (error) {
        return next(error);
    }
});

// Modificar una tarea existente (solo los campos enviados en el body)
router.put("/:id", (req, res, next) => {
    const { id } = req.params;

    if (!getById(id)) {
        const error = new Error("Tarea no encontrada");
        error.status = 404;
        return next(error);
    }

    const { title, description, priority, completed } = req.body;
    const updates = {};

    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            const error = new Error("El campo title debe ser una cadena de texto no vacía");
            error.status = 400;
            return next(error);
        }
        updates.title = title.trim();
    }

    if (description !== undefined) {
        if (typeof description !== "string") {
            const error = new Error("El campo description debe ser una cadena de texto");
            error.status = 400;
            return next(error);
        }
        updates.description = description;
    }

    if (priority !== undefined) {
        if (!validPriorities.includes(priority)) {
            const error = new Error('El campo priority debe ser "low", "mid" o "high"');
            error.status = 400;
            return next(error);
        }
        updates.priority = priority;
    }

    if (completed !== undefined) {
        if (typeof completed !== "boolean") {
            const error = new Error("El campo completed debe ser un booleano");
            error.status = 400;
            return next(error);
        }
        updates.completed = completed;
    }

    if (Object.keys(updates).length === 0) {
        const error = new Error("Debe enviar al menos un campo para actualizar");
        error.status = 400;
        return next(error);
    }

    const tarea = updateTask(id, updates);
    res.status(200).json(tarea);
});

// Eliminar una tarea por su id
router.delete("/:id", (req, res, next) => {
    const { id } = req.params;
    const tarea = deleteTask(id);

    if (!tarea) {
        const error = new Error("Tarea no encontrada");
        error.status = 404;
        return next(error);
    }

    res.status(200).json(tarea);
});
export default router;
