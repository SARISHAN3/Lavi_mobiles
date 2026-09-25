import { NavLink, Outlet } from "react-router-dom";
import {
  MdDashboard,
  MdPhoneAndroid,
  MdShoppingCart,
  MdPeople,
  MdCategory,
  MdBrandingWatermark,
  MdRateReview,
  MdLocalOffer,
  MdLogout,
} from "react-icons/md";

function AdminLayout() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <MdDashboard />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <MdPhoneAndroid />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <MdShoppingCart />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <MdPeople />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <MdCategory />,
    },
    {
      name: "Brands",
      path: "/admin/brands",
      icon: <MdBrandingWatermark />,
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: <MdRateReview />,
    },
    {
      name: "Coupons",
      path: "/admin/coupons",
      icon: <MdLocalOffer />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-white shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-orange-500">Lavi Mobile</h1>

          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>

              <span>{item.name}</span>
            </NavLink>
          ))}

          <button className="w-full flex items-center gap-3 px-4 py-3 mt-6 rounded-lg text-red-500 hover:bg-red-50">
            <MdLogout className="text-xl" />

            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Admin Dashboard
          </h2>

          <div className="text-sm text-gray-600">Admin</div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
