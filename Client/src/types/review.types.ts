export interface IReview {
  _id?: string;
  user_id: string; // Mongo ObjectId
  media_id: string; // Mongo ObjectId
  rating: number; // 1 to 10
  title?: string;
  content: string;
  is_spoiler?: boolean;
  helpful_votes?: number;
  is_approved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
