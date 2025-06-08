import type { Request, Response } from "express";
import User from "../models/User";
import Proyect from "../models/Proyect";

export class TeamController {
  static async finMemberById(req: Request, res: Response) {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("id name email");

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({ user });
    return;
  }

  static async addMemberToProyect(req: Request, res: Response) {
    const { id } = req.body;

    const user = await User.findById(id).select("id");

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    if (req.proyecto.team.some((team) => team.toString() === user.id.toString())) {
      res.status(400).json({ message: "Usuario ya agregado al proyecto" });
      return;
    }

    req.proyecto.team.push(user.id);

    await req.proyecto.save();

    res.status(200).json({ message: "Usuario agregado al proyecto" });
  }

  static async removeMemberFromProyect(req: Request, res: Response) {
    const { userId } = req.params;

    if (!req.proyecto.team.some((team) => team.toString() === userId.toString())) {
      res.status(400).json({ message: "Usuario no encontrado en el proyecto" });
      return;
    }

    req.proyecto.team = req.proyecto.team.filter((team) => team.toString() !== userId.toString());

    await req.proyecto.save();

    res.status(200).json({ message: "Usuario eliminado del proyecto" });
  }

  static async getProyectTeam(req: Request, res: Response) {
    const { idProyecto } = req.params;
    const proyect = await Proyect.findById(idProyecto).populate("team");

    if (!proyect) {
      res.status(404).json({ message: "Proyecto no encontrado" });
      return;
    }

    res.status(200).json({ team: proyect.team });
    return;
  }
}
