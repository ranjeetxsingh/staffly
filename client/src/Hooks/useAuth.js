import { useState } from "react";
import axios from "axios";

const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/register", userData);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      return { error: error.response?.data?.message || "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading };
};

export default useAuth;
