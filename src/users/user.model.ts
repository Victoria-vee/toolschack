import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  username:string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, trim: true, 
      lowercase: true
    },

    passwordHash: { 
      type: String, 
      required: true 
    }
}, { 
  timestamps: { 
    createdAt: true, 
    updatedAt: false 
  },
  versionKey:false,
});

export const User = mongoose.model('User', userSchema);