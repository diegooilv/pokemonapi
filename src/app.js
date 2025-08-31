import express from "express";
import cors from "cors";
import helmet from "helmet"; 
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { logRequests } from "./middlewares/logRequests.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { responseLogger } from "./middlewares/responseLogger.js";
import { conditionalLimiter } from "./middlewares/limiter.js"

const app = express();

app.use(helmet());

app.use(conditionalLimiter);

app.use(cors());

app.use(express.json()); 

app.use(responseLogger);

app.use(logRequests); 

app.use(routes); 

app.use(notFound);

app.use(errorHandler);

export default app;