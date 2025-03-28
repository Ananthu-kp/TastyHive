import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut, List, Users, Menu, X } from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Sidebar for All Screens */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-green-50 text-gray-800 flex flex-col shadow-lg transition-all duration-300 z-40
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}`}
      >
        <div className="p-4 text-xl font-bold text-green-700 border-b border-green-300 flex items-center justify-between">
          <span>Tasty Hive</span>
          {isMobile && (
            <button onClick={closeSidebar} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          )}
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <NavLink
            to="/admin"
            onClick={closeSidebar}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all mb-2 ${
              location.pathname === "/admin"
                ? "bg-green-300 text-white"
                : "hover:bg-green-200"
            }`}
          >
            <List size={20} /> Menu Editor
          </NavLink>
          <NavLink
            to="/admin/users"
            onClick={closeSidebar}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all mb-2 ${
              location.pathname === "/admin/users"
                ? "bg-green-300 text-white"
                : "hover:bg-green-200"
            }`}
          >
            <Users size={20} /> User List
          </NavLink>
        </nav>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 bg-red-400 text-white hover:bg-red-600 w-full transition-all mt-auto"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Overlay for Mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 bg-green-300 text-white p-2 rounded-full shadow-lg z-50 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
    </>
  );
};

export default AdminSidebar;
