// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import QRCodeModal from './QRCodeModal';
import { useDispatch, useSelector } from 'react-redux'; 
import {  clickOnLink, getUserLinks } from '../../../store/links/linkSlice.js';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { toast } from 'react-toastify';


const DashboardTable = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Mock data for the table
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [qrData, setQrData] = useState('');
  const { loading } = useSelector((state) => state.links); // Access loading state from Redux


  useEffect(()=>{
    const getLinksData = async()=>{
      try{
        const linkData = await dispatch(getUserLinks());
        console.log("Data of links : ",linkData);

        setData(linkData?.payload?.links || []);

      } catch(error){
        console.log(error)
      }
    }
    getLinksData();
  },[])



  // Function to open the modal with the corresponding QR data
  const handleViewQR = (shortUrl) => {
    setQrData(shortUrl);
    setShowModal(true);
  };

  const navigateToForm = ()=>{
    try{
      navigate("/dashboardForm")
    }catch(error){
      console.log(error);
    }
  }

  function extractYearAndDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-indexed (0-11), so add 1 for 1-12
    const day = date.getDate();
    let dateData = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    
    return dateData
  }


  const redirectToLink = async(shortUrl)=>{
    try{
      console.log("Short URL : ",shortUrl);

      const data = await dispatch(clickOnLink(shortUrl));
      console.log("Data : ",data);
    }catch(error){
      console.log(error)
    }

  }  

  const navigateToCharts = (linkId,clicks) => {
    try {
      if(clicks==0){
        toast.error("There is No Data Present in this Link")
        return
      }
      navigate("/dashboardCharts", { state: { linkId: linkId } });
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <>
      <div className="container mx-auto p-5 w-full overflow-hidden">

        <div className='flex items-center gap-4 mb-8 cursor-pointer' onClick={()=>navigateToForm()}>
          <MdKeyboardArrowLeft size={45} className='text-blue-600'/>
          <h1 className='font-semibold text-blue-500 text-lg '>Go back to Form</h1>
        </div>

        <h1 className="text-2xl font-semibold mb-4">URL Dashboard</h1>
        <div className='lg:w-full w-[350px] overflow-scroll'>
          <table className="w-full border-collapse" >
            <thead>
              <tr className="bg-gray-200">
                
                <th className="py-2 px-4 border border-gray-300  min-w-[150px]">Original URL</th>
                <th className="py-2 px-4 border border-gray-300  min-w-[150px]">Short URL</th>
                <th className="py-2 px-4 border border-gray-300  min-w-[150px]">Total Clicks</th>
                <th className="py-2 px-4 border border-gray-300  min-w-[150px]">Created Date</th>
                <th className="py-2 px-4 border border-gray-300  min-w-[150px]">Expiration Status</th>
                <th className="py-2 px-4 border border-gray-300  min-w-[150px]">View QR</th>
                <th className="py-2 px-4 border border-gray-300  min-w-[150px]">View More</th>
        
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item,index) => (
                  <tr key={item.index} className="hover:bg-gray-100" k>
                    <td className="py-2 px-4 border border-gray-300  min-w-[150px]">{item.originalUrl}</td>
                    <td className="py-2 px-4 border border-gray-300  min-w-[150px]" onClick={()=>redirectToLink(item.shortUrl)}>{item.shortUrl}</td>
                    <td className="py-2 px-4 border border-gray-300  min-w-[150px]">{item.clicks}</td>
                    <td className="py-2 px-4 border border-gray-300  min-w-[150px]">{extractYearAndDate(item?.createdAt) || "NA"}</td>
                    <td className="py-2 px-4 border border-gray-300  min-w-[150px]">{extractYearAndDate(item?.expirationDate) || "NA"}</td>
                    <td className="py-2 px-4 border border-gray-300  min-w-[150px]">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                        onClick={() => handleViewQR(item.shortUrl)}
                      >
                        View QR
                      </button>
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                        onClick = {()=>navigateToCharts(item._id,item.clicks)}
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-gray-100 border-1">
                  <td colSpan="7" className="text-center py-4">
                    Currently There is not any data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <QRCodeModal shortUrl={qrData} closeModal={() => setShowModal(false)} />
        )}
      </div>
    </>
  );
};

export default DashboardTable;
