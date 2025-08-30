import express from "express";
import cors from "cors";
import helmet from "helmet"; 
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { logRequests } from "./middlewares/logRequests.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { responseLogger } from "./middlewares/responseLogger.js";

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 100, // Limite de 10 requisições por IP
  message:
    "Muitas requisições feitas de seu IP. Tente novamente depois de 5 minutos.",
});
app.use(limiter);

app.use(cors());

app.use(express.json()); 

app.use(responseLogger);

app.use(logRequests); 

app.use(routes); 

app.use(notFound);

app.use(errorHandler);

export default app;