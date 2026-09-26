import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiShield,
} from "react-icons/fi";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // View user
  const [selectedUser, setSelectedUser] = useState(null);

  // Updating status / role
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // --------------------------------------------------
  // GET USERS
  // --------------------------------------------------

  const getUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/users/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(response.data.users || []);
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

  // --------------------------------------------------
  // UPDATE STATUS
  // --------------------------------------------------

  const handleStatusChange = async (userId, isActive) => {
    const action = isActive ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingUserId(userId);

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

      await getUsers();
    } catch (error) {
      console.error(
        "Update user status error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update user status.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // --------------------------------------------------
  // UPDATE ROLE
  // --------------------------------------------------

  const handleRoleChange = async (userId, role) => {
    const roleName = role === "admin" ? "Admin" : "Customer";

    const confirmed = window.confirm(
      `Are you sure you want to change this user's role to ${roleName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingUserId(userId);

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

      await getUsers();
    } catch (error) {
      console.error(
        "Update user role error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update user role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // --------------------------------------------------
  // USER COUNTS
  // --------------------------------------------------

  const userCounts = useMemo(() => {
    return {
      all: users.length,

      active: users.filter((user) => user.isActive).length,

      inactive: users.filter((user) => !user.isActive).length,

      admins: users.filter((user) => user.role === "admin").length,

      customers: users.filter((user) => user.role === "customer").length,
    };
  }, [users]);

  // --------------------------------------------------
  // FILTER USERS
  // --------------------------------------------------

  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search
    if (search.trim()) {
      const searchText = search.toLowerCase().trim();

      result = result.filter((user) => {
        const name = user.name?.toLowerCase() || "";

        const email = user.email?.toLowerCase() || "";

        const phone = user.phone?.toLowerCase() || "";

        return (
          name.includes(searchText) ||
          email.includes(searchText) ||
          phone.includes(searchText)
        );
      });
    }

    // Role
    if (roleFilter !== "All") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Status
    if (statusFilter !== "All") {
      result = result.filter((user) =>
        statusFilter === "Active" ? user.isActive : !user.isActive,
      );
    }

    return result;
  }, [users, search, roleFilter, statusFilter]);

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;

  const endIndex = startIndex + usersPerPage;

  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  // --------------------------------------------------
  // CLEAR FILTERS
  // --------------------------------------------------

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("All");
    setStatusFilter("All");
  };

  // --------------------------------------------------
  // GET INITIAL
  // --------------------------------------------------

  const getInitial = (name) => {
    if (!name) return "?";

    return name.trim().charAt(0).toUpperCase();
  };

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>

          <p className="text-gray-500 mt-4">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* =================================================
          PAGE HEADER
      ================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage Lavi Mobile customers and administrators
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg px-5 py-2.5 w-fit">
          <p className="text-xs text-gray-500">Total Users</p>

          <p className="text-lg font-bold text-gray-900">{userCounts.all}</p>
        </div>
      </div>

      {/* =================================================
          USER SUMMARY CARDS
      ================================================== */}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {/* ALL */}

        <button
          type="button"
          onClick={() => {
            setRoleFilter("All");
            setStatusFilter("All");
          }}
          className={`text-left bg-white rounded-xl border p-4 transition-all ${
            roleFilter === "All" && statusFilter === "All"
              ? "border-orange-500 shadow-sm ring-2 ring-orange-100"
              : "border-gray-200 hover:border-orange-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Users</p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {userCounts.all}
              </p>
            </div>

            <FiUsers className="text-orange-500" size={21} />
          </div>
        </button>

        {/* ACTIVE */}

        <button
          type="button"
          onClick={() => {
            setRoleFilter("All");
            setStatusFilter("Active");
          }}
          className={`text-left bg-white rounded-xl border p-4 transition-all ${
            statusFilter === "Active"
              ? "border-green-500 shadow-sm ring-2 ring-green-100"
              : "border-gray-200 hover:border-green-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Active</p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {userCounts.active}
              </p>
            </div>

            <FiUserCheck className="text-green-500" size={21} />
          </div>
        </button>

        {/* INACTIVE */}

        <button
          type="button"
          onClick={() => {
            setRoleFilter("All");
            setStatusFilter("Inactive");
          }}
          className={`text-left bg-white rounded-xl border p-4 transition-all ${
            statusFilter === "Inactive"
              ? "border-red-500 shadow-sm ring-2 ring-red-100"
              : "border-gray-200 hover:border-red-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Inactive</p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {userCounts.inactive}
              </p>
            </div>

            <FiUserX className="text-red-500" size={21} />
          </div>
        </button>

        {/* CUSTOMERS */}

        <button
          type="button"
          onClick={() => {
            setRoleFilter("customer");
            setStatusFilter("All");
          }}
          className={`text-left bg-white rounded-xl border p-4 transition-all ${
            roleFilter === "customer"
              ? "border-blue-500 shadow-sm ring-2 ring-blue-100"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Customers</p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {userCounts.customers}
              </p>
            </div>

            <FiUsers className="text-blue-500" size={21} />
          </div>
        </button>

        {/* ADMINS */}

        <button
          type="button"
          onClick={() => {
            setRoleFilter("admin");
            setStatusFilter("All");
          }}
          className={`text-left bg-white rounded-xl border p-4 transition-all ${
            roleFilter === "admin"
              ? "border-purple-500 shadow-sm ring-2 ring-purple-100"
              : "border-gray-200 hover:border-purple-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Admins</p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {userCounts.admins}
              </p>
            </div>

            <FiShield className="text-purple-500" size={21} />
          </div>
        </button>
      </div>

      {/* =================================================
          SEARCH + FILTER
      ================================================== */}

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* SEARCH */}

          <div className="relative flex-1">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full h-11 pl-10 pr-4 border border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm"
            />
          </div>

          {/* FILTER BUTTON */}

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-11 px-5 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium transition ${
              showFilters
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-200 hover:border-orange-400"
            }`}
          >
            <FiFilter size={17} />
            Filters
          </button>
        </div>

        {/* FILTER OPTIONS */}

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
            {/* ROLE */}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                User Role
              </label>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-white outline-none focus:border-orange-500 text-sm"
              >
                <option value="All">All Roles</option>

                <option value="customer">Customer</option>

                <option value="admin">Admin</option>
              </select>
            </div>

            {/* STATUS */}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Account Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-white outline-none focus:border-orange-500 text-sm"
              >
                <option value="All">All Status</option>

                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* =================================================
          RESULT HEADER
      ================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {roleFilter === "All"
              ? statusFilter === "All"
                ? "All Users"
                : `${statusFilter} Users`
              : roleFilter === "admin"
                ? "Admin Users"
                : "Customer Users"}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredUsers.length === 0 ? 0 : startIndex + 1} -{" "}
            {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}{" "}
            users
          </p>
        </div>

        {(search || roleFilter !== "All" || statusFilter !== "All") && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* =================================================
          USERS TABLE
      ================================================== */}

      {currentUsers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <FiUsers className="mx-auto text-gray-300" size={45} />

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            No users found
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    User
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Email
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Phone
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Role
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Joined
                  </th>

                  <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    {/* USER */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold flex-shrink-0">
                          {getInitial(user.name)}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {user.name}
                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
                            User ID: {user._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}

                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">{user.email}</p>
                    </td>

                    {/* PHONE */}

                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600">
                        {user.phone || "-"}
                      </p>
                    </td>

                    {/* ROLE */}

                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        disabled={updatingUserId === user._id}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className={`text-xs font-medium px-3 py-2 rounded-lg border outline-none cursor-pointer ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-600 border-purple-200"
                            : "bg-blue-50 text-blue-600 border-blue-200"
                        }`}
                      >
                        <option value="customer">Customer</option>

                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        disabled={updatingUserId === user._id}
                        onClick={() =>
                          handleStatusChange(user._id, !user.isActive)
                        }
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                          user.isActive
                            ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                            : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>

                        {user.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* JOINED */}

                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </p>
                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          title="View User"
                          onClick={() => setSelectedUser(user)}
                          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-300 hover:bg-orange-50 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 0h16v16H0z" fill="none" />
                            <g
                              fill="none"
                              stroke="currentColor"
                              stroke-linejoin="round"
                              stroke-width="1.5"
                            >
                              <path d="M8 3.895C12.447 3.895 14.5 8 14.5 8s-2.053 4.105-6.5 4.105S1.5 8 1.5 8S3.553 3.895 8 3.895Z" />
                              <path d="M9.94 8a2 2 0 1 1-3.999 0a2 2 0 0 1 4 0Z" />
                            </g>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================
          PAGINATION
      ================================================== */}

      {filteredUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages || 1}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-400 hover:text-orange-500 transition"
            >
              <FiChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(
                Math.max(0, currentPage - 2),
                Math.min(totalPages, currentPage + 1),
              )
              .map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-orange-500 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              type="button"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-orange-400 hover:text-orange-500 transition"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          VIEW USER MODAL
      ================================================== */}

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedUser(null)}
          ></div>

          {/* Modal */}

          <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            {/* Header */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  User Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  View account information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* PROFILE */}

              <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold">
                  {getInitial(selectedUser.name)}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedUser.name}
                  </h3>

                  <p className="text-sm text-gray-500">{selectedUser.email}</p>

                  <span
                    className={`inline-flex mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${
                      selectedUser.isActive
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {selectedUser.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* DETAILS */}

              <div className="grid sm:grid-cols-2 gap-5 mt-5">
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>

                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {selectedUser.name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Email</p>

                  <p className="text-sm font-medium text-gray-800 mt-1 break-all">
                    {selectedUser.email || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Phone</p>

                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {selectedUser.phone || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Role</p>

                  <p className="text-sm font-medium text-gray-800 mt-1 capitalize">
                    {selectedUser.role || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Joined</p>

                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">User ID</p>

                  <p className="text-xs font-medium text-gray-800 mt-1 break-all">
                    {selectedUser._id || "-"}
                  </p>
                </div>
              </div>

              {/* ADDRESS */}

              <div className="mt-6 pt-5 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Address</h3>

                <div className="text-sm text-gray-600 leading-6">
                  <p>{selectedUser.address?.street || "-"}</p>

                  <p>
                    {selectedUser.address?.city || "-"},{" "}
                    {selectedUser.address?.state || "-"}
                  </p>

                  <p>PIN: {selectedUser.address?.pincode || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
