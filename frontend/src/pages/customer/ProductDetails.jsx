import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewComment.trim()) {
      alert("Please write a review before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to submit a review.");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          productId: product._id,
          rating: Number(reviewRating),
          comment: reviewComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Review submitted successfully.");

      setReviewRating(5);
      setReviewComment("");

      const response = await axios.get(
        `http://localhost:5000/api/reviews/product/${product._id}`,
      );

      setReviews(response.data.reviews);
    } catch (error) {
      console.error(
        "Submit review error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to add products to cart.");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Product added to cart successfully");
    } catch (error) {
      console.error(
        "Add to cart error:",
        error.response?.data || error.message,
      );

      alert(error.response?.data?.message || "Failed to add product to cart");
    }
  };

  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to continue.");
        navigate("/login");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate("/checkout");
    } catch (error) {
      console.error("Buy Now full error:", error);

      console.error("Buy Now response:", error.response?.data);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to proceed with Buy Now.",
      );
    }
  };

  const handleAddToWishlist = async () => {
    if (isInWishlist) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to add products to wishlist.");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/wishlist/add",
        {
          productId: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Product added to wishlist successfully");
      setIsInWishlist(true);
    } catch (error) {
      console.error(
        "Add to wishlist error:",
        error.response?.data || error.message,
      );

      alert(
        error.response?.data?.message || "Failed to add product to wishlist",
      );
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`,
        );

        setProduct(response.data.product);
        setSelectedImage(response.data.product.images?.[0] || "");

        const token = localStorage.getItem("token");

        if (token) {
          const wishlistResponse = await axios.get(
            "http://localhost:5000/api/wishlist",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const wishlistProducts = wishlistResponse.data.wishlist.products;

          const exists = wishlistProducts.some(
            (wishlistProduct) => wishlistProduct._id === id,
          );

          setIsInWishlist(exists);
        }

        const reviewsResponse = await axios.get(
          `http://localhost:5000/api/reviews/product/${id}`,
        );

        setReviews(reviewsResponse.data.reviews);
      } catch (error) {
        console.error(
          "Failed to load product:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  if (loading) {
    return <p className="p-6">Loading product...</p>;
  }

  if (!product) {
    return <p className="p-6">Product not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="flex items-center justify-center bg-gray-50 rounded-xl p-8">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full max-w-md h-96 object-contain"
                />
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`w-20 h-20 border rounded-lg p-2 flex-shrink-0 ${
                      selectedImage === image
                        ? "border-orange-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div>
            <p className="text-sm text-gray-500">{product.brand}</p>

            <h1 className="text-3xl font-bold text-gray-800 mt-2">
              {product.name}
            </h1>

            <p className="text-gray-500 mt-2">{product.model}</p>

            <div className="flex items-center gap-2 mt-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">
                ★ {product.rating}
              </span>

              <span className="text-gray-500 text-sm">
                {product.reviewCount} Reviews
              </span>
            </div>

            <div className="mt-6">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              {product.mrp > product.price && (
                <span className="ml-3 text-gray-400 line-through">
                  ₹{product.mrp.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {product.discount > 0 && (
              <p className="text-green-600 font-medium mt-2">
                Save ₹{product.discount.toLocaleString("en-IN")}
              </p>
            )}

            <div className="border-t mt-6 pt-6">
              <h2 className="font-semibold text-lg">Key Highlights</h2>

              <ul className="mt-3 space-y-2 text-gray-600">
                <li>RAM: {product.ram || "N/A"}</li>
                <li>Storage: {product.storage || "N/A"}</li>
                <li>Processor: {product.processor || "N/A"}</li>
                <li>Battery: {product.battery || "N/A"}</li>
                <li>Camera: {product.camera || "N/A"}</li>
                <li>Network: {product.network || "N/A"}</li>
              </ul>
            </div>

            <div className="mt-10 bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Specifications
              </h2>

              <div className="divide-y">
                <div className="flex justify-between py-4">
                  <span className="text-gray-500">RAM</span>
                  <span className="font-medium text-gray-800">
                    {product.ram || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-gray-500">Storage</span>
                  <span className="font-medium text-gray-800">
                    {product.storage || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-gray-500">Operating System</span>
                  <span className="font-medium text-gray-800">
                    {product.operatingSystem || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-gray-500">Network</span>
                  <span className="font-medium text-gray-800">
                    {product.network || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-gray-500">Screen Size</span>
                  <span className="font-medium text-gray-800">
                    {product.screenSize || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-gray-500">Battery</span>
                  <span className="font-medium text-gray-800">
                    {product.battery || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-gray-500">Processor</span>
                  <span className="font-medium text-gray-800">
                    {product.processor || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-gray-500">Camera</span>
                  <span className="font-medium text-gray-800">
                    {product.camera || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-800">
                Write a Review
              </h2>

              {token ? (
                <form onSubmit={handleSubmitReview} className="mt-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>

                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                    className="w-full md:w-48 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
                  >
                    <option value="5">★★★★★ - 5</option>
                    <option value="4">★★★★☆ - 4</option>
                    <option value="3">★★★☆☆ - 3</option>
                    <option value="2">★★☆☆☆ - 2</option>
                    <option value="1">★☆☆☆☆ - 1</option>
                  </select>

                  <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                    Your Review
                  </label>

                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write your experience with this product..."
                    rows="4"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500 resize-none"
                  />

                  <button
                    type="submit"
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="mt-5 text-center">
                  <p className="text-gray-500">
                    Please login to write a review.
                  </p>

                  <button
                    onClick={() => navigate("/login")}
                    className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium"
                  >
                    Login to Review
                  </button>
                </div>
              )}
            </div>

            <div className="mt-10 bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-800">
                Customer Reviews
              </h2>

              {reviews.length === 0 ? (
                <p className="text-gray-500 mt-5">No reviews yet.</p>
              ) : (
                <div className="mt-5 space-y-5">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border-b pb-5 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="bg-green-600 text-white text-sm px-2 py-1 rounded">
                          ★ {review.rating}
                        </span>

                        <span className="font-medium text-gray-800">
                          {review.user?.name || "Customer"}
                        </span>
                      </div>

                      <p className="text-gray-600 mt-3">{review.comment}</p>

                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 border rounded-lg hover:bg-gray-100"
                >
                  −
                </button>

                <span className="font-semibold text-lg">{quantity}</span>

                <button
                  onClick={() =>
                    setQuantity((prev) => Math.min(product.stock, prev + 1))
                  }
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                {product.stock > 0
                  ? `${product.stock} items available`
                  : "Out of stock"}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock <= 0 ? "Out of Stock" : "Buy Now"}
              </button>
            </div>

            <div className="mt-4">
              <button
                onClick={handleAddToWishlist}
                disabled={isInWishlist}
                className="w-full border border-gray-300 hover:border-orange-500 py-3 rounded-lg text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {isInWishlist ? "♥ In Wishlist" : "♡ Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border-t mt-10 pt-8">
          <h2 className="text-xl font-bold text-gray-800">
            Product Description
          </h2>

          <p className="text-gray-600 mt-3 leading-7">
            {product.description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
