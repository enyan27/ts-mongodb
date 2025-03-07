import { Schema, model, Document, models } from "mongoose";

interface Product {
    name: string;
    price: number;
    description: string;
    category: string;
    images: string[];
}

const ProductSchema = new Schema<Product>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String, required: true }],
});

const Product = models?.Product || model<Product>("Product", ProductSchema);

export default Product;
