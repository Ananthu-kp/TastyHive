import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import ProfileLogo from "/profilelogo.png";
import Swal from "sweetalert2";

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Logout",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        });
    };

    return (
        <nav className="bg-gradient-to-r from-green-300 to-green-500 bg-opacity-80 backdrop-blur-md text-white py-3 px-6 flex justify-between items-center rounded-2xl shadow-lg m-4">
            <h1 className="text-2xl tracking-wide drop-shadow-md">Tasty Hive</h1>
            <div className="relative">
                <button
                    className="flex items-center focus:outline-none"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <img
                        src={ProfileLogo}
                        alt="User Profile"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md hover:scale-105 transition-transform duration-300"
                    />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white text-gray-700 rounded-xl shadow-lg overflow-hidden animate-fade-in">
                        <Link 
                            to="/profile" 
                            className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                        >
                            <User className="w-5 h-5 mr-2 text-green-500" /> Profile
                        </Link>
                        <button
                            className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5 mr-2 text-red-500" /> Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
