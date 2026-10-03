import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route
          path="/home"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Lavi Mobile</h1>

              <p className="mt-2 text-gray-600">Home page coming next.</p>
            </div>
          }
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Login</h1>

              <p className="mt-2 text-gray-600">Login page coming next.</p>
            </div>
          }
        />

        <Route
          path="/register"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Register</h1>

              <p className="mt-2 text-gray-600">Register page coming next.</p>
            </div>
          }
        />

        {/* Products */}
        <Route
          path="/mobiles"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Mobile Phones</h1>

              <p className="mt-2 text-gray-600">
                Product listing page coming next.
              </p>
            </div>
          }
        />

        <Route
          path="/product/:id"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Product Details</h1>

              <p className="mt-2 text-gray-600">
                Product details page coming next.
              </p>
            </div>
          }
        />

        {/* Shopping */}
        <Route
          path="/cart"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Shopping Cart</h1>

              <p className="mt-2 text-gray-600">Cart page coming next.</p>
            </div>
          }
        />

        <Route
          path="/wishlist"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Wishlist</h1>

              <p className="mt-2 text-gray-600">Wishlist page coming next.</p>
            </div>
          }
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Checkout</h1>

              <p className="mt-2 text-gray-600">Checkout page coming next.</p>
            </div>
          }
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">My Orders</h1>

              <p className="mt-2 text-gray-600">Orders page coming next.</p>
            </div>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Order Details</h1>

              <p className="mt-2 text-gray-600">
                Order details page coming next.
              </p>
            </div>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">My Profile</h1>

              <p className="mt-2 text-gray-600">Profile page coming next.</p>
            </div>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>

              <p className="mt-2 text-gray-600">Admin dashboard coming next.</p>
            </div>
          }
        />

        <Route
          path="/admin/products"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Admin Products</h1>

              <p className="mt-2 text-gray-600">
                Admin product management coming next.
              </p>
            </div>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Admin Categories</h1>

              <p className="mt-2 text-gray-600">
                Admin category management coming next.
              </p>
            </div>
          }
        />

        <Route
          path="/admin/brands"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Admin Brands</h1>

              <p className="mt-2 text-gray-600">
                Admin brand management coming next.
              </p>
            </div>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Admin Orders</h1>

              <p className="mt-2 text-gray-600">
                Admin order management coming next.
              </p>
            </div>
          }
        />

        <Route
          path="/admin/users"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Admin Users</h1>

              <p className="mt-2 text-gray-600">
                Admin user management coming next.
              </p>
            </div>
          }
        />

        <Route
          path="/admin/coupons"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Admin Coupons</h1>

              <p className="mt-2 text-gray-600">
                Admin coupon management coming next.
              </p>
            </div>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Admin Reviews</h1>

              <p className="mt-2 text-gray-600">
                Admin review management coming next.
              </p>
            </div>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold">Admin Settings</h1>

              <p className="mt-2 text-gray-600">Admin settings coming next.</p>
            </div>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-5xl font-bold">404</h1>

                <p className="mt-3 text-gray-600">Page not found</p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
