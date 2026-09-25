import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/customer/Navbar";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/orders/my-orders",
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

    getOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Order cancelled successfully.");

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: "Cancelled",
              }
            : order,
        ),
      );
    } catch (error) {
      console.error(
        "Cancel order error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to cancel order.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center mt-8">
              <h2 className="text-xl font-semibold text-gray-800">
                No orders yet
              </h2>

              <p className="text-gray-500 mt-2">
                You haven't placed any orders yet.
              </p>

              <button
                onClick={() => navigate("/products")}
                className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6 mt-8">
              {orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="bg-white rounded-xl p-6 shadow-sm cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b pb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order Number</p>

                      <p className="font-semibold text-gray-800">
                        {order.orderNumber}
                      </p>
                    </div>

                    <div>
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.product}
                        className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-contain rounded-lg border"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {item.name}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Quantity: {item.quantity}
                          </p>

                          <p className="font-medium mt-1">
                            ₹{item.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mt-5 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Payment</p>

                      <p className="font-medium text-gray-800">
                        {order.paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : order.paymentMethod}
                      </p>

                      {["Pending", "Confirmed"].includes(order.orderStatus) && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="mt-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>

                      <p className="text-xl font-bold text-orange-500">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Orders;
