import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/cart/update/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCart(response.data.cart);
    } catch (error) {
      console.error(
        "Update cart error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCart(response.data.cart);
    } catch (error) {
      console.error(
        "Remove cart item error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to remove product");
    }
  };

  const getCart = async () => {
    try {
      const token = localStorage.getItem("token");

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

  useEffect(() => {
    getCart();
  }, []);

  if (loading) {
    return <p className="p-6">Loading cart...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mt-2">Add some products to your cart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center gap-5 p-5 border-b"
            >
              {item.product.images?.[0] ? (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-contain"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                  No Image
                </div>
              )}

              <div className="flex-1">
                <h2 className="font-semibold text-gray-800">
                  {item.product.name}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {item.product.brand}
                </p>

                <p className="text-orange-500 font-semibold mt-2">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
                  >
                    −
                  </button>

                  <span className="font-medium">{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.product.stock}
                    className="w-8 h-8 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="mt-3 text-sm text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="p-5">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>

              <span className="text-2xl font-bold text-orange-500">
                ₹{cart.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
