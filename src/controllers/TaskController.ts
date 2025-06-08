import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  static async updateStatusTaskById(req: Request, res: Response) {
    try {
      req.task.status = req.body.status;
      req.task.completedBy.push({ user: req.user.id.toString(), status: req.body.status });

      await req.task.save();
      res.status(200).json({ message: "Tarea actualizada correctamente", task: req.task });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async deleteTaskById(req: Request, res: Response) {
    try {
      req.proyecto.tasks = req.proyecto.tasks.filter((task) => task.id !== req.task.id);
      await Promise.allSettled([req.task.deleteOne(), req.proyecto.save()]);
      res.status(200).json({ message: "Tarea eliminada correctamente", task: req.task });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async updateTaskById(req: Request, res: Response) {
    try {
      await req.task.updateOne(req.body);
      res.status(200).json({ message: "Tarea actualizada correctamente", task: req.task });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getTaskById(req: Request, res: Response) {
    try {
      const task = await Task.findById(req.task.id)
        .populate("proyect")
        .populate({
          path: "completedBy",
          select: "name email _id",
        })
        .populate({
          path: "completedBy.user",
          select: "name email _id",
        })
        .populate({
          path: "notes",
          select: "content createdBy createdAt updatedAt",
          populate: {
            path: "createdBy",
            select: "name email _id",
          },
        });
      res.status(200).json({ task });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  static async getProyectTasks(req: Request, res: Response) {
    try {
      const tasks = await Task.find({ proyect: req.proyecto.id }).populate("proyect");
      res.status(200).json({ tasks });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
  static async createTask(req: Request, res: Response) {
    try {
      const task = new Task(req.body);
      task.proyect = req.proyecto.id;
      task.createdBy = req.user.id;
      req.proyecto.tasks.push(task);

      await Promise.all([task.save(), req.proyecto.save()]);
      res.status(201).json({ message: "Tarea creada correctamente", task });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
