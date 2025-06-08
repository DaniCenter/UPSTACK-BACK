import type { Request, Response, NextFunction } from "express";
import type { ProyectType } from "../models/Proyect";
import Proyect from "../models/Proyect";
import Task from "../models/Task";
import type { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      proyecto: ProyectType;
      task: ITask;
    }
  }
}

export async function taskBelongsToProyect(req: Request, res: Response, next: NextFunction) {
  if (req.task.proyect.toString() !== req.proyecto.id) {
    res.status(404).json({ message: "Tarea no pertenece al proyecto" });
    return;
  }
  next();
}

export async function existsProyect(req: Request, res: Response, next: NextFunction) {
  const { idProyecto } = req.params;
  const proyecto = await Proyect.findById(idProyecto);
  if (!proyecto) {
    res.status(404).json({ message: "Proyecto no encontrado" });
    return;
  }
  req.proyecto = proyecto;
  next();
}

export async function existsTask(req: Request, res: Response, next: NextFunction) {
  const { idTask } = req.params;
  const task = await Task.findById(idTask).populate("createdBy");
  if (!task) {
    res.status(404).json({ message: "Tarea no encontrada" });
    return;
  }
  req.task = task;
  next();
}

export async function hasAutorization(req: Request, res: Response, next: NextFunction) {
  if (req.user.id.toString() !== req.proyecto.manager.toString()) {
    res.status(401).json({ message: "No tienes autorización para esta acción" });
    return;
  }
  next();
}
