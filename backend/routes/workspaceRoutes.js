import express from "express";
import { 
    getWorkspaces, 
    createWorkspace,
    updateWorkspace, 
    deleteWorkspace, 
    addMember } from "../controllers/workspaceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

console.log(" WORKSPACE ROUTES LOADED");

const router = express.Router();

router.get("/", authMiddleware, getWorkspaces);
router.post("/", authMiddleware, createWorkspace);
router.post("/:workspaceId/members",
    authMiddleware,
    addMember
);
router.delete("/:workspaceId", 
    authMiddleware,
     (req, res, next) => {
    console.log(" DELETE ROUTE HIT:", req.params.workspaceId);
    next();
  },
    deleteWorkspace
);
router.put("/:workspaceId",
    authMiddleware,
    updateWorkspace
);

export default router;