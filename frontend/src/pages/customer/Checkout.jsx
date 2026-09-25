import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/customer/Navbar";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      alert("Please enter a coupon code.");
      return;
    }

    try {
      setCouponLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/coupons/validate",
        {
          code: couponCode.trim(),
          orderAmount: cart.totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCoupon(response.data);

      alert("Coupon applied successfully.");
    } catch (error) {
      console.error(
        "Coupon validation error:",
        error.response?.data || error.message,
      );

      setCoupon(null);

      alert(error.response?.data?.message || "Invalid coupon code.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponCode("");
  };

  useEffect(() => {
    const getCart = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const profileResponse = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const user = profileResponse.data.user;

        setAddress({
          name: user.name || "",
          phone: user.phone || "",
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          pincode: user.address?.pincode || "",
        });

        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCart(response.data.cart);
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    getCart();
  }, [navigate]);

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Check address fields
      if (
        !address.name ||
        !address.phone ||
        !address.street ||
        !address.city ||
        !address.state ||
        !address.pincode
      ) {
        alert("Please fill in all shipping address fields.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/orders",
        {
          shippingAddress: address,
          paymentMethod,
          couponCode: coupon ? coupon.coupon.code : "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Order placed successfully!");

      console.log("Created order:", response.data);

      navigate("/orders");
    } catch (error) {
      console.error(
        "Place order error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to place order.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Loading checkout...</p>
        </div>
      </>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Your cart is empty
            </h1>

            <button
              onClick={() => navigate("/products")}
              className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>

          {/* shipping address section */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800">
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <input
                type="text"
                name="name"
                value={address.name}
                onChange={handleAddressChange}
                placeholder="Full Name"
                required
                className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                type="tel"
                name="phone"
                value={address.phone}
                onChange={handleAddressChange}
                placeholder="Phone Number"
                required
                className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                placeholder="Street Address"
                required
                className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                placeholder="City"
                required
                className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                placeholder="State"
                required
                className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
              />

              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleAddressChange}
                placeholder="Pincode"
                required
                className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Payment method section */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>

            <label className="flex items-center gap-3 mt-5 border border-orange-500 rounded-lg p-4 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />

              <div>
                <p className="font-semibold text-gray-800">Cash on Delivery</p>

                <p className="text-sm text-gray-500 mt-1">
                  Pay when your order is delivered.
                </p>
              </div>
            </label>
          </div>

          {/* order items section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Order Items */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800">Order Items</h2>

              <div className="mt-5 space-y-5">
                {cart.items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center gap-4 border-b pb-5"
                  >
                    <img
                      src={item.product.images?.[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-contain"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.product.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="font-medium mt-1">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="font-medium">
                    ₹{cart.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                {coupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>

                    <span className="font-medium">
                      -₹{coupon.discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-800">Total</span>

                  <span className="font-bold text-xl text-orange-500">
                    ₹
                    {(coupon
                      ? coupon.finalAmount
                      : cart.totalAmount
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </p>

                {!coupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-orange-500"
                    />

                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg"
                    >
                      {couponLoading ? "Applying..." : "Apply"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-green-700">
                          {coupon.coupon.code}
                        </p>

                        <p className="text-sm text-green-600">
                          Coupon applied successfully
                        </p>
                      </div>

                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-500 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t mt-5 pt-5">
                <p className="text-sm text-gray-500">Payment Method</p>

                <p className="font-medium text-gray-800 mt-1">
                  {paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod}
                </p>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
