import mongoose, { Schema, Model } from 'mongoose';
import { generateUUID } from '../utils/helpers';

export interface IDailyAnalytics {
  _id: string;
  Id: string;
  ArticleId: string;
  ViewCount: number;
  Date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const dailyAnalyticsSchema = new Schema<IDailyAnalytics>(
  {
    _id: { type: String, default: generateUUID },
    Id: { type: String, required: true, unique: true, default: generateUUID },
    ArticleId: { type: String, required: true, ref: 'Article' },
    ViewCount: { type: Number, required: true, default: 0 },
    Date: { type: Date, required: true },
  },
  { timestamps: true, _id: false }
);

dailyAnalyticsSchema.index({ ArticleId: 1, Date: 1 }, { unique: true });

export const DailyAnalytics: Model<IDailyAnalytics> =
  mongoose.models.DailyAnalytics || mongoose.model<IDailyAnalytics>('DailyAnalytics', dailyAnalyticsSchema);
