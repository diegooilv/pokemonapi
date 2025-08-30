import http from 'http';
import dotenv from 'dotenv';  
import app from './app.js';

dotenv.config(); 

const startServer = async () => {
  try {
    const port = process.env.PORT || 3000;
    const server = http.createServer(app);

    server.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

startServer();
