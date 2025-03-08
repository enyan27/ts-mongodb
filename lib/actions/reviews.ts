"use server";
import dbConnect from "@/lib/db";
import Review from "@/lib/models/review";
import mongoose from "mongoose";
import { unstable_cache as cache, revalidateTag } from "next/cache";

// Read - 1 (Easier but worse performance)
// async function _getReviewsAndRating(productId: string) {
//     await dbConnect();
//     // grab all the reviews for the product
//     const reviews = await Review.find({ productId });

//     let totalRating = 0;
//     reviews.forEach((review) => {
//         totalRating += review.rating;
//     });
//     const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

//     return { reviews, averageRating };
// }

// Read - 2 (Harder but better performance)
async function _getReviewsAndRating(productId: string) {
    await dbConnect();
    const reviews = await Review.find({ productId });
    const averageRatingQuery = await Review.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId) } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    // Because query just return an array, so we need to get the result as a 'Number'
    const averageRating = averageRatingQuery[0]?.avgRating || 0;

    return { reviews, averageRating };
}
export const getReviewsAndRating = cache(_getReviewsAndRating, ['getReviewsAndRating'], {
    tags: ['Review'], // Tag must be matched with revalidateTag
    revalidate: 60, // Re-fetch the data every 60 secondsdas
});

// Create
export async function createReview(review: Review) {
    await dbConnect();
    try {
        const newRivew = await Review.create(review);
        revalidateTag('Review');
        return newRivew._id.toString();
    } catch (error) {
        console.error("Error creating review:", error);
        throw new Error("Error creating review");
    }
}
