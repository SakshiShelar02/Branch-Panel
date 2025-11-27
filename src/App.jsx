import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import OrderManagement from './pages/OrderManagement'
import Statistics from './pages/Statistics'
import BranchAdminInfo from './pages/BranchAdminInfo'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const { isAuthenticated } = useSelector(state => state.auth)

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />
      case 'orders':
        return <OrderManagement />
      case 'statistics':
        return <Statistics />
      case 'branch-info':
        return <BranchAdminInfo />
      default:
        return <Dashboard />
    }
  }

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <div className="flex min-h-screen bg-gray-100">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <div className="flex-1 lg:ml-14">
              <Navbar activePage={activePage} setActivePage={setActivePage} />
              <main className="flex-grow p-4 pt-18">
                {renderPage()}
              </main>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  )
}

export default App