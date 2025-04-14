import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.currentUser);

  if (!currentUser) {
    console.log('No current user in protected routes',currentUser)
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
