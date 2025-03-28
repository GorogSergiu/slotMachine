import React, { useState, useEffect } from "react";
import { getAllProducts, ProductData } from "../api/productApi";
import ProductCard from "../components/ProductCard";

const Shop: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
