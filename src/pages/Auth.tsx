import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to memorial page for development
    navigate("/memorial");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-memorial-blue"></div>
    </div>
  );
};

export default Auth;