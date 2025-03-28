import React from "react";
import { Link } from "react-router-dom";

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  secondaryImages: string[];
  primaryImage: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="border p-4 rounded shadow">
      <img
        src={`http://localhost:5001${product.primaryImage}`}
        alt={product.name}
        className="w-[300px] h-[300px] object-cover"
      />
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-600">{product.price} RON</p>
      <Link to={`/product/${product._id}`} className="text-blue-500">
        Vezi detalii
      </Link>
    </div>
  );
};

export default ProductCard;
