import AddReview from "@/components/product/AddReview";
import AddProduct from "@/components/product/AddProduct";
import DeleteProduct from "@/components/delete/DeleteProduct";

import ProductView from "@/components/product/ProductView";
import { getProductById } from "@/lib/actions/products";
import { getReviewsAndRating } from "@/lib/actions/reviews";
import ReviewDisplay from "@/components/product/Review";

export const revalidate = 1;

export default async function Page({ params }: { params: { path: string[] } }) {
  const method = params.path[0];
  const id = params.path[1];

  if (method === "new") {
    return <AddProduct />;
  }

  // Get product detail
  const product = await getProductById(id);

  // Get reviews and average rating for product
  const { reviews, averageRating } = await getReviewsAndRating(id);

  if (method === "edit") {
    return <AddProduct edit id={id} product={product} />;
  }
  if (method === "delete") {
    return <DeleteProduct id={id} />;
  }

  return (
    <div className="pt-20 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto py-12 px-4">
      <ProductView product={product} rating={averageRating} />
      <div className="flex flex-col gap-y-5">
        <span className="text-2xl font-bold h-fit">Customer Reviews</span>
        <div className="grid gap-5">
          {reviews.length != 0 ? reviews.map((review, index) => (
            <ReviewDisplay review={review} key={index} />)
          ) : <span className="text-lg">No reviews yet</span>}
        </div>
      </div>
      <div className="md:col-span-2">
        <AddReview productId={id} />
      </div>
    </div>
  );
}
