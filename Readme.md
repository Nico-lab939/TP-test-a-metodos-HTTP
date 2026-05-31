rutas correctas
•	http://localhost:3000/health
•	http://localhost:3000/api/v1/tasks
•	http://localhost:3000/api/v1/tasks/<id-de-una-tarea>
•	http://localhost:3000/api/v1/tasks/d11406b4-9c8e-4fc4-8cb6-dee2eb9e9967
•	http://localhost:3000/tasks → 404 (falta el prefijo) 
codigo tasks profe 
import { Router } from 'express';
const router = Router();
import { getAllTasks } from '../services/fileStore.js';

// implementar
router.get("/", (req, res) => {
    const tareas = getAllTasks();
    console.log(tareas);

});

// implementar
router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    res.status(200).json({ tarea: `Tarea ${id}` });
});

router.post("/", (req, res) => {
    res.status(201).json({ message: "Tarea creada exitosamente" });
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
// implementar 
/*
Notas: 
1. El campo id debe ser único y generado automáticamente (debe ser un UUID)-> crypto.randomUUID() para generar un id único
2. El campo title es obligatorio y debe ser una cadena de texto no vacía.
3. El campo description es opcional y puede ser una cadena de texto. Si el usuario no envía este campo, se debe establecer como una cadena vacía ("").
4. El campo priority es "low", "mid" o "high", y por defecto debe ser "low". Si el usuario no envía este campo, se debe establecer como "low". OPCIONAL: Si el usuario envía un valor que no es "low", "mid" o "high", se debe responder con un error 400 Bad Request. 
4. El campo completed es un booleano que indica si la tarea está completada o no, y por defecto debe ser false. El usuario no envía un valor inicial.
5. Los campos createdAt y updatedAt deben ser generados automáticamente por el servidor al crear o actualizar una tarea, respectivamente. El usuario no envía estos campos en la solicitud. Ejemplo: new Date().toISOString() para generar la fecha actual en formato ISO 8601.