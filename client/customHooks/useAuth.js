import { useEffect } from 'react';

const useAuth = () => {
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    // Check for 'authToken' and 'userId' in cookies
    const authToken = getCookie('authToken');
    const userId = getCookie('userId');

    // Only set in localStorage if both 'authToken' and 'userId' are found in cookies
    if (authToken && userId) {
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userId', userId);
    }
  }, []);
};

export default useAuth;
