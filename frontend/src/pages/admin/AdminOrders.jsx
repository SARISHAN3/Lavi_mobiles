import { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setOrders(response.data.orders);
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

  const handleStatusChange = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Order status updated successfully.");

      getOrders();
    } catch (error) {
      console.error(
        "Update order status error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update order status.");
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>

        <p className="text-gray-500 mt-1">Manage customer orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              {/* Order Header */}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>

                  <h2 className="font-bold text-gray-800">
                    {order.orderNumber}
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Status</p>

                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                  >
                    <option value="Pending">Pending</option>

                    <option value="Confirmed">Confirmed</option>

                    <option value="Processing">Processing</option>

                    <option value="Shipped">Shipped</option>

                    <option value="Delivered">Delivered</option>

                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer */}

              <div className="mt-5">
                <h3 className="font-semibold text-gray-800">Customer</h3>

                <p className="text-gray-600 mt-1">
                  {order.user?.name || "Customer"}
                </p>

                <p className="text-sm text-gray-500">
                  {order.user?.email || ""}
                </p>
              </div>

              {/* Products */}

              <div className="mt-5">
                <h3 className="font-semibold text-gray-800 mb-3">Products</h3>

                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={`${order._id}-${index}`}
                      className="flex items-center gap-4 border-b pb-3 last:border-b-0"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-contain rounded-lg border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>

                        <p className="text-sm text-gray-500">
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

              {/* Shipping Address */}

              <div className="mt-5 border-t pt-5">
                <h3 className="font-semibold text-gray-800">
                  Shipping Address
                </h3>

                <p className="text-gray-600 mt-2">
                  {order.shippingAddress?.name}
                </p>

                <p className="text-gray-600">{order.shippingAddress?.phone}</p>

                <p className="text-gray-600">
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}
                </p>

                <p className="text-gray-600">
                  {order.shippingAddress?.state} -{" "}
                  {order.shippingAddress?.pincode}
                </p>
              </div>

              {/* Order Summary */}

              <div className="mt-5 border-t pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment</p>

                  <p className="font-medium text-gray-800">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : order.paymentMethod}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Payment Status: {order.paymentStatus}
                  </p>
                </div>

                <div className="text-right">
                  {order.discountAmount > 0 && (
                    <p className="text-sm text-green-600">
                      Discount: ₹{order.discountAmount.toLocaleString("en-IN")}
                    </p>
                  )}

                  <p className="text-sm text-gray-500">Total Amount</p>

                  <p className="text-2xl font-bold text-orange-500">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
