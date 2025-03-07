"use server";
import dbConnect from "@/lib/db";
import Review from "@/lib/models/review";

export async function getReviewsAndRating(productId: string) {
    await dbConnect();
    // grab all the reviews for the product
    const reviews = await Review.find({ productId });

    let totalRating = 0;
    reviews.forEach((review) => {
        totalRating += review.rating;
    });
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return { reviews, averageRating };
}
