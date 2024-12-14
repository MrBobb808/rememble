import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect to director dashboard
    navigate('/director');
  }, [navigate]);

  return null;
};

export default Auth;