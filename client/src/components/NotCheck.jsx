import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckAuth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Helper function to get cookie value by name
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const authToken = getCookie('authToken');
    const userId = getCookie('userId');
    
    // Only set in localStorage if both 'authToken' and 'userId' are found in cookies
    if (authToken && userId) {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userId', userId);
        navigate("/dashboardForm")
    }

 
  }, [navigate]);

  return children; // Render the child component (your protected route)
};

export default CheckAuth;
