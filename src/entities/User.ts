import mongoose, { Schema, Model } from 'mongoose';
import { ROLES, Role } from '../utils/constants';
import { generateUUID } from '../utils/helpers';

export interface IUser {
  _id: string;
  Id: string;
  Name: string;
  Email: string;
  Password: string;
  Role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, default: generateUUID },
    Id: { type: String, required: true, unique: true, default: generateUUID },
    Name: { type: String, required: true, trim: true },
    Email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    Password: { type: String, required: true, select: false },
    Role: { type: String, required: true, enum: ROLES },
  },
  { timestamps: true, _id: false }
);

userSchema.index({ Email: 1 }, { unique: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
