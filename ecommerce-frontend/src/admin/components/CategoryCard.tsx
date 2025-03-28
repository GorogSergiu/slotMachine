import React, { useRef } from "react";
import { deleteProduct } from "../api/productApi";
import { useAuth } from "../../context/AuthContext";
import { adminDeleteCategory, CategoryData } from "../api/categoryApi";

interface CategoryCardProps {
  category: CategoryData;
}

const AdminCategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { user } = useAuth();
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleDelete = async () => {
    if (!user?.token || !category._id) return alert("Not authorized");

    try {
      await adminDeleteCategory(category._id, user.token);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-row justify-between items-center border p-4 mt-2 mb-2 rounded shadow">
      <div className="flex flex-row items-center w-full">
        <h2 className="text-lg font-bold w-[30%]">{category.name}</h2>
      </div>
      <div className="flex gap-2">
        <button className="btn btn-primary">Editează</button>
        <button
          className="btn btn-error"
          onClick={() => modalRef.current?.showModal()}
        >
          Șterge
        </button>
      </div>

      {/* Modal */}
      <dialog
        id={`delete-modal-${category._id}`}
        ref={modalRef}
        className="modal"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirmare Ștergere</h3>
          <p className="py-4">Ești sigur că vrei să ștergi categoria?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn" type="submit">
                Anulează
              </button>
              <button
                className="btn btn-error"
                type="button"
                onClick={() => {
                  handleDelete();
                  modalRef.current?.close();
                }}
              >
                Confirmă
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AdminCategoryCard;
