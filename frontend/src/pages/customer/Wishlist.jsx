import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/customer/Navbar";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/wishlist/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error.response?.data || error.message,
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove product from wishlist",
      );
    }
  };

  const getWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error(
        "Failed to load wishlist:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWishlist();
  }, []);

  if (loading) {
    return <p className="p-6">Loading wishlist...</p>;
  }

  if (!wishlist || wishlist.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Your Wishlist is Empty
          </h1>

          <p className="text-gray-500 mt-2">
            Add products you like to your wishlist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm p-5"
              >
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-56 object-contain"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-4">{product.brand}</p>

                <h2 className="font-semibold text-gray-800 mt-1">
                  {product.name}
                </h2>

                <p className="text-orange-500 font-bold text-lg mt-2">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium"
                  >
                    View Product
                  </button>

                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="flex-1 border border-red-300 text-red-500 hover:bg-red-50 py-2.5 rounded-lg font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Wishlist;
