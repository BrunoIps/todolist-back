import express, { NextFunction, Request, Response } from "express";
import routes from "./routes";
import timeout from "connect-timeout";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { errorHandler } from "./app/middleware/errorHandler";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json({ limit: "50mb" }));

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(
  bodyParser.raw({
    limit: "50mb",
  })
);

app.use(timeout("59s"));

app.use(routes);

app.use(errorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.timedout) next();
});

app.use((err: any, req: Request, res: Response) => {
  const statusCode = err.status || 500;
  if (req.timedout) {
    res.status(503).json({ error: "Request timed out" });
  }
  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode,
      stack: err.stack,
    },
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
