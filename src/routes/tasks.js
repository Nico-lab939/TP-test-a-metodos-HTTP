import { Router } from 'express';
const router = Router();
import { getAllTasks, getById, createTask } from '../services/fileStore.js';

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
    const validPriorities = ["low", "mid", "high"];

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

router.put("/:id", (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Tarea ${id} actualizada exitosamente` });
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    res.status(200).json({ message: `Tarea ${id} eliminada exitosamente` });
});
export default router;
