import { Request, Response, NextFunction } from "express";
import { Tool } from "./tool.model";
import { AuthenticatedRequest } from "../users/types";

export async function createTool(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, description, category, link } = req.body;

    const userId = (req as AuthenticatedRequest).user.id;

    const tool = await Tool.create({
      name,
      description,
      category,
      link,
      submittedBy: userId,
      upvotes: [],
    });

    res.status(201).json({
      message: "AI tool submitted successfully",
      tool,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTool(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = (req as AuthenticatedRequest).user.id;

    const tool = await Tool.findById(id);

    if (!tool) {
      res.status(404).json({
        error: "Tool not found"
      });
      return;
    }

    if (!tool.submittedBy.equals(userId)) {
      res.status(403).json({
        error: "You are not allowed to delete this tool"
      });
      return;
    }

    await Tool.findByIdAndDelete(id);

    res.status(200).json({
      message: "Tool deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}

export async function getTools(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tools = await Tool.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      tools,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPopularTools(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tools = await Tool.aggregate([
      {
        $addFields: {
          upvoteCount: { $size: "$upvotes" }
        }
      },
      {
        $sort: {
          upvoteCount: -1
        }
      }
    ]);

    res.status(200).json({
      tools
    });
  } catch (error) {
    next(error);
  }
}

export async function upvoteTool(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = (req as AuthenticatedRequest).user.id;

    const tool = await Tool.findById(id);

    if (!tool) {
      res.status(404).json({
        error: "Tool not found"
      });
      return;
    }

    if (tool.upvotes.some((upvote) => upvote.equals(userId))) {
      res.status(400).json({
        error: "You have already upvoted this tool"
      });
      return;
    }

    tool.upvotes.push(userId);
    await tool.save();

    res.status(200).json({
      message: "Tool upvoted successfully",
      upvoteCount: tool.upvotes.length
    });
  } catch (error) {
    next(error);
  }
}

export async function removeUpvote(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = (req as AuthenticatedRequest).user.id;

    const tool = await Tool.findById(id);

    if (!tool) {
      res.status(404).json({
        error: "Tool not found"
      });
      return;
    }

    const hasUpvoted = tool.upvotes.some((upvote) => upvote.equals(userId));

    if (!hasUpvoted) {
      res.status(400).json({
        error: "You have not upvoted this tool"
      });
      return;
    }

    tool.upvotes = tool.upvotes.filter(
      (upvote) => !upvote.equals(userId)
    );

    await tool.save();

    res.status(200).json({
      message: "Upvote removed successfully",
      upvoteCount: tool.upvotes.length
    });
  } catch (error) {
    next(error);
  }
}

export async function getRelatedTools(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const tool = await Tool.findById(id);

    if (!tool) {
      res.status(404).json({
        error: "Tool not found"
      });
      return;
    }

    const relatedTools = await Tool.find({
      category: tool.category,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      tools: relatedTools
    });
  } catch (error) {
    next(error);
  }
}