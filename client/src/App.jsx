import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from "./pages/Login"
import Register from "./pages/Register"
import DashboardForm from './pages/Dashboard/DashboardForm'
import DashboardTable from './pages/Dashboard/DashboardTable'
import useAuth from '../customHooks/useAuth'
import CheckAuth from './components/CheckAuth'
import NotCheck from "./components/NotCheck"
import DashboardCharts from './pages/Dashboard/DashboardCharts'
 
export default function App() {

 
  

  return (
    <>
      <Routes>
        <Route path="/" element={<NotCheck><Login/></NotCheck>} />
        <Route path="/register" element={<Register/>} />

        {/* Dashboard */}
        <Route path="/dashboardForm" element={<CheckAuth><DashboardForm/></CheckAuth>} />
        <Route path="/dashboardTable" element={<CheckAuth><DashboardTable/></CheckAuth>} />
        <Route path = "/dashboardCharts" element={<CheckAuth><DashboardCharts/></CheckAuth>} />

      </Routes>
    </>
  )
}
