import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminAddCategory, adminGetAllCategories } from "../api/categoryApi";
import { CategoryData } from "../api/categoryApi";
import { useRef } from "react";

const AdminAddCategory = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [checked, setChecked] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedParent, setSelectedParent] = useState<string | undefined>(
    undefined
  );
  const [selectedParentName, setSelectedParentName] = useState("");
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    adminGetAllCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return alert("Unauthorized!");

    try {
      await adminAddCategory(
        formData.name,
        user.token,
        checked,
        selectedParent || ""
      );
      alert("Category added successfully!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to add category.");
    }
  };

  const categoryData = [
    {
      label: "Numele categoriei",
      type: "text",
      name: "name",
      classname: "input",
      placeholder: "Numele categoriei...",
      required: true,
    },
  ];

  return (
    <div className="flex flex-col w-[100%]">
      <h2 className="text-2xl font-bold mb-4">Adaugă Categorie</h2>
      <div className="flex flex-row">
        <div className="p-6 w-[50%]">
          <form className="flex flex-col gap-4">
            {categoryData.map((data, index) => (
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
            <fieldset className="flex flex-row gap-1">
              <input
                type="checkbox"
                className="checkbox"
                onChange={(e) => setChecked(e.target.checked)}
              />
              Categorie secundară
            </fieldset>
            {checked && (
              <details className="dropdown" ref={dropdownRef}>
                <summary className="btn m-1">
                  Categorie părinte: {selectedParentName}
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
            )}
          </form>
        </div>
      </div>
      <div className="flex justify-start w-[100%] ml-6">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-600 text-white p-2 rounded w-[300px]"
        >
          Adaugă Categorie
        </button>
      </div>
    </div>
  );
};

export default AdminAddCategory;
