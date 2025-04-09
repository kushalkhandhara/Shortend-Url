import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/auth/authSlice';
import {toast} from "react-toastify"


export default function Register() {
  // Define form data state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isAuthenticated, userId, token } = useSelector((state) => state.auth);

  // Handle form submission
  const handleSubmit = async(e) => {
    try{
      e.preventDefault();
      console.log(formData);
           
      const data = await dispatch(registerUser(formData));
      console.log("Data  : ",data);
      if(data?.payload?.error){
        toast.error(data?.payload?.message || "Some Error Occurd")
      }
      navigate("/dashboardForm");

    }catch(error){
      console.log(error)
    }
  };

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Navigate to login page
  const navigateToRegister = () => {
    try {
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
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
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          <p>
            Have An Account? <b className='cursor-pointer' onClick={() => navigateToRegister()}>Login</b>
          </p>
        </form>
      </div>
    </div>
  );
}
