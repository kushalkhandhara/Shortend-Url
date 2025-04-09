import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/auth/authSlice';
import {toast} from "react-toastify"

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to manage form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { isLoading, isAuthenticated, userId, token } = useSelector((state) => state.auth);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    try{
      e.preventDefault();
      // Dispatch the login action
      const data = await dispatch(loginUser(formData));
      console.log("Data  : ",data);
      if(data?.payload?.error){
        toast.error(data?.payload?.message || "Some Error Occurd")
      }

      navigate("/dashboardForm");

    }catch(error){
      console.log(error)
    }
  };

 

  // Navigate to register page
  const navigateToRegister = () => {
    try {
      navigate('/register');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

         

          <p>
            Don't have an account?{' '}
            <b className="cursor-pointer" onClick={navigateToRegister}>
              Register
            </b>
          </p>
        </form>
      </div>
    </div>
  );
}
