import mongoose, { Schema, Model } from 'mongoose';
import { generateUUID } from '../utils/helpers';

export interface IReadLog {
  _id: string;
  Id: string;
  ArticleId: string;
  ReaderId: string | null;
  ReadAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const readLogSchema = new Schema<IReadLog>(
  {
    _id: { type: String, default: generateUUID },
    Id: { type: String, required: true, unique: true, default: generateUUID },
    ArticleId: { type: String, required: true, ref: 'Article' },
    ReaderId: { type: String, default: null, ref: 'User' },
    ReadAt: { type: Date, default: Date.now },
  },
  { timestamps: true, _id: false }
);

readLogSchema.index({ ArticleId: 1, ReadAt: 1 });
readLogSchema.index({ ArticleId: 1, ReaderId: 1, ReadAt: -1 });

export const ReadLog: Model<IReadLog> = mongoose.models.ReadLog || mongoose.model<IReadLog>('ReadLog', readLogSchema);
