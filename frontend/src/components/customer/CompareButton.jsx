import { FiBarChart2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CompareButton = ({ product, onCompare, className = "" }) => {
  const navigate = useNavigate();

  if (!product) return null;

  const handleCompare = () => {
    if (onCompare) {
      onCompare(product);
      return;
    }

    navigate("/compare", {
      state: {
        productId: product._id || product.id,
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleCompare}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-orange-500 hover:text-orange-500 ${className}`}
    >
      <FiBarChart2 size={15} />
      Compare
    </button>
  );
};

export default CompareButton;
