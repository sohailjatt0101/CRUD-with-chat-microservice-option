import express from "express";
import { requestLogger } from "./middlewares/requestLogger.middleware";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { errorHandler} from "./middlewares/error.middleware";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

export default app;
