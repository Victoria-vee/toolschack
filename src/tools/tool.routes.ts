import { Router } from "express";
import { createTool, deleteTool, getTools, getPopularTools, upvoteTool, removeUpvote, getRelatedTools, addComment, getCommentsByTool } from "./tool.controller";
import { authGuard } from "../users/user.middleware";

const router = Router();

router.post("/", authGuard, createTool);
router.get("/:id/related", getRelatedTools);

router.delete("/:id", authGuard, deleteTool);
router.get("/:id/comments", getCommentsByTool)

router.get("/", getTools);
router.get("/popular", getPopularTools);
router.post("/:id/upvote", authGuard, upvoteTool);
router.delete("/:id/upvote", authGuard, removeUpvote);
router.post("/:id/comments", authGuard, addComment);



export default router;