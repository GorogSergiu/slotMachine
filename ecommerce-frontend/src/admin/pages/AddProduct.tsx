import { useState, useEffect, useRef } from "react";
import { addProduct } from "../api/productApi";
import { useAuth } from "../../context/AuthContext";
import { adminGetAllCategories, CategoryData } from "../api/categoryApi";

const AdminAddProduct = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    primaryImage: "",
    secondaryImages: [""],
  });
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const [selectedParent, setSelectedParent] = useState<string | undefined>(
    undefined
  );
  const [selectedParentName, setSelectedParentName] = useState("");

  useEffect(() => {
    adminGetAllCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("http://localhost:5001/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    return data.imageUrl;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return alert("Unauthorized!");

    try {
      await addProduct(
        formData.name,
        formData.description,
        Number(formData.price),
        {
          _id: selectedParent!,
          name: selectedParentName,
        },
        Number(formData.stock),
        formData.secondaryImages,
        formData.primaryImage,
        user.token
      );
      alert("Product added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add product.");
    }
  };

  const productData = [
    {
      label: "Numele produsului",
      type: "text",
      name: "name",
      classname: "input",
      placeholder: "Numele produsului",
      required: true,
    },
    {
      label: "Cod Produs",
      type: "text",
      name: "sku",
      classname: "input",
      placeholder: "Codul Produsului",
      required: true,
    },
    {
      label: "Preț",
      type: "number",
      name: "price",
      classname: "input",
      placeholder: "Preț",
      required: true,
    },
    {
      label: "Preț redus",
      type: "number",
      name: "sale",
      classname: "input",
      placeholder: "Preț redus",
      required: true,
    },
    {
      label: "Stoc",
      type: "number",
      name: "stock",
      classname: "input",
      placeholder: "Stoc",
      required: true,
    },
  ];

  return (
    <div className="flex flex-col w-[100%]">
      <h2 className="text-2xl font-bold mb-4">Adaugă Produs</h2>
      <div className="flex flex-row">
        <div className="p-6 w-[50%]">
          <form className="flex flex-col gap-4">
            {productData.map((data, index) => (
              <label key={index} className="flex flex-col">
                {data.label}
                <input
                  type={data.type}
                  name={data.name}
                  className={data.classname}
                  placeholder={data.placeholder}
                  onChange={handleChange}
                  required
                />
              </label>
            ))}
          </form>
        </div>
        <div className="flex flex-col p-6 w-[50%] gap-4">
          <label className="flex flex-col">
            Categorie
            <details className="dropdown" ref={dropdownRef}>
              <summary className="btn">
                {selectedParentName == "" ? "Selectează" : selectedParentName}
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                {categories.map((category) => (
                  <li key={category._id}>
                    <a
                      onClick={() => {
                        setSelectedParent(category._id);
                        setSelectedParentName(category.name);
                        dropdownRef.current?.removeAttribute("open");
                      }}
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </label>
          <label className="flex flex-col">
            Descriere Produs
            <textarea
              name="description"
              placeholder="Descriere"
              className="input min-w-[500px] min-h-[200px]"
              onChange={handleChange}
              required
            />
          </label>
          <label className="flex flex-col">
            Imagine Principală
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  const imageUrl = await uploadImage(e.target.files[0]);
                  setFormData((prev) => ({
                    ...prev,
                    primaryImage: imageUrl,
                  }));
                }
              }}
            />
          </label>
          <label className="flex flex-col">
            Imagini Secundare
            <input
              type="file"
              accept="image/*"
              className="file-input"
              multiple
              onChange={async (e) => {
                if (e.target.files?.length) {
                  const uploads = await Promise.all(
                    Array.from(e.target.files).map((file) => uploadImage(file))
                  );
                  setFormData((prev) => ({
                    ...prev,
                    secondaryImages: uploads,
                  }));
                }
              }}
            />
          </label>
        </div>
      </div>
      <div className="flex justify-start w-[100%] ml-6">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-600 text-white p-2 rounded w-[300px]"
        >
          Adaugă Produs
        </button>
      </div>
    </div>
  );
};

export default AdminAddProduct;
