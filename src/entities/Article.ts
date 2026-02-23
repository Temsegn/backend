import mongoose, { Schema, Model } from 'mongoose';
import { ARTICLE_STATUS, ArticleStatus } from '../utils/constants';
import { generateUUID } from '../utils/helpers';

export interface IArticle {
  _id: string;
  Id: string;
  Title: string;
  Content: string;
  Category: string;
  Status: ArticleStatus;
  AuthorId: string;
  CreatedAt: Date;
  DeletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    _id: { type: String, default: generateUUID },
    Id: { type: String, required: true, unique: true, default: generateUUID },
    Title: { type: String, required: true, trim: true, minlength: 1, maxlength: 150 },
    Content: { type: String, required: true, minlength: 50 },
    Category: { type: String, required: true, trim: true },
    Status: { type: String, required: true, enum: ARTICLE_STATUS, default: 'Draft' },
    AuthorId: { type: String, required: true, ref: 'User' },
    CreatedAt: { type: Date, default: Date.now },
    DeletedAt: { type: Date, default: null },
  },
  { timestamps: true, _id: false }
);

articleSchema.index({ AuthorId: 1 });
articleSchema.index({ Status: 1, DeletedAt: 1 });
articleSchema.index({ Title: 'text' });

export const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>('Article', articleSchema);
