import { FiSmartphone } from "react-icons/fi";

const Logo = ({ showTagline = false, className = "", onClick }) => {
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
        <FiSmartphone size={20} />
      </div>

      <div className="min-w-0">
        <div className="text-lg font-extrabold leading-none tracking-tight text-[var(--text-primary)]">
          Lavi <span className="text-orange-500">Mobile</span>
        </div>

        {showTagline && (
          <p className="mt-1 text-[10px] font-medium leading-none text-[var(--text-muted)]">
            Smart choices. Better mobiles.
          </p>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Lavi Mobile"
        className="inline-flex"
      >
        {content}
      </button>
    );
  }

  return content;
};

export default Logo;
