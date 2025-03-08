"use server"
import dbConnect from '@/lib/db';
import Product from '../models/product';
import { unstable_cache as cache, revalidateTag } from 'next/cache';

// Read All
export async function getProducts(page: number, searchParam: string, minPriceParam: number, categoryParam: string) {
    await dbConnect();

    const limit = 5;
    const skip = (page - 1) * limit;

    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'reviews'
                }
            },
            {
                $project: {
                    name: 1,
                    // We just need 1 image in array
                    image: { $first: '$images' },
                    price: 1,
                    category: 1,
                    avgRating: { $avg: '$reviews.rating' }
                }
            },
            {

                $match: {
                    // 'i' means case-insensitive, so it will match 'iphone' and 'IPHONE'
                    name: { $regex: searchParam, $options: 'i' },
                    price: { $gte: minPriceParam },
                    ...(categoryParam && { category: categoryParam })
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ])

        return products;
    } catch (error) {
        console.log(error);
    }
};

// Read by Id
async function _getProductById(_id: string) {
    await dbConnect();
    try {
        const product = await Product.findById(_id);
        if (!product) return null;

        return product;
    } catch (error) {
        console.log(error);
        return null;
    }
}
export const getProductById = cache(_getProductById, ['getProductById'], {
    tags: ['Product'], // Tag must be matched with revalidateTag
    revalidate: 60, // Re-fetch the data every 60 seconds
});

// Create
export async function createProduct(product: Product) {
    await dbConnect();
    try {
        const newProduct = await Product.create(product);
        return newProduct._id.toString();
    } catch (error) {
        console.error("Error creating product:", error);
        throw new Error("Error creating product");
    }
}

// Update
export async function updateProduct(productId: string, data: Partial<Product>) {
    await dbConnect();
    try {
        const updateProduct = await Product.findByIdAndUpdate(productId, data, { new: true });

        // Mark the data as stale, and re-fetch it from the database
        revalidateTag('Product');
        return updateProduct._id.toString();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Delete
export async function deleteProduct(productId: string): Promise<boolean> {
    await dbConnect();
    try {
        const result = await Product.deleteOne({ _id: productId });

        // Mark the data as stale, and re-fetch it from the database
        revalidateTag('Product');

        // Because deleteOne always return 'true' even if the product isn't found, so we need deleteCount to make sure that the product is deleted or not.
        return result.deletedCount === 1;
    } catch (error) {
        console.error('Error deleting product', error);
        return false;
    }
}
