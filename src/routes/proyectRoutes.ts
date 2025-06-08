import { Router } from "express";
import { ProyectController } from "../controllers/ProyectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { existsProyect, existsTask, hasAutorization, taskBelongsToProyect } from "../middleware/proyect";
import { authenticate } from "../middleware/auth";
import { TeamController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

router.use(authenticate);
router.param("idProyecto", existsProyect);
router.param("idTask", existsTask);
router.param("idTask", taskBelongsToProyect);

router.put(
  "/:idProyecto/tasks/:idTask/status",
  param("idProyecto").isMongoId().withMessage("El id del proyecto no es válido"),
  param("idTask").isMongoId().withMessage("El id de la tarea no es válido"),
  body("status").notEmpty().withMessage("El estado de la tarea es requerido"),
  handleInputErrors,
  TaskController.updateStatusTaskById
);

router.delete(
  "/:idProyecto/tasks/:idTask",
  hasAutorization,
  param("idProyecto").isMongoId().withMessage("El id del proyecto no es válido"),
  param("idTask").isMongoId().withMessage("El id de la tarea no es válido"),
  TaskController.deleteTaskById
);

router.put(
  "/:idProyecto/tasks/:idTask",
  hasAutorization,
  param("idProyecto").isMongoId().withMessage("El id del proyecto no es válido"),
  param("idTask").isMongoId().withMessage("El id de la tarea no es válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es requerido"),
  body("description").notEmpty().withMessage("La descripción de la tarea es requerida"),
  handleInputErrors,
  TaskController.updateTaskById
);

router.get("/", ProyectController.getAllProyects);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("El id del proyecto no es válido"),
  body("proyectName").notEmpty().withMessage("El nombre del proyecto es requerido"),
  body("clientName").notEmpty().withMessage("El nombre del cliente es requerido"),
  body("description").notEmpty().withMessage("La descripción del proyecto es requerida"),
  handleInputErrors,
  ProyectController.updateProyectById
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("El id del proyecto no es válido"),
  handleInputErrors,
  ProyectController.deleteProyectById
);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("El id del proyecto no es válido"),
  handleInputErrors,
  ProyectController.getProyectById
);

router.post(
  "/",
  authenticate,
  body("proyectName").notEmpty().withMessage("El nombre del proyecto es requerido"),
  body("clientName").notEmpty().withMessage("El nombre del cliente es requerido"),
  body("description").notEmpty().withMessage("La descripción del proyecto es requerida"),
  handleInputErrors,
  ProyectController.createProyect
);

router.post(
  "/:idProyecto/tasks",
  param("idProyecto").isMongoId().withMessage("El id del proyecto no es válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es requerido"),
  body("description").notEmpty().withMessage("La descripción de la tarea es requerida"),
  handleInputErrors,
  TaskController.createTask
);

router.get(
  "/:idProyecto/tasks",
  param("idProyecto").isMongoId().withMessage("El id del proyecto no es válido"),
  handleInputErrors,
  TaskController.getProyectTasks
);

router.get(
  "/:idProyecto/tasks/:idTask",
  param("idProyecto").isMongoId().withMessage("El id del proyecto no es válido"),
  param("idTask").isMongoId().withMessage(" El id de la tarea no es válido"),
  TaskController.getTaskById
);

// Teams routes
router.post(
  "/:idProyecto/team/find",
  body("email").notEmpty().withMessage("El email es requerido"),
  handleInputErrors,
  TeamController.finMemberById
);

router.post(
  "/:idProyecto/team",
  body("id").notEmpty().withMessage("El id es requerido"),
  body("id").isMongoId().withMessage("El id no es válido"),
  handleInputErrors,
  TeamController.addMemberToProyect
);

router.delete(
  "/:idProyecto/team/:userId",
  param("idProyecto").isMongoId().withMessage("El id del proyecto no es válido"),
  param("userId").isMongoId().withMessage("El id del usuario no es válido"),
  handleInputErrors,
  TeamController.removeMemberFromProyect
);

router.get("/:idProyecto/team", handleInputErrors, TeamController.getProyectTeam);

// Notes routes
router.post(
  "/:idProyecto/tasks/:idTask/notes",
  body("content").notEmpty().withMessage("El contenido de la nota es requerido"),
  handleInputErrors,
  NoteController.createNote
);

router.get("/:idProyecto/tasks/:idTask/notes", handleInputErrors, NoteController.getNotesByTaskId);

router.delete(
  "/:idProyecto/tasks/:idTask/notes/:idNote",
  param("idNote").isMongoId().withMessage("El id de la nota no es válido"),
  handleInputErrors,
  NoteController.deleteNoteById
);

export default router;
