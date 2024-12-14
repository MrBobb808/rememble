import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Temporarily bypass authentication and redirect directly to director dashboard
    navigate('/director');
  }, [navigate]);

  // Return null since we're immediately redirecting
  return null;
};

export default Auth;