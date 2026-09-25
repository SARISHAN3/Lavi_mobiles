import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setStats(response.data);
      } catch (error) {
        console.error(
          "Failed to load dashboard stats:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    getDashboardStats();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!stats) {
    return <p>Failed to load dashboard statistics.</p>;
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
    },
    {
      title: "Categories",
      value: stats.totalCategories,
    },
    {
      title: "Brands",
      value: stats.totalBrands,
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

        <p className="text-gray-500 mt-1">Welcome to Lavi Mobile Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <p className="text-gray-500 text-sm">{card.title}</p>

            <h2 className="text-3xl font-bold text-orange-500 mt-3">
              {card.value}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
