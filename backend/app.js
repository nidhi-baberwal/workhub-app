import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});

//middleware
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/tasks" , taskRoutes);

export default app;