import { useAuth } from "../../context/AuthContext";

const AdminNavbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleClick = () => {
    window.open("http://localhost:5173/magazin", "_blank");
  };

  return (
    <div className="navbar bg-blue-500 shadow-sm text-white z-9999">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">LOGO</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <button onClick={handleClick}>Vezi Magazinul</button>
          </li>
          <li>
            <details className="z-50">
              <summary>{user?.email}</summary>
              <ul className="bg-blue-500 rounded-t-none p-2">
                <li>
                  <button>Setări</button>
                </li>
                <li>
                  <button onClick={logout}>Deconectare</button>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminNavbar;
