import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";
import AdminSidebar from "./AdminSidebar";
import { toast } from "sonner";
import Swal from "sweetalert2";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async (query) => {
      try {
        const { data } = await axiosInstance.get(`/admin/users`, {
          params: { name: query}
        });
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers(searchQuery);
  }, [searchQuery]);

  const updateUserRole = async (id, isAdmin) => {
    const action = isAdmin ? "demote" : "promote";

    Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${action} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isAdmin ? "#d33" : "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: isAdmin ? "Yes, Demote" : "Yes, Promote"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const endpoint = isAdmin
            ? `/admin/users/${id}/demote`
            : `/admin/users/${id}/promote`;

          await axiosInstance.patch(endpoint);

          setUsers(users.map(user => user._id === id ? { ...user, isAdmin: !isAdmin } : user));

          toast.success(`User ${isAdmin ? "demoted" : "promoted"} successfully`);
        } catch (error) {
          console.error("Error updating user role:", error);
          toast.error("Failed to update user role");
        }
      }
    });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">User List</h1>
        <div className="mb-4">
        <input
          type="text"
          placeholder="Search Users"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

        {users.length === 0 ? (
          <p className="text-gray-500 text-center text-lg mt-6">No users were registered.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-green-300 text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-t">
                  <td className="p-3">{user.fullName}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 text-center">{user.isAdmin ? "Admin" : "User"}</td>
                  <td className="p-3 text-center">
                    <button
                      className={`px-4 py-2 rounded-md text-white ${user.isAdmin ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      onClick={() => updateUserRole(user._id, user.isAdmin)}
                    >
                      {user.isAdmin ? "Demote" : "Promote"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersList;
