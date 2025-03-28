import {
  ClipboardDocumentCheckIcon,
  EnvelopeIcon,
  HomeIcon,
  ShoppingCartIcon,
  TagIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

const AdminSidebar = () => {
  return (
    <div className="flex flex-col bg-stone-800">
      <ul className="menu text-white lg:text-[18px] w-50 gap-[10px]">
        <li>
          <a href="/admin">
            <HomeIcon className="size-6" />
            Dashboard
          </a>
        </li>
        <li>
          <a href="/admin/manage-products">
            <ShoppingCartIcon className="size-6" />
            Produse
          </a>
        </li>
        <li>
          <a href="/admin/manage-categories">
            <TagIcon className="size-6" />
            Categorii
          </a>
        </li>
        <li>
          <a href="/admin/marketing-tools">
            <EnvelopeIcon className="size-6" />
            Marketing
          </a>
        </li>
        <li>
          <a href="/admin/manage-orders">
            <ClipboardDocumentCheckIcon className="size-6" />
            Comenzi
          </a>
        </li>
        <li>
          <a href="/admin/manage-users">
            <UsersIcon className="size-6" />
            Utilizatori
          </a>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
