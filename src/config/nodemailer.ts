import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const config = () => {
  return {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "4b865118047595",
      pass: "e7d1b09e14ac13",
    },
  };
};

export const transporter = nodemailer.createTransport(config());
