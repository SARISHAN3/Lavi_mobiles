import { Link } from "react-router-dom";
import Navbar from "../../components/customer/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-orange-100 font-medium mb-3">
              Welcome to Lavi Mobile
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Find Your Perfect Smartphone
            </h1>

            <p className="mt-5 text-orange-50 text-lg">
              Explore the latest smartphones from top brands at great prices.
            </p>

            <Link
              to="/products"
              className="inline-block mt-8 bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Shop Mobiles
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">
          {[
            "Budget Phones",
            "5G Phones",
            "Premium Phones",
            "Gaming Phones",
          ].map((category) => (
            <div
              key={category}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition text-center"
            >
              <div className="text-4xl mb-4">📱</div>

              <h3 className="font-semibold text-gray-800">{category}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-800">
            Why Shop With Lavi Mobile?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="p-6 border rounded-xl">
              <div className="text-3xl">🚚</div>
              <h3 className="font-semibold mt-4">Fast Delivery</h3>
              <p className="text-gray-500 mt-2">
                Get your smartphone delivered quickly and safely.
              </p>
            </div>

            <div className="p-6 border rounded-xl">
              <div className="text-3xl">🔒</div>
              <h3 className="font-semibold mt-4">Secure Shopping</h3>
              <p className="text-gray-500 mt-2">
                Your account and orders are protected.
              </p>
            </div>

            <div className="p-6 border rounded-xl">
              <div className="text-3xl">💰</div>
              <h3 className="font-semibold mt-4">Great Deals</h3>
              <p className="text-gray-500 mt-2">
                Find smartphones at competitive prices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
