"use server"
import dbConnect from '@/lib/db';
import Product from '../models/product';

export async function createProduct(product: Product) {
    try {
        await dbConnect();
        const newProduct = await Product.create(product);
        return newProduct._id.toString();
    } catch (error) {
        console.error("Error creating product:", error);
        throw new Error("Error creating product");
    }
}

export async function getProductById(_id: string) {
    await dbConnect();
    try {
        const product = await Product.findById(_id);
        if (!product) {
            return null;
        }
        return product;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateProduct(productId: string, data: Partial<Product>) {
    await dbConnect();
    try {
        const updateProduct = await Product.findByIdAndUpdate(productId, data, { new: true });

        return updateProduct._id.toString();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function deleteProduct(productId: string): Promise<boolean> {
    await dbConnect();
    try {
        const result = await Product.deleteOne({ _id: productId });
        // Because deleteOne always return 'true' even if the product isn't found, so we need deleteCount to make sure that the product is deleted or not.

        return result.deletedCount === 1;
    } catch (error) {
        console.error('Error deleting product', error);
        return false;
    }
}

