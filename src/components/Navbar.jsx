import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, User, ChevronDown, Maximize2, Minimize2, Clock, LayoutDashboard, ShoppingBag, X, TriangleAlert, CircleCheck, MessageSquare, Clock as ClockIcon, Settings, HelpCircle, Globe, LogOut, Shield, BarChart3, Building } from 'lucide-react'
import { logout } from '../redux/slices/authSlice'

const Navbar = ({ activePage, setActivePage }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })

  // Menu items data - mapping to your state-based navigation
  const menuItems = [
    {
      id: 1,
      name: "Dashboard",
      pageKey: "dashboard",
      icon: LayoutDashboard,
      description: "/"
    },
    {
      id: 2,
      name: "Order Management",
      pageKey: "orders",
      icon: ShoppingBag,
      description: "/orders"
    },
    {
      id: 3,
      name: "Statistics",
      pageKey: "statistics",
      icon: BarChart3,
      description: "/statistics"
    },
    {
      id: 4,
      name: "Branch Admin Info",
      pageKey: "branch-info",
      icon: Building,
      description: "/branch-info"
    }
  ]

  // Notification data
  const notifications = [
    {
      id: 1,
      title: "Low Stock Alert",
      message: "Margherita Pizza ingredients running low at Downtown branch",
      time: "2 minutes ago",
      icon: TriangleAlert,
      iconColor: "text-red-500",
      borderColor: "border-l-red-500",
      bgColor: "bg-blue-50/30",
      isNew: true
    },
    {
      id: 2,
      title: "Order Milestone",
      message: "Downtown branch reached 1000 orders this month",
      time: "15 minutes ago",
      icon: CircleCheck,
      iconColor: "text-green-500",
      borderColor: "border-l-blue-500",
      bgColor: "bg-blue-50/30",
      isNew: true
    },
    {
      id: 3,
      title: "System Update",
      message: "New feature: Advanced analytics dashboard is now available",
      time: "1 hour ago",
      icon: MessageSquare,
      iconColor: "text-blue-500",
      borderColor: "border-l-gray-300",
      bgColor: "",
      isNew: false
    },
    {
      id: 4,
      title: "Maintenance Schedule",
      message: "Scheduled maintenance tomorrow at 2:00 AM - 3:00 AM",
      time: "3 hours ago",
      icon: ClockIcon,
      iconColor: "text-yellow-500",
      borderColor: "border-l-blue-500",
      bgColor: "",
      isNew: false
    }
  ]

  const newNotificationsCount = notifications.filter(notification => notification.isNew).length

  // Filter menu items based on search query
  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close search modal if click is outside
      if (isSearchOpen) {
        const searchModal = document.querySelector('.fixed.inset-0.z-50')
        if (searchModal && !searchModal.contains(event.target)) {
          handleCloseSearchModal()
        }
      }
      
      // Close notifications modal if click is outside
      if (isNotificationsOpen) {
        const notificationsModal = document.querySelector('.absolute.right-0.mt-2.w-96')
        if (notificationsModal && !notificationsModal.contains(event.target)) {
          // Check if click is not on the bell icon
          const bellButton = event.target.closest('button')
          if (!bellButton || !bellButton.contains(event.target)) {
            handleCloseNotifications()
          }
        }
      }
      
      // Close profile modal if click is outside
      if (isProfileOpen) {
        const profileModal = document.querySelector('.absolute.right-0.mt-2.w-64')
        if (profileModal && !profileModal.contains(event.target)) {
          // Check if click is not on the profile button
          const profileButton = event.target.closest('button')
          if (!profileButton || !profileButton.contains(event.target)) {
            handleCloseProfile()
          }
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen, isNotificationsOpen, isProfileOpen])

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const handleSearchClick = () => {
    setIsSearchOpen(true)
    setIsNotificationsOpen(false)
    setIsProfileOpen(false)
  }

  const handleCloseSearchModal = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const handleNotificationsClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen)
    setIsProfileOpen(false)
    setIsSearchOpen(false)
  }

  const handleCloseNotifications = () => {
    setIsNotificationsOpen(false)
  }

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen)
    setIsNotificationsOpen(false)
    setIsSearchOpen(false)
  }

  const handleCloseProfile = () => {
    setIsProfileOpen(false)
  }

  const handleItemClick = (pageKey) => {
    setActivePage(pageKey)
    handleCloseSearchModal()
  }

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (isSearchOpen) {
        handleCloseSearchModal()
      } else if (isNotificationsOpen) {
        handleCloseNotifications()
      } else if (isProfileOpen) {
        handleCloseProfile()
      }
    }
  }

  const handleMarkAllAsRead = () => {
    // Logic to mark all notifications as read
    console.log("Mark all as read")
  }

  const handleViewAllNotifications = () => {
    // Logic to view all notifications
    console.log("View all notifications")
  }

  const handleProfileAction = (action) => {
    console.log(`Profile action: ${action}`)
    setIsProfileOpen(false)
    
    switch (action) {
      case 'profile':
        // Navigate to profile page
        setActivePage('branch-info')
        break
      case 'settings':
        // Navigate to settings page
        console.log('Navigate to settings')
        break
      case 'help':
        // Navigate to help page
        console.log('Navigate to help')
        break
      case 'language':
        // Open language settings
        console.log('Open language settings')
        break
      case 'signout':
        handleSignOut()
        break
      default:
        break
    }
  }

  const handleSignOut = () => {
    // Dispatch logout action to clear auth state
    dispatch(logout())
    
    // Close profile modal
    setIsProfileOpen(false)
    
    // Navigate to login page
    navigate('/login')
    
    // Optional: Show success message
    console.log('Successfully signed out')
  }

  return (
    <>
      <nav className="h-16 border-b border-gray-200 shadow-sm fixed top-0 left-16 right-0 z-30 backdrop-blur-lg bg-white/95 rounded-bl-xl">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm min-w-[240px]">
              <span className="text-gray-500">Dashboard</span>
              <span className="text-gray-300">/</span>
              <span className="text-red-600 font-medium">
                {activePage === 'dashboard' ? 'Overview' : 
                 activePage === 'orders' ? 'Order Management' : 
                 activePage === 'statistics' ? 'Statistics' :
                 activePage === 'branch-info' ? 'Branch Admin Info' : 'Overview'}
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{currentTime}</span>
              <span className="text-gray-300">•</span>
              <span>{currentDate}</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-xl mx-8 relative">
            <div className="relative transition-all duration-200">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 transition-colors text-gray-400" />
              </div>
              <input 
                placeholder="Search orders, customers, menu items..." 
                className="w-full pl-10 pr-12 py-2.5 border-2 rounded-xl focus:outline-none transition-all text-sm border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 cursor-pointer" 
                type="text" 
                onClick={handleSearchClick}
                readOnly
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 border border-gray-200 rounded text-xs font-mono bg-white text-red-500">
                  Ctrl+B
                </kbd>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Hidden system status with transparent text */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-transparent rounded-lg">
              <div className="w-2 h-2 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-transparent">All Systems Operational</span>
            </div>
            
            {/* Fullscreen Toggle Button */}
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" 
              title={isFullscreen ? "Exit fullscreen" : "Toggle fullscreen"}
              onClick={handleFullscreenToggle}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
                onClick={handleNotificationsClick}
              >
                <Bell className="w-4 h-4" />
                {newNotificationsCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {newNotificationsCount}
                  </div>
                )}
              </button>

              {/* Notifications Modal */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded-full font-medium">
                          {newNotificationsCount} new
                        </span>
                        <button 
                          className="p-1 hover:bg-gray-200 rounded-md"
                          onClick={handleCloseNotifications}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 border-l-4 ${notification.borderColor} ${notification.bgColor}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <notification.icon 
                              className={`w-4 h-4 ${notification.iconColor}`} 
                              aria-hidden="true"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              {notification.isNew && (
                                <div className="w-2 h-2 bg-red-600 rounded-full ml-2"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <button 
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                        onClick={handleMarkAllAsRead}
                      >
                        Mark all as read
                      </button>
                      <button 
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                        onClick={handleViewAllNotifications}
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile */}
            <div className="relative">
              <button 
                className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={handleProfileClick}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">Branch Manager</p>
                    <p className="text-xs text-gray-500">Downtown Branch</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Modal */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-red-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Branch Manager</p>
                        <p className="text-xs text-gray-600">branch.manager@panel.com</p>
                        <div className="flex items-center mt-1">
                          <Shield className="w-3 h-3 text-red-600 mr-1" aria-hidden="true" />
                          <span className="text-xs text-red-600 font-medium">Branch Admin</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <button 
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                      onClick={() => handleProfileAction('profile')}
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>
                    <button 
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                      onClick={() => handleProfileAction('settings')}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Account Settings</span>
                    </button>
                    <button 
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                      onClick={() => handleProfileAction('help')}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Help & Support</span>
                    </button>
                    <button 
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                      onClick={() => handleProfileAction('language')}
                    >
                      <Globe className="w-4 h-4" />
                      <span>Language</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-200">
                    <button 
                      className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-200"
                      onClick={() => handleProfileAction('signout')}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/20 backdrop-blur-sm" onKeyDown={handleKeyDown}>
          <div className="w-full max-w-xl mx-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 overflow-hidden">
              {/* Search Input */}
              <div className="px-4 py-2">
                <div className="relative">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    aria-hidden="true"
                  >
                    <path d="m21 21-4.34-4.34"></path>
                    <circle cx="11" cy="11" r="8"></circle>
                  </svg>
                  <input 
                    placeholder="Search modules..." 
                    className="w-full pl-10 pr-10 py-2 text-xs bg-transparent border-none outline-none placeholder-gray-400 text-gray-800" 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                </div>
              </div>

              {/* Results List */}
              <div className="border-t border-gray-100/70">
                <div className="max-h-64 overflow-y-auto scroll-smooth">
                  {filteredItems.map((item, index) => (
                    <div 
                      key={item.id}
                      className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-all duration-100 ${
                        index === 0 && searchQuery === '' 
                          ? 'bg-blue-500 text-white' 
                          : 'hover:bg-gray-50/80 text-gray-800'
                      }`}
                      onClick={() => handleItemClick(item.pageKey)}
                    >
                      <div className={`flex-shrink-0 p-1 rounded ${
                        index === 0 && searchQuery === '' 
                          ? 'bg-white/20' 
                          : 'bg-gray-100/80'
                      }`}>
                        <item.icon 
                          className={`w-4 h-4 ${
                            index === 0 && searchQuery === '' 
                              ? 'text-white' 
                              : 'text-gray-600'
                          }`} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-xs ${
                          index === 0 && searchQuery === '' 
                            ? 'text-white' 
                            : 'text-gray-800'
                        }`}>
                          {item.name}
                        </div>
                        <div className={`text-xs truncate ${
                          index === 0 && searchQuery === '' 
                            ? 'text-white/70' 
                            : 'text-gray-500'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                      {index === 0 && searchQuery === '' && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="lucide lucide-chevron-right text-white/70 flex-shrink-0" 
                          aria-hidden="true"
                        >
                          <path d="m9 18 6-6-6-6"></path>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer with Keyboard Shortcuts */}
              <div className="border-t border-gray-100/70 px-4 py-2 bg-gray-50/30">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-white/50 rounded text-xs">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-white/50 rounded text-xs">⏎</kbd>
                      Open
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-white/50 rounded text-xs">⎋</kbd>
                      Close
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar