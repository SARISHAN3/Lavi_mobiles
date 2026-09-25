import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/users/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(response.data.users);
    } catch (error) {
      console.error(
        "Failed to load users:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleStatusChange = async (userId, isActive) => {
    const action = isActive ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`,
    );

    if (!confirmed) {
      return;
    }
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/users/admin/${userId}/status`,
        {
          isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(
        isActive
          ? "User activated successfully."
          : "User deactivated successfully.",
      );

      getUsers();
    } catch (error) {
      console.error(
        "Update user status error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update user status.");
    }
  };

  const handleRoleChange = async (userId, role) => {
    const roleName = role === "admin" ? "Admin" : "Customer";

    const confirmed = window.confirm(
      `Are you sure you want to change this user's role to ${roleName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/users/admin/${userId}/role`,
        {
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("User role updated successfully.");

      getUsers();
    } catch (error) {
      console.error(
        "Update user role error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update user role.");

      getUsers();
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>

        <p className="text-gray-500 mt-1">Manage Lavi Mobile users</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Name
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Email
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Phone
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Role
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{user.name}</p>
                  </td>

                  <td className="px-6 py-4 text-gray-600">{user.email}</td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.phone || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500"
                    >
                      <option value="customer">Customer</option>

                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        handleStatusChange(user._id, !user.isActive)
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
