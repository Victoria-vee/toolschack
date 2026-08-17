import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface ITool extends Document {
  name: string;
  description: string;
  category: string;
  link: string;
  submittedBy: Types.ObjectId;
  upvotes: Types.ObjectId[];
  createdAt: Date;
}

const toolSchema = new Schema<ITool>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    link: {
      type: String,
      required: true,
      trim: true,
    },

    submittedBy: {
      type:Types.ObjectId,
      ref: "User",
      required: true,
    },

    upvotes: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Tool = mongoose.model<ITool>("Tool", toolSchema);