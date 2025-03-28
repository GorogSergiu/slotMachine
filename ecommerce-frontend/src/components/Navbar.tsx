
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          Acasă
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link to="/magazin" className="no-underline hover:opacity-80">
            Magazin
          </Link>
          <Link to="/coș" className="no-underline hover:opacity-80">
            Coș 🛒
          </Link>
          <Link to="/autentificare" className="no-underline hover:opacity-80">
            Login
          </Link>
          <Link to="/inregistrare" className="no-underline hover:opacity-80">
            Înregistrare
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;