import { Note } from "../models/Note";
import type { Request, Response } from "express";

export class NoteController {
  static async createNote(req: Request, res: Response) {
    try {
      const { content } = req.body;

      const note = await Note.create({ content, createdBy: req.user.id.toString(), task: req.task.id.toString() });
      req.task.notes.push(note.id.toString());
      await req.task.save();
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getNotesByTaskId(req: Request, res: Response) {
    try {
      const notes = await Note.find({ task: req.task.id.toString() });
      res.status(200).json(notes);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static async deleteNoteById(req: Request, res: Response) {
    try {
      if (req.task.createdBy.id.toString() !== req.user.id.toString()) {
        res.status(403).json({ message: "No tienes permisos para eliminar esta nota" });
        return;
      }

      await Note.findByIdAndDelete(req.params.idNote);
      req.task.notes = req.task.notes.filter((note) => note.toString() !== req.params.idNote);
      await req.task.save();
      res.status(200).json({ message: "Nota eliminada correctamente" });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
