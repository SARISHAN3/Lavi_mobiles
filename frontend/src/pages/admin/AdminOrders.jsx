import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiShoppingBag,
} from "react-icons/fi";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  // View order
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status updating
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const getOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error(
        "Failed to load orders:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  // --------------------------------------------------
  // UPDATE ORDER STATUS
  // --------------------------------------------------

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await getOrders();
    } catch (error) {
      console.error(
        "Update order status error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // --------------------------------------------------
  // ORDER COUNTS
  // --------------------------------------------------

  const orderCounts = useMemo(() => {
    return {
      All: orders.length,

      Pending: orders.filter((order) => order.orderStatus === "Pending").length,

      Confirmed: orders.filter((order) => order.orderStatus === "Confirmed")
        .length,

      Processing: orders.filter((order) => order.orderStatus === "Processing")
        .length,

      Shipped: orders.filter((order) => order.orderStatus === "Shipped").length,

      Delivered: orders.filter((order) => order.orderStatus === "Delivered")
        .length,

      Cancelled: orders.filter((order) => order.orderStatus === "Cancelled")
        .length,
    };
  }, [orders]);

  // --------------------------------------------------
  // FILTER ORDERS
  // --------------------------------------------------

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search
    if (search.trim()) {
      const searchText = search.toLowerCase().trim();

      result = result.filter((order) => {
        const orderNumber = order.orderNumber?.toLowerCase() || "";

        const customerName = order.user?.name?.toLowerCase() || "";

        const customerEmail = order.user?.email?.toLowerCase() || "";

        const phone = order.shippingAddress?.phone?.toLowerCase() || "";

        return (
          orderNumber.includes(searchText) ||
          customerName.includes(searchText) ||
          customerEmail.includes(searchText) ||
          phone.includes(searchText)
        );
      });
    }

    // Status
    if (statusFilter !== "All") {
      result = result.filter((order) => order.orderStatus === statusFilter);
    }

    // Payment
    if (paymentFilter !== "All") {
      result = result.filter((order) => order.paymentMethod === paymentFilter);
    }

    // Date
    if (dateFilter !== "All") {
      const now = new Date();

      result = result.filter((order) => {
        const orderDate = new Date(order.createdAt);

        if (dateFilter === "Today") {
          return orderDate.toDateString() === now.toDateString();
        }

        if (dateFilter === "7days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);

          return orderDate >= sevenDaysAgo;
        }

        if (dateFilter === "30days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);

          return orderDate >= thirtyDaysAgo;
        }

        return true;
      });
    }

    return result;
  }, [orders, search, statusFilter, paymentFilter, dateFilter]);

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const startIndex = (currentPage - 1) * ordersPerPage;

  const endIndex = startIndex + ordersPerPage;

  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, paymentFilter, dateFilter]);

  // --------------------------------------------------
  // STATUS STYLE
  // --------------------------------------------------

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";

      case "Confirmed":
        return "bg-blue-50 text-blue-600 border-blue-200";

      case "Processing":
        return "bg-purple-50 text-purple-600 border-purple-200";

      case "Shipped":
        return "bg-indigo-50 text-indigo-600 border-indigo-200";

      case "Delivered":
        return "bg-green-50 text-green-600 border-green-200";

      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-200";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  // --------------------------------------------------
  // DATE FORMAT
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

          <p className="text-gray-500 mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="w-full">
      {/* ================================================
          PAGE HEADER
      ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage and track all customer orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5">
            <p className="text-xs text-gray-500">Total Orders</p>

            <p className="text-lg font-bold text-gray-900">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* ================================================
          STATUS CARDS
      ================================================= */}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
        {/* ALL */}

        <button
          type="button"
          onClick={() => setStatusFilter("All")}
          className={`text-left bg-white rounded-xl border p-4 transition-all ${
            statusFilter === "All"
              ? "border-orange-500 shadow-sm ring-2 ring-orange-100"
              : "border-gray-200 hover:border-orange-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total</p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {orderCounts.All}
              </p>
            </div>

            <FiShoppingBag className="text-orange-500 text-xl" />
          </div>
        </button>

        {/* PENDING */}

        <button
          type="button"
          onClick={() => setStatusFilter("Pending")}
          className={`text-left bg-white rounded-xl border p-4 transition-all ${
            statusFilter === "Pending"
              ? "border-yellow-500 shadow-sm ring-2 ring-yellow-100"
              : "border-gray-200 hover:border-yellow-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Pending</p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {orderCounts.Pending}
              </p>
            </div>

            <FiClock className="text-yellow-500 text-xl" />
          </div>
        </button>

        {/* CONFIRMED */}

        <button
          type="button"
          onClick={() => setStatusFilter("Confirmed")}
          className={`text-left bg-white rounded-xl border p-4 transition-all ${
            statusFilter === "Confirmed"
              ? "border-blue-500 shadow-sm ring-2 ring-blue-100"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Confirmed</p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {orderCounts.Confirmed}
              </p>
            </div>

            <FiCheckCircle className="text-blue-500 text-xl" />
          </div>
        </button>

        {/* PROCESSING */}

        <button
          type="button"
          onClick={() => setStatusFilter("Processing")}
          className={`text-left bg-white rounded-xl border p-4 transition-all ${
            statusFilter === "Processing"
              ? "border-purple-500 shadow-sm ring-2 ring-purple-100"
              : "border-gray-200 hover:border-purple-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Processing</p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {orderCounts.Processing}
              </p>
            </div>

            <FiPackage className="text-purple-500 text-xl" />
          </div>
        </button>

        {/* SHIPPED */}

        <button
          type="button"
          onClick={() => setStatusFilter("Shipped")}
          className={`text-left bg-white rounded-xl border p-4 transition-all ${
            statusFilter === "Shipped"
              ? "border-indigo-500 shadow-sm ring-2 ring-indigo-100"
              : "border-gray-200 hover:border-indigo-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Shipped</p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {orderCounts.Shipped}
              </p>
            </div>

            <FiTruck className="text-indigo-500 text-xl" />
          </div>
        </button>

        {/* DELIVERED */}

        <button
          type="button"
          onClick={() => setStatusFilter("Delivered")}
          className={`text-left bg-white rounded-xl border p-4 transition-all ${
            statusFilter === "Delivered"
              ? "border-green-500 shadow-sm ring-2 ring-green-100"
              : "border-gray-200 hover:border-green-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Delivered</p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {orderCounts.Delivered}
              </p>
            </div>

            <FiCheckCircle className="text-green-500 text-xl" />
          </div>
        </button>

        {/* CANCELLED */}

        <button
          type="button"
          onClick={() => setStatusFilter("Cancelled")}
          className={`text-left bg-white rounded-xl border p-4 transition-all ${
            statusFilter === "Cancelled"
              ? "border-red-500 shadow-sm ring-2 ring-red-100"
              : "border-gray-200 hover:border-red-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Cancelled</p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                {orderCounts.Cancelled}
              </p>
            </div>

            <FiX className="text-red-500 text-xl" />
          </div>
        </button>
      </div>

      {/* ================================================
          SEARCH + FILTER
      ================================================= */}

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
              placeholder="Search by order ID, customer name, email or phone..."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            {/* STATUS */}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Order Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-white outline-none focus:border-orange-500 text-sm"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* PAYMENT */}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Payment Method
              </label>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-white outline-none focus:border-orange-500 text-sm"
              >
                <option value="All">All Payment Methods</option>

                <option value="COD">Cash on Delivery</option>

                <option value="ONLINE">Online Payment</option>
              </select>
            </div>

            {/* DATE */}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Order Date
              </label>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-white outline-none focus:border-orange-500 text-sm"
              >
                <option value="All">All Dates</option>

                <option value="Today">Today</option>

                <option value="7days">Last 7 Days</option>

                <option value="30days">Last 30 Days</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ================================================
          RESULT HEADER
      ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {statusFilter === "All" ? "All Orders" : `${statusFilter} Orders`}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredOrders.length === 0 ? 0 : startIndex + 1} -{" "}
            {Math.min(endIndex, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </p>
        </div>

        {(search ||
          statusFilter !== "All" ||
          paymentFilter !== "All" ||
          dateFilter !== "All") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setPaymentFilter("All");
              setDateFilter("All");
            }}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ================================================
          ORDERS TABLE
      ================================================= */}

      {currentOrders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <FiShoppingBag className="mx-auto text-gray-300" size={45} />

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            No orders found
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Order
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Customer
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Products
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Payment
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Total
                  </th>

                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {currentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    {/* ORDER */}

                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 text-sm">
                        #{order.orderNumber}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {order.items?.length || 0} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </p>
                    </td>

                    {/* CUSTOMER */}

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800 text-sm">
                        {order.user?.name ||
                          order.shippingAddress?.name ||
                          "Customer"}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {order.user?.email || "-"}
                      </p>
                    </td>

                    {/* PRODUCTS */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {order.items?.slice(0, 3).map((item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="w-10 h-10 rounded-lg border border-gray-200 bg-white overflow-hidden flex-shrink-0"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <FiPackage className="text-gray-400" />
                              </div>
                            )}
                          </div>
                        ))}

                        {(order.items?.length || 0) > 3 && (
                          <span className="text-xs text-gray-500">
                            +{order.items.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* DATE */}

                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">
                        {formatDate(order.createdAt)}
                      </p>
                    </td>

                    {/* PAYMENT */}

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-700">
                        {order.paymentMethod === "COD"
                          ? "COD"
                          : order.paymentMethod}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {order.paymentStatus}
                      </p>
                    </td>

                    {/* TOTAL */}

                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 text-sm">
                        ₹
                        {Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </p>
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <select
                        value={order.orderStatus}
                        disabled={updatingOrderId === order._id}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`text-xs font-medium px-3 py-2 rounded-full border outline-none cursor-pointer ${getStatusStyle(
                          order.orderStatus,
                        )}`}
                      >
                        <option value="Pending">Pending</option>

                        <option value="Confirmed">Confirmed</option>

                        <option value="Processing">Processing</option>

                        <option value="Shipped">Shipped</option>

                        <option value="Delivered">Delivered</option>

                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          title="View Order"
                          onClick={() => setSelectedOrder(order)}
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

      {/* ================================================
          PAGINATION
      ================================================= */}

      {filteredOrders.length > 0 && (
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

      {/* ================================================
          VIEW ORDER MODAL
      ================================================= */}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedOrder(null)}
          ></div>

          {/* Modal */}

          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            {/* Modal Header */}

            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Order Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  #{selectedOrder.orderNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Status */}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <p className="text-xs text-gray-500">Order Date</p>

                  <p className="font-medium text-gray-800 mt-1">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit px-3 py-1.5 rounded-full border text-xs font-medium ${getStatusStyle(
                    selectedOrder.orderStatus,
                  )}`}
                >
                  {selectedOrder.orderStatus}
                </span>
              </div>

              {/* Customer */}

              <div className="border border-gray-200 rounded-xl p-5 mb-5">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Customer Information
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>

                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {selectedOrder.user?.name ||
                        selectedOrder.shippingAddress?.name ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Email</p>

                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {selectedOrder.user?.email || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Phone</p>

                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {selectedOrder.shippingAddress?.phone || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products */}

              <div className="border border-gray-200 rounded-xl p-5 mb-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Ordered Products
                </h3>

                <div className="space-y-4">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={`${selectedOrder._id}-modal-${index}`}
                      className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <FiPackage className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">
                          {item.name}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-800">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}

              <div className="border border-gray-200 rounded-xl p-5 mb-5">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Shipping Address
                </h3>

                <div className="text-sm text-gray-600 leading-6">
                  <p className="font-medium text-gray-800">
                    {selectedOrder.shippingAddress?.name}
                  </p>

                  <p>{selectedOrder.shippingAddress?.phone}</p>

                  <p>{selectedOrder.shippingAddress?.street}</p>

                  <p>
                    {selectedOrder.shippingAddress?.city},{" "}
                    {selectedOrder.shippingAddress?.state}
                  </p>

                  <p>PIN: {selectedOrder.shippingAddress?.pincode}</p>
                </div>
              </div>

              {/* Payment + Total */}

              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>

                    <p className="font-medium text-gray-800 mt-1">
                      {selectedOrder.paymentMethod === "COD"
                        ? "Cash on Delivery"
                        : selectedOrder.paymentMethod}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      Payment Status: {selectedOrder.paymentStatus}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    {selectedOrder.discountAmount > 0 && (
                      <p className="text-sm text-green-600 mb-1">
                        Discount: ₹
                        {selectedOrder.discountAmount.toLocaleString("en-IN")}
                      </p>
                    )}

                    <p className="text-xs text-gray-500">Total Amount</p>

                    <p className="text-2xl font-bold text-orange-500 mt-1">
                      ₹
                      {Number(selectedOrder.totalAmount || 0).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
