import React, { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLinkById } from '../../../store/links/linkSlice';
import {
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, ResponsiveContainer
} from 'recharts';

export default function DashboardCharts() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [clicksData, setClicksData] = useState([]);
  const [linkData, setLinkData] = useState({});

  const linkId = location.state?.linkId || "";
  const { loading } = useSelector((state) => state.links);

  // Prepare data for graphs
  const deviceTypeCounts = {};
  const timestamps = [];
  const clickCounts = [];
  const devices = [];

  useEffect(() => {
    const getDataById = async () => {
      try {
        if (linkId === "") {
          navigate("/dashboardTable");
          return;
        }
        const result = await dispatch(getLinkById(linkId));
        console.log("Data : ", result);
        setLinkData(result?.payload?.linkDetails || {});  // Assuming payload contains link data
        setClicksData(result?.payload?.clicks || []);  // Assuming the `clicks` data is part of the result
      } catch (error) {
        console.log(error);
      }
    };

    getDataById();
  }, [linkId, navigate, dispatch]);

  // Prepare data for the charts
  clicksData.forEach(click => {
    const device = click.deviceType;
    const timestamp = new Date(click.timestamp).toLocaleString();

    // Device Type Distribution for Pie Chart
    deviceTypeCounts[device] = (deviceTypeCounts[device] || 0) + 1;

    // Line Chart Data
    timestamps.push(timestamp);
    clickCounts.push(clickCounts.length + 1); // Simple increment for line chart

    // Collect devices for a bar chart
    if (!devices.includes(device)) {
      devices.push(device);
    }
  });

  // Pie Chart Data for Device Distribution
  const pieData = Object.keys(deviceTypeCounts).map(device => ({
    name: device,
    value: deviceTypeCounts[device],
  }));

  // Line Chart Data for Clicks Over Time
  const lineData = timestamps.map((timestamp, index) => ({
    name: timestamp,
    clicks: clickCounts[index],
  }));

  // Bar Chart Data for Clicks per Device Type
  const barData = devices.map(device => ({
    name: device,
    clicks: deviceTypeCounts[device] || 0,
  }));

  return (
    <>
      <div className="container mx-auto p-6 w-full overflow-hidden">
        <div className="flex items-center gap-4 mb-8 cursor-pointer" onClick={() => navigate("/dashboardTable")}>
          <MdKeyboardArrowLeft size={40} className="text-blue-600" />
          <h1 className="font-semibold text-blue-500 text-lg">Go back to Table</h1>
        </div>

        {/* Conditionally render charts based on data */}
        {clicksData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pie Chart */}
            <div className="chart-container bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4 text-center">Device Distribution (Pie Chart)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    fill="#8884d8"

                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="chart-container bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4 text-center">Clicks Over Time (Line Chart)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="clicks" stroke="#42A5F5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="chart-container bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4 text-center">Clicks per Device (Bar Chart)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="clicks" fill="#FF5733" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
