import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedAction = ({
  children,
  onAction,
  redirectTo = "/login",
  className = "",
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate(redirectTo, {
        state: {
          from: window.location.pathname + window.location.search,
        },
      });

      return;
    }

    await onAction?.(event);
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

export default ProtectedAction;
