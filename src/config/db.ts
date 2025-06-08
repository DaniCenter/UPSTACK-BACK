import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL!);
    console.log(colors.green(`MongoDB connected: ${connection.connection.host}:${connection.connection.port}`));
  } catch (error) {
    console.log(colors.red(`Error: ${error}`));
    process.exit(1);
  }
};
