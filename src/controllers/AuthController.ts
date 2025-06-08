import type { Request, Response } from "express";
import User from "../models/User";
import { comparePassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generarToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateToken } from "../utils/jwt";

export class AuthController {
  static async createAccount(req: Request, res: Response) {
    try {
      const user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
      });

      // Prevent duplicate email
      const userFound = await User.findOne({ email: user.email });
      if (userFound) {
        res.status(409).json({ message: "El email ya está en uso" });
        return;
      }

      // Hash password
      const hashedPassword = await hashPassword(user.password);
      user.password = hashedPassword;

      const token = new Token({
        token: generarToken(),
        user: user._id,
      });

      // enviar email
      await AuthEmail.sendConfirmationEmail(user, token);

      await Promise.allSettled([user.save(), token.save()]);

      res.status(201).json({
        message: "Usuario creado correctamente, revise su correo para confirmar su cuenta",
        user,
        token,
      });
    } catch (error) {
      console.log("Error en createAccount:", error);
      res.status(500).json({ message: "Error interno del servidor: " + error });
    }
  }

  static async confirmAccount(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const tokenFound = await Token.findOne({ token });

      if (!tokenFound) {
        res.status(404).json({ message: "Token no encontrado" });
        return;
      }

      await Promise.allSettled([User.findByIdAndUpdate(tokenFound.user, { confirmed: true }), Token.findByIdAndDelete(tokenFound._id)]);
      res.status(200).json({ message: "Cuenta confirmada correctamente" });
    } catch (error) {
      console.log("Error en confirmAccount:", error);
      res.status(500).json({ message: "Ocurrió un error al confirmar la cuenta" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      if (!user.confirmed) {
        const token = new Token({
          token: generarToken(),
          user: user._id,
        });

        await token.save();
        await AuthEmail.sendConfirmationEmail(user, token);

        res.status(401).json({ message: "Usuario no confirmado, se ha enviado un correo para confirmar su cuenta" });
        return;
      }

      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ message: "Contraseña incorrecta" });
        return;
      }

      const token = generateToken({ id: user.id });
      res.status(200).json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
      console.log("Error en login:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async newCode(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      if (user.confirmed) {
        res.status(400).json({ message: "Usuario ya confirmado" });
        return;
      }

      const token = new Token({
        token: generarToken(),
        user: user._id,
      });

      await Promise.allSettled([token.save(), AuthEmail.sendConfirmationEmail(user, token)]);

      res.status(200).json({ message: "Código enviado correctamente" });
    } catch (error) {
      console.log("Error en newCode:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      if (user.confirmed) {
        res.status(400).json({ message: "Usuario ya confirmado" });
        return;
      }

      const token = new Token({
        token: generarToken(),
        user: user._id,
      });

      await Promise.allSettled([token.save(), AuthEmail.sendForgotPasswordEmail(user, token)]);

      res.status(200).json({ message: "Correo enviado correctamente" });
    } catch (error) {
      console.log("Error en forgotPassword:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async validateToken(req: Request, res: Response) {
    try {
      const { token } = req.body;

      const tokenFound = await Token.findOne({ token });

      if (!tokenFound) {
        res.status(404).json({ message: "Token no encontrado" });
        return;
      }

      res.status(200).json({ message: "Token válido", tokenFound });
    } catch (error) {
      console.log("Error en validateToken:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async updatePassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { password, password_confirmation } = req.body;

      if (password !== password_confirmation) {
        res.status(400).json({ message: "Las contraseñas no coinciden" });
        return;
      }

      const tokenFound = await Token.findOne({ token });

      if (!tokenFound) {
        res.status(404).json({ message: "Token no encontrado" });
        return;
      }

      const user = await User.findById(tokenFound.user);

      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      const hashedPassword = await hashPassword(password);
      await Promise.allSettled([User.findByIdAndUpdate(user._id, { password: hashedPassword }), Token.findByIdAndDelete(tokenFound._id)]);

      res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
      console.log("Error en updatePassword:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  static async user(req: Request, res: Response) {
    res.status(200).json(req.user);
    return;
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const { name, email } = req.body;

      const userFound = await User.findOne({ email });

      if (userFound && userFound.id.toString() !== req.user.id.toString()) {
        res.status(400).json({ message: "El email ya está en uso" });
        return;
      }

      req.user.email = email;
      req.user.name = name;

      await Promise.allSettled([req.user.save()]);

      res.status(200).json({ message: "Perfil actualizado correctamente" });
    } catch (error) {
      console.log("Error en updateProfile:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
