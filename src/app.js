import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import { logRequests } from "./middlewares/logRequests.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { responseLogger } from "./middlewares/responseLogger.js";
import limiterMiddleware from "./middlewares/limiter.js";
import { discordLogMiddleware } from "./middlewares/discordLogger.js";

const app = express();

app.set("trust proxy", true);

app.use(cors());

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(express.json());

// app.use(limiterMiddleware);

app.use(discordLogMiddleware);

app.use(responseLogger);

app.use(logRequests);

app.use(routes);

app.use(notFound);

app.use(errorHandler);

export default app;
