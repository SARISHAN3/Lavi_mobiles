import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/customer/Navbar";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setOrder(response.data.order);
      } catch (error) {
        console.error(
          "Failed to load order:",
          error.response?.data || error.message,
        );

        alert(error.response?.data?.message || "Failed to load order.");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Loading order...</p>
        </div>
      </>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <button
            onClick={() => navigate("/orders")}
            className="text-orange-500 hover:text-orange-600 font-medium mb-6"
          >
            ← Back to Orders
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>

                <h1 className="text-2xl font-bold text-gray-800">
                  {order.orderNumber}
                </h1>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold w-fit">
                  {order.orderStatus}
                </span>

                {["Pending", "Confirmed"].includes(order.orderStatus) && (
                  <button
                    onClick={async () => {
                      const confirmed = window.confirm(
                        "Are you sure you want to cancel this order?",
                      );

                      if (!confirmed) {
                        return;
                      }

                      try {
                        const token = localStorage.getItem("token");

                        const response = await axios.put(
                          `http://localhost:5000/api/orders/${order._id}/cancel`,
                          {},
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          },
                        );

                        alert(
                          response.data.message ||
                            "Order cancelled successfully.",
                        );

                        setOrder((previousOrder) => ({
                          ...previousOrder,
                          orderStatus: "Cancelled",
                        }));
                      } catch (error) {
                        console.error(
                          "Cancel order error:",
                          error.response?.data || error.message,
                        );

                        alert(
                          error.response?.data?.message ||
                            "Failed to cancel order.",
                        );
                      }
                    }}
                    className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-800">Order Items</h2>

              <div className="mt-5 space-y-5">
                {order.items.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center gap-4 border-b pb-5 last:border-b-0"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-contain rounded-lg border"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-400">
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

                      <p className="text-orange-500 font-semibold mt-2">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Item Total</p>

                      <p className="font-semibold text-gray-800">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-bold text-gray-800">
                Shipping Address
              </h2>

              <div className="mt-4 text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">
                  {order.shippingAddress.name}
                </p>

                <p>{order.shippingAddress.phone}</p>

                <p>{order.shippingAddress.street}</p>

                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.pincode}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-bold text-gray-800">
                Payment Information
              </h2>

              <div className="mt-4 space-y-2">
                <p>
                  <span className="text-gray-500">Payment Method: </span>
                  <span className="font-medium">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : order.paymentMethod}
                  </span>
                </p>

                <p>
                  <span className="text-gray-500">Payment Status: </span>
                  <span className="font-medium">{order.paymentStatus}</span>
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>

              <div className="mt-4 space-y-3 max-w-sm ml-auto">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="font-medium">
                    ₹
                    {(order.totalAmount + order.discountAmount).toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Coupon Discount
                      {order.couponCode ? ` (${order.couponCode})` : ""}
                    </span>

                    <span>
                      -₹{order.discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-800">Total</span>

                  <span className="text-xl font-bold text-orange-500">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetails;
