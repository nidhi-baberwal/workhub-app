import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

//Log every request
app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});

//middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("TaskFlow API is running");
});


app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/tasks" , taskRoutes);

export default app;