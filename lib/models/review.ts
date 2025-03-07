import { Schema, model, Document, models } from "mongoose";

interface Review {
    author: { name: string, email: string };
    rating: number;
    content: string;
    productId: string | Schema.Types.ObjectId;
}

const ReviewSchema = new Schema<Review>({
    author: {
        name: { type: String, required: true },
        email: { type: String, required: true },
    },
    rating: { type: Number, required: true },
    content: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
});

const Review = models?.Review || model<Review>("Review", ReviewSchema);

export default Review;
