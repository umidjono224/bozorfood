import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";
import Home from "./Home";

const Index = () => {
  const navigate = useNavigate();
  const { isRegistered } = useUserStore();

  useEffect(() => {
    if (!isRegistered) {
      navigate("/register", { replace: true });
    }
  }, [isRegistered, navigate]);

  if (!isRegistered) {
    return null;
  }

  return <Home />;
};

export default Index;
