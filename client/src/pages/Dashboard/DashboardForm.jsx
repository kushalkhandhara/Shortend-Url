import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLink } from '../../../store/links/linkSlice.js';
import { useNavigate } from 'react-router-dom';
 
const DashboardForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.links); // Access loading state from Redux
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    expirationDate: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to convert date to backend format
  function convertExpirationDate(dateString) {
    // Create a Date object from the date string
    const date = new Date(dateString);

    // Set the time to 23:59:59 UTC for the end of the day
    date.setUTCHours(23, 59, 59, 0);

    // Return the ISO 8601 format
    return date.toISOString();
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log("Form Data : ", formData);
  
      function clearCookies() {
        localStorage.clear()
        // Get all cookies
        const cookies = document.cookie.split(';');
      
        // Loop through all cookies and set their expiration date to the past
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].split('=');
          const cookieName = cookie[0].trim();
      
          // Set the cookie with the same name and expired date
          document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
        }
      }
      
      if (formData.expirationDate) {
        formData.expirationDate = convertExpirationDate(formData.expirationDate);
      }

      const data = await dispatch(createLink(formData)).unwrap(); // Assuming createLink returns the response data
      console.log("Response : ", data);

      if(data?.error){
        if(data?.message==="Access denied. No token provided." || data?.message==="Invalid or expired token."){
          clearCookies();
          navigate("/")
        }
      }

      
      navigate("/dashboardTable");
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToTable = ()=>{
    try{

      navigate("/dashboardTable")
    }catch(error){
      console.log()
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Create Short Link</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-600 mb-2">
              Long URL
            </label>
            <input
              type="url"
              id="originalUrl"
              name="originalUrl"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter the long URL"
              value={formData.originalUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="customAlias" className="block text-sm font-medium text-gray-600 mb-2">
              Custom Alias (Optional)
            </label>
            <input
              type="text"
              id="customAlias"
              name="customAlias"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Custom alias (optional)"
              value={formData.customAlias}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-600 mb-2">
              Expiration Date (Optional)
            </label>
            <input
              type="date"
              id="expirationDate"
              name="expirationDate"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.expirationDate}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
              disabled={loading} // Disable button when loading
            >
              {loading ? 'Creating...' : 'Create Short Link'}
            </button>
          </div>
          <p className='mt-4'>
            view your links go to <b className='text-blue-600 cursor-pointer' onClick={()=>navigateToTable()}>your table</b>
          </p>
        </form>
      </div>
    </div>
  );
};

export default DashboardForm;
