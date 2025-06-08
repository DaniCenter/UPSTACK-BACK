import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/user", authenticate, AuthController.user);

router.post(
  "/create-account",
  body("email").isEmail().withMessage("El email no es válido"),
  body("password").isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden");
    }
    return true;
  }),
  body("name").isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
  handleInputErrors,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").isString().withMessage("El token no es válido"),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email").isEmail().withMessage("El email no es válido"),
  body("password").isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"),
  handleInputErrors,
  AuthController.login
);

router.post("/new-code", body("email").isEmail().withMessage("El email no es válido"), handleInputErrors, AuthController.newCode);

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("El email no es válido"),
  handleInputErrors,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token").isString().withMessage("El token no es válido"),
  handleInputErrors,
  AuthController.validateToken
);

router.post(
  "/update-password/:token",
  body("password").isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"),
  handleInputErrors,
  AuthController.updatePassword
);

router.put(
  "/profile",
  body("name").isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),
  body("email").isEmail().withMessage("El email no es válido"),
  handleInputErrors,
  authenticate,
  AuthController.updateProfile
);

router.post(
  "/update-password",
  body("password").isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"),
  handleInputErrors,
  authenticate,
  AuthController.updatePassword
);

export default router;
