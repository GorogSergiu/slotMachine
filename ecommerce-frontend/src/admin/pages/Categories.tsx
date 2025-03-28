import { adminGetAllCategories } from "../api/categoryApi";
import AdminCategoryCard from "../components/CategoryCard";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { CategoryData } from "../api/categoryApi";

const ManageCategories = () => {
  const [allCategories, setAllCategories] = useState<CategoryData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    adminGetAllCategories()
      .then((data) => {
        setCategories(data);
        setAllCategories(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleClick = () => {
    navigate("/admin/add-category");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setCategories(allCategories);
    } else {
      const filtered = allCategories.filter((category) =>
        category.name.toLowerCase().includes(term.toLowerCase())
      );
      setCategories(filtered);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row justify-between">
        <button className="btn btn-primary mb-4" onClick={handleClick}>
          Adaugă Categorie
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
      <h1 className="text-2xl font-bold mb-4">Administreaza categorii</h1>
      <div className="flex flex-col">
        {categories.map((category) => (
          <AdminCategoryCard key={category._id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default ManageCategories;
