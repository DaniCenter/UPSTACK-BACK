import server from "./server";
import colors from "colors";

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  try {
    console.log(colors.green(`Server is running on port http://localhost:${PORT}`));
  } catch (error) {
    console.log(colors.red(`Error: ${error}`));
  }
});
