import http from "http";
import "dotenv/config";
import app from "./app.js";
import { fetch } from "undici";
global.fetch = fetch;

const startServer = async () => {
  try {
    const port = process.env.PORT || 3000;
    const server = http.createServer(app);

    server.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
};

startServer();
