import { transporter } from "../config/nodemailer";

type IUser = {
  email: string;
  name: string;
};

type IToken = {
  token: string;
};

export class AuthEmail {
  static async sendConfirmationEmail(user: IUser, token: IToken) {
    const mailOptions = {
      from: "Upstack <upstack@upstack.com>",
      to: user.email,
      subject: "Confirmación de cuenta",
      html: `
      <div>
        <h1>Confirmación de cuenta</h1>
        <p>Hola ${user.name}, tu token es: ${token.token}, este token expira en 5 minutos, puede usar este <a href="${process.env.FRONTEND_URL}/auth/confirm-account">enlace</a> para confirmar su cuenta</p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  static async sendForgotPasswordEmail(user: IUser, token: IToken) {
    const mailOptions = {
      from: "Upstack <upstack@upstack.com>",
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
      <div>
        <h1>Recuperación de contraseña</h1>
        <p>Hola ${user.name}, tu token es: ${token.token}, este token expira en 5 minutos, puede usar este <a href="${process.env.FRONTEND_URL}/auth/new-password">enlace</a> para recuperar su contraseña</p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}
