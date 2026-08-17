import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface IComment
{
  _id?: Types.ObjectId;
  content: string;
  user: Types.ObjectId;
  createdAt: Date;
}

export interface ITool extends Document {
  name: string;
  description: string;
  category: string;
  link: string;
  submittedBy: Types.ObjectId;
  upvotes: Types.ObjectId[];
  comments: IComment[];
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
    comments: [
      {
        content: {
          type: String,
          required: true,
          trim: true,
        },
        user: {
          type: Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Tool = mongoose.model<ITool>("Tool", toolSchema);