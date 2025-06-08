import type { Request, Response } from "express";
import Proyect from "../models/Proyect";

export class ProyectController {
  static async createProyect(req: Request, res: Response) {
    const proyect = new Proyect({ ...req.body, manager: req.user._id });
    try {
      await proyect.save();
      res.status(201).json({ message: "Proyecto creado correctamente", proyect });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getAllProyects(req: Request, res: Response) {
    try {
      const proyects = await Proyect.find({
        $or: [{ manager: { $in: [req.user._id] } }, { team: { $in: [req.user._id] } }],
      });
      res.status(200).json({ message: "Proyectos obtenidos correctamente", proyects });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getProyectById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const proyect = await Proyect.findById(id).populate("tasks");
      if (!proyect) {
        res.status(404).json({ message: "Proyecto no encontrado" });
        return;
      }

      if (proyect.manager.toString() !== req.user.id.toString() && !proyect.team.includes(req.user.id)) {
        res.status(401).json({ message: "No tienes permisos para acceder a este proyecto" });
        return;
      }

      res.status(200).json({ message: "Proyecto obtenido correctamente", proyect });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async updateProyectById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const proyect = await Proyect.findByIdAndUpdate(id, req.body);

      if (!proyect) {
        res.status(404).json({ message: "Proyecto no encontrado" });
        return;
      }

      if (proyect.manager.toString() !== req.user.id.toString()) {
        res.status(401).json({ message: "No tienes permisos para acceder a este proyecto" });
        return;
      }

      await proyect.save();
      res.status(200).json({ message: "Proyecto actualizado correctamente", proyect });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async deleteProyectById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const proyect = await Proyect.findByIdAndDelete(id);

      if (!proyect) {
        res.status(404).json({ message: "Proyecto no encontrado" });
        return;
      }

      if (proyect.manager.toString() !== req.user.id.toString()) {
        res.status(401).json({ message: "No tienes permisos para acceder a este proyecto" });
        return;
      }

      res.status(200).json({ message: "Proyecto eliminado correctamente" });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
