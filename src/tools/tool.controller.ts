import { Request, Response, NextFunction } from "express";
import { Tool } from "./tool.model";
import { AuthenticatedRequest } from "../users/user.types";

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
      message: "AI tool added",
      data:{
      tool,
      }
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
        error: "You can only delete tools you have added"
      });
      return;
    }

    await Tool.findByIdAndDelete(id);

    res.status(200).json({
      message: "Tool deleted "
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
      .populate("submittedBy", "username")
      .populate("upvotes", "username")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: {
        count: tools.length,
        tools,
      }
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
    await Tool.populate(tools, {
  path: "submittedBy",
  select: "username"
});

    res.status(200).json({
      data: {
        count:tools.length,
        tools
      }
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

    const tool = await Tool.findById(id)
      .populate("submittedBy", "username")
      .populate("upvotes", "username")
      .populate("comments.user", "username");

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
    const tools = await Tool.find()
  
    await tool.save();

    res.status(200).json({
      message: "Tool upvoted",
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

    // const hasUpvoted = tool.upvotes.some((upvote) => upvote.equals(userId));

    tool.upvotes = tool.upvotes.filter(
      (upvote) => !upvote.equals(userId)
    );

    await tool.save();

    res.status(200).json({
      message: "Upvote removed",
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

    const tool = await Tool.findById(id)
      .populate("submittedBy", "username")
      .populate("upvotes", "username")
      .populate("comments.user", "username"); 

    if (!tool) {
      res.status(404).json({
        error: "Tool not found"
      });
      return;
    }

    const relatedTools = await Tool.find({
      category: tool.category,
    })
      .populate("submittedBy", "username")
       .populate("upvotes", "username")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
        data: {
          relatedBy: "category",
          category: tool.category,
          count: relatedTools.length,
          tools: relatedTools
        }
    });
  } catch (error) {
    next(error);
  }
}

export async function addComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const user = (req as AuthenticatedRequest).user;
    const tool = await Tool.findById(id);

    if (!tool) {
      res.status(404).json({
        error: "Tool not found",
      });
      return;
    }

    tool.comments.push({
      content: content.trim(),
      user: user.id,
      createdAt: new Date(),
    });

    await tool.save();
    
    await tool.populate("comments.user", "username");

    res.status(201).json({
      message: "Comment added",
      comment: tool.comments[tool.comments.length - 1],
    });
  } catch (error) {
    next(error);
  }
}

export async function getCommentsByTool  (req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const{ id } = req.params;

    const tool = await Tool.findById(id)
    // .populate("user", "username");

    if (!tool) {
      res.status(404).json({
        error: "Tool not found",
      });
      return;
    }
    
    res.status(200).json({
      count: tool.comments.length,
      comments: tool.comments,
    });
  } catch (error) {
    next(error);
  }
}