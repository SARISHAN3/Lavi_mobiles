import { NavLink, Outlet } from "react-router-dom";
import { MdLogout, MdMenu, MdClose } from "react-icons/md";
import { useState } from "react";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M10.5 8.75v-2c0-1.644 0-2.466-.454-3.019a2 2 0 0 0-.277-.277C9.216 3 8.394 3 6.75 3s-2.466 0-3.019.454a2 2 0 0 0-.277.277C3 4.284 3 5.106 3 6.75v2c0 1.644 0 2.466.454 3.019q.125.152.277.277c.553.454 1.375.454 3.019.454s2.466 0 3.019-.454q.152-.125.277-.277c.454-.553.454-1.375.454-3.019ZM7.75 15.5h-2c-.698 0-1.047 0-1.33.086a2 2 0 0 0-1.334 1.333C3 17.203 3 17.552 3 18.25s0 1.047.086 1.33a2 2 0 0 0 1.333 1.334C4.703 21 5.052 21 5.75 21h2c.698 0 1.047 0 1.33-.086a2 2 0 0 0 1.334-1.333c.086-.284.086-.633.086-1.331s0-1.047-.086-1.33a2 2 0 0 0-1.333-1.334c-.284-.086-.633-.086-1.331-.086ZM21 17.25v-2c0-1.644 0-2.466-.454-3.019a2 2 0 0 0-.277-.277c-.553-.454-1.375-.454-3.019-.454s-2.466 0-3.019.454a2 2 0 0 0-.277.277c-.454.553-.454 1.375-.454 3.019v2c0 1.644 0 2.466.454 3.019q.125.152.277.277c.553.454 1.375.454 3.019.454s2.466 0 3.019-.454q.152-.125.277-.277C21 19.716 21 18.894 21 17.25ZM18.25 3h-2c-.698 0-1.047 0-1.33.086a2 2 0 0 0-1.334 1.333c-.086.284-.086.633-.086 1.331s0 1.047.086 1.33a2 2 0 0 0 1.333 1.334c.284.086.633.086 1.331.086h2c.698 0 1.047 0 1.33-.086a2 2 0 0 0 1.334-1.333C21 6.797 21 6.448 21 5.75s0-1.047-.086-1.33a2 2 0 0 0-1.333-1.334C19.297 3 18.948 3 18.25 3Z"
          />
        </svg>
      ),
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 2048 2048"
        >
          <path d="M0 0h2048v2048H0z" fill="none" />
          <path
            fill="currentColor"
            d="m960 120l832 416v1040l-832 415l-832-415V536zm625 456L960 264L719 384l621 314zM960 888l238-118l-622-314l-241 120zM256 680v816l640 320v-816zm768 1136l640-320V680l-640 320z"
          />
        </svg>
      ),
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="M21.08 7a2 2 0 0 0-1.7-1H6.58L6 3.74A1 1 0 0 0 5 3H3a1 1 0 0 0 0 2h1.24L7 15.26A1 1 0 0 0 8 16h9a1 1 0 0 0 .89-.55l3.28-6.56A2 2 0 0 0 21.08 7m-4.7 7H8.76L7.13 8h12.25Z"
          />
          <circle cx="7.5" cy="19.5" r="1.5" fill="currentColor" />
          <circle cx="17.5" cy="19.5" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 20c0-1.742-1.67-3.223-4-3.773M15 20c0-2.21-2.686-4-6-4s-6 1.79-6 4m12-7a4 4 0 0 0 0-8m-6 8a4 4 0 1 1 0-8a4 4 0 0 1 0 8"
          />
        </svg>
      ),
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            fill="currentColor"
            d="m12 2l-5.5 9h11zm0 3.84L13.93 9h-3.87zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5s4.5-2.01 4.5-4.5s-2.01-4.5-4.5-4.5m0 7a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5M3 21.5h8v-8H3zm2-6h4v4H5z"
          />
        </svg>
      ),
    },
    {
      name: "Brands",
      path: "/admin/brands",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 48 48"
        >
          <path d="M0 0h48v48H0z" fill="none" />
          <g
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="4"
          >
            <rect width="38" height="20" x="5" y="6" rx="2" />
            <path
              stroke-linecap="round"
              d="M12 26v16m24-9H12m4 9H8m32 0h-8m4-16v16"
            />
          </g>
        </svg>
      ),
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 32 32"
        >
          <path d="M0 0h32v32H0z" fill="none" />
          <path
            fill="currentColor"
            d="m16 8l1.912 3.703l4.088.594L19 15l1 4l-4-2.25L12 19l1-4l-3-2.703l4.2-.594z"
          />
          <path
            fill="currentColor"
            d="M17.736 30L16 29l4-7h6a1.997 1.997 0 0 0 2-2V8a1.997 1.997 0 0 0-2-2H6a1.997 1.997 0 0 0-2 2v12a1.997 1.997 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-4.835Z"
          />
        </svg>
      ),
    },
    {
      name: "Coupons",
      path: "/admin/coupons",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          >
            <path d="m15 9l-6 6m.375-5.75H9.25m.25 0a.25.25 0 1 1-.5 0a.25.25 0 0 1 .5 0m5.375 5.5h-.125m.25 0a.25.25 0 1 1-.5 0a.25.25 0 0 1 .5 0" />
            <path d="M2 14.5a2.5 2.5 0 0 0 0-5c0-2.346 0-3.518.62-4.326a3 3 0 0 1 .554-.554C3.982 4 5.154 4 7.5 4h9c2.346 0 3.518 0 4.326.62a3 3 0 0 1 .554.554c.62.808.62 1.98.62 4.326a2.5 2.5 0 0 0 0 5c0 2.346 0 3.518-.62 4.326a3 3 0 0 1-.554.554c-.808.62-1.98.62-4.326.62h-9c-2.345 0-3.518 0-4.326-.62a3 3 0 0 1-.554-.554C2 18.018 2 16.846 2 14.5" />
          </g>
        </svg>
      ),
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 20 20"
        >
          <path d="M0 0h20v20H0z" fill="none" />
          <path
            fill="currentColor"
            d="M9.354 6.396a.5.5 0 0 1 0 .708l-1.75 1.75a.5.5 0 0 1-.691.015l-.75-.685a.5.5 0 1 1 .674-.738l.397.362l1.412-1.412a.5.5 0 0 1 .708 0m0 5.708a.5.5 0 0 0-.708-.708l-1.412 1.412l-.397-.362a.5.5 0 0 0-.674.738l.75.685a.5.5 0 0 0 .69-.015zM11 7a.5.5 0 0 0 0 1h2.5a.5.5 0 0 0 0-1zM3 6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3.601a5.5 5.5 0 0 0-1-.393V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3.208q.148.52.393 1H6a3 3 0 0 1-3-3zm7.634 7.92a2 2 0 0 0 1.43-2.478l-.156-.557q.383-.296.822-.5l.337.358a2 2 0 0 0 2.91 0l.322-.343q.448.21.835.518l-.126.422a2 2 0 0 0 1.456 2.519l.35.082a4.6 4.6 0 0 1 .01 1.017l-.46.118a2 2 0 0 0-1.432 2.478l.156.556q-.383.296-.822.5l-.337-.358a2 2 0 0 0-2.909 0l-.32.348a4.4 4.4 0 0 1-.836-.518l.126-.423a2 2 0 0 0-1.456-2.52l-.349-.082a4.6 4.6 0 0 1-.01-1.016zm4.865.58a1 1 0 1 0-2 0a1 1 0 0 0 2 0"
          />
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          w-64 h-screen
          bg-white border-r border-gray-200
          flex flex-col
          transition-transform duration-300
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-orange-500">Lavi Mobile</h1>

            <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-500 hover:text-gray-800"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>

                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition"
          >
            <MdLogout className="text-xl" />

            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
            >
              <MdMenu className="text-xl" />
            </button>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Admin Dashboard
              </h2>

              <p className="hidden sm:block text-xs text-gray-400 mt-0.5">
                Manage your Lavi Mobile store
              </p>
            </div>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800">Admin</p>

              <p className="text-xs text-gray-400">Administrator</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
