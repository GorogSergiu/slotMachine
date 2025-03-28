import { useState, useEffect } from "react";
import AdminProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { adminGetAllProducts } from "../api/productApi";

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

const ManageProducts = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    adminGetAllProducts()
      .then((data) => {
        setAllProducts(data);
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleClick = () => {
    navigate("/admin/add-product");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter((p) =>
        p.name.toLowerCase().includes(term.toLowerCase())
      );
      setProducts(filtered);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row justify-between">
        <button className="btn btn-primary mb-4" onClick={handleClick}>
          Adaugă produs
        </button>
        <label className="input">
          <MagnifyingGlassIcon className="size-6" />
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Caută..."
          />
        </label>
      </div>
      <h1 className="text-2xl font-bold mb-4">Produse</h1>
      <div className="flex flex-col">
        {products.map((product) => (
          <AdminProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;
