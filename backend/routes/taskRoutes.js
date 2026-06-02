import express from "express";
import {
    createTask,
    getTasks,
    getMyTasks,
    updateTask,
    deleteTask,
    assignTask

} from "../controllers/taskController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/my-tasks", authMiddleware, getMyTasks);
router.get("/:workspaceId", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.put("/:taskId/assign", authMiddleware, assignTask);


export default router;