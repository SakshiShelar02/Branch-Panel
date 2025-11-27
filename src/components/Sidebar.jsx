import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart3,
  Building,
  LogOut,
  X
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'

const Sidebar = ({ activePage, setActivePage }) => {
  const dispatch = useDispatch()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Order Management', icon: ShoppingBag },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'branch-info', label: 'Branch Info', icon: Building }
  ]

  const handleLogout = () => {
    dispatch(logout())
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  const SidebarContent = ({ isMobile = false }) => (
    <>
      <div className={`${isMobile ? 'p-3' : 'p-1.5'} overflow-y-auto flex-grow`}>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActivePage(item.id)
                    if (isMobile) setIsMobileMenuOpen(false)
                  }}
                  className={`group flex items-center w-full h-9 px-2 text-xs font-medium rounded-md transition-colors duration-200 relative ${
                    isActive 
                      ? 'bg-red-50 text-red-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                  } ${!isMobile && isHovered ? 'justify-start' : 'justify-center'}`}
                >
                  <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  {(!isMobile && isHovered) || isMobile ? (
                    <div className="ml-2 overflow-hidden">
                      <span className="block text-xs whitespace-nowrap opacity-0 animate-fadeIn">
                        {item.label}
                      </span>
                    </div>
                  ) : null}
                  {isActive && !isMobile && (
                    <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-red-600 rounded-l-full"></div>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      
      {/* Logout Button at Bottom */}
      <div className="p-1.5 border-t border-gray-100 flex-shrink-0 mt-auto">
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center h-9 px-2 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 relative group ${
            isHovered ? 'justify-start' : 'justify-center'
          }`}
        >
          <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
            <LogOut className="w-4 h-4" />
          </div>
          {isHovered && (
            <div className="ml-2 overflow-hidden">
              <span className="block text-xs whitespace-nowrap opacity-0 animate-fadeIn">
                Logout
              </span>
            </div>
          )}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-3">
          <div className="h-8">
            <div className="h-full w-full flex items-center justify-center">
              <img 
                src="/logo.jpeg" 
                alt="Logo" 
                className="h-6 w-6 object-contain"
              />
            </div>
          </div>
          <button 
            className="p-1.5 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center">
              <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
              }`}></span>
              <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
              }`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <nav 
        className={`hidden lg:flex flex-col h-screen bg-white border-r border-gray-200 shadow-sm fixed top-0 left-0 transition-all duration-300 ease-in-out z-40 ${
          isHovered ? 'w-56' : 'w-14'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-12 p-2 border-b border-gray-100 flex-shrink-0 flex items-center justify-center">
          <div className="flex items-center">
            <div className="h-6 w-6 flex items-center justify-center">
              <img 
                src="/logo.jpeg" 
                alt="Logo" 
                className="h-5 w-5 object-contain"
              />
            </div>
            {isHovered && (
              <div className="ml-2 overflow-hidden">
                <h1 className="text-xs font-medium text-gray-900 whitespace-nowrap opacity-0 animate-fadeIn">
                  Welcome !
                </h1>
              </div>
            )}
          </div>
        </div>
        
        <SidebarContent />
      </nav>

      {/* Mobile Sidebar */}
      <nav className={`lg:hidden fixed top-0 left-0 z-50 h-screen w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="h-10 flex items-center">
              <img 
                src="/logo.jpeg" 
                alt="Logo" 
                className="h-8 w-8 object-contain mr-2"
              />
              <div className="text-sm font-bold text-gray-700">
                BRANCH PANEL
              </div>
            </div>
            <button 
              className="p-1.5 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow">
          <div className="p-3 overflow-y-auto flex-grow">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activePage === item.id
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActivePage(item.id)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`group flex items-center w-full h-9 px-2 text-sm font-medium rounded-md transition-colors duration-200 relative ${
                        isActive 
                          ? 'bg-red-50 text-red-700' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                      } justify-start`}
                    >
                      <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="ml-2 overflow-hidden">
                        <span className="block text-sm whitespace-nowrap">
                          {item.label}
                        </span>
                      </div>
                      {isActive && (
                        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-red-600 rounded-l-full"></div>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
          
          {/* Logout Button at Bottom for Mobile */}
          <div className="p-3 border-t border-gray-100 flex-shrink-0 mt-auto">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </>
  )
}

export default Sidebar