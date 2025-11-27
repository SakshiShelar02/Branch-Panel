import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acceptOrder, rejectOrder, deliverOrder, updateOrderStatus } from '../redux/slices/orderSlice'
import { 
  Check, 
  X, 
  Truck, 
  Clock, 
  Search, 
  Filter, 
  ShoppingBag, 
  Download,
  RefreshCw,
  CircleCheckBig,
  CircleX,
  DollarSign,
  Funnel,
  ChevronDown,
  ChevronUp,
  Eye,
  MoreVertical,
  User,
  Phone,
  MapPin,
  MessageCircle,
  Package,
  Image,
  Zap
} from 'lucide-react'

const OrderManagement = () => {
  const { orders } = useSelector(state => state.orders)
  const dispatch = useDispatch()
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    payment: 'all',
    paymentMethod: 'all',
    timeRange: 'all',
    sortBy: 'orderDate',
    sortOrder: 'DESC'
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-50 text-orange-700 border border-orange-200'
      case 'accepted': return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'delivered': return 'bg-green-50 text-green-700 border border-green-200'
      case 'rejected': return 'bg-red-50 text-red-700 border border-red-200'
      default: return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  const getPaymentColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid': return 'bg-green-50 text-green-700 border border-green-200'
      case 'unpaid': return 'bg-orange-50 text-orange-700 border border-orange-200'
      case 'refunded': return 'bg-red-50 text-red-700 border border-red-200'
      default: return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending'
      case 'accepted': return 'In Progress'
      case 'delivered': return 'Completed'
      case 'rejected': return 'Cancelled'
      default: return status
    }
  }

  const getPaymentText = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid': return 'Paid'
      case 'unpaid': return 'Unpaid'
      case 'refunded': return 'Refunded'
      default: return paymentStatus
    }
  }

  const handleAccept = (orderId) => {
    dispatch(acceptOrder(orderId))
  }

  const handleReject = (orderId) => {
    dispatch(rejectOrder(orderId))
  }

  const handleDeliver = (orderId) => {
    dispatch(deliverOrder(orderId))
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      payment: 'all',
      paymentMethod: 'all',
      timeRange: 'all',
      sortBy: 'orderDate',
      sortOrder: 'DESC'
    })
  }

  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC'
    }))
  }

  const handleRefresh = () => {
    // Refresh the data by clearing filters and triggering a re-render
    clearAllFilters()
    // In a real application, you might want to refetch data from an API here
    console.log('Refreshing orders data...')
  }

  const handleExport = () => {
    // Export filtered orders to CSV
    const headers = ['Order ID', 'Customer Name', 'Customer Phone', 'Items', 'Total Amount', 'Payment Status', 'Payment Method', 'Order Status', 'Timestamp']
    
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.orderId,
        `"${order.customerName}"`,
        order.customerPhone,
        `"${order.items.map(item => `${item.quantity}x ${item.name}`).join('; ')}"`,
        order.total,
        order.paymentStatus,
        order.paymentMethod,
        order.status,
        `"${order.timestamp}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    const lastMonth = new Date(today)
    lastMonth.setDate(lastMonth.getDate() - 30)

    // Search filter
    if (filters.search && 
        !order.orderId.toLowerCase().includes(filters.search.toLowerCase()) && 
        !order.customerName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !order.customerPhone.includes(filters.search)) {
      return false
    }
    
    // Status filter
    if (filters.status !== 'all' && order.status !== filters.status) {
      return false
    }
    
    // Payment status filter
    if (filters.payment !== 'all' && order.paymentStatus !== filters.payment) {
      return false
    }

    // Payment method filter
    if (filters.paymentMethod !== 'all' && order.paymentMethod !== filters.paymentMethod) {
      return false
    }
    
    // Time range filter
    if (filters.timeRange !== 'all') {
      switch (filters.timeRange) {
        case 'today':
          if (orderDate.toDateString() !== today.toDateString()) return false
          break
        case 'yesterday':
          if (orderDate.toDateString() !== yesterday.toDateString()) return false
          break
        case 'week':
          if (orderDate < lastWeek) return false
          break
        case 'month':
          if (orderDate < lastMonth) return false
          break
        default:
          break
      }
    }
    
    return true
  }).sort((a, b) => {
    // Sort logic
    if (filters.sortBy === 'orderDate') {
      return filters.sortOrder === 'ASC' 
        ? new Date(a.timestamp) - new Date(b.timestamp)
        : new Date(b.timestamp) - new Date(a.timestamp)
    } else if (filters.sortBy === 'totalAmount') {
      return filters.sortOrder === 'ASC' 
        ? a.total - b.total
        : b.total - a.total
    } else if (filters.sortBy === 'customerName') {
      return filters.sortOrder === 'ASC'
        ? a.customerName.localeCompare(b.customerName)
        : b.customerName.localeCompare(a.customerName)
    } else if (filters.sortBy === 'status') {
      return filters.sortOrder === 'ASC'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status)
    }
    return 0
  })

  // Calculate statistics based on FILTERED orders
  const totalToday = filteredOrders.length
  const completedOrders = filteredOrders.filter(order => order.status === 'delivered').length
  const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length
  const cancelledOrders = filteredOrders.filter(order => order.status === 'rejected').length
  const totalRevenue = filteredOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0)

  const statsCards = [
    {
      title: 'Total Orders',
      value: totalToday,
      icon: ShoppingBag,
      color: 'text-red-600'
    },
    {
      title: 'Completed',
      value: completedOrders,
      icon: CircleCheckBig,
      color: 'text-red-600'
    },
    {
      title: 'Pending',
      value: pendingOrders,
      icon: Clock,
      color: 'text-red-600'
    },
    {
      title: 'Cancelled',
      value: cancelledOrders,
      icon: CircleX,
      color: 'text-red-600'
    },
    {
      title: 'Revenue',
      value: `SAR ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-red-600'
    }
  ]

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true 
  })

  // Order Details Modal
  const OrderDetailsModal = () => {
    if (!selectedOrder) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Order Details - {selectedOrder.orderId}</h3>
              <button 
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Order Header */}
            <div className="md:col-span-2">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{selectedOrder.orderId}</h4>
                    <Zap className="w-4 h-4 text-orange-500" />
                    <div className={`w-3 h-3 rounded-full ${
                      selectedOrder.status === 'delivered' ? 'bg-green-500' :
                      selectedOrder.status === 'accepted' ? 'bg-blue-500' :
                      selectedOrder.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Order placed by {selectedOrder.customerName}</p>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      <span className={`w-1 h-1 rounded-full mr-1 ${
                        selectedOrder.status === 'delivered' ? 'bg-green-400' :
                        selectedOrder.status === 'accepted' ? 'bg-blue-400' :
                        selectedOrder.status === 'pending' ? 'bg-orange-400' : 'bg-red-400'
                      }`}></span>
                      {getStatusText(selectedOrder.status)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentColor(selectedOrder.paymentStatus)}`}>
                      <span className={`w-1 h-1 rounded-full mr-1 ${
                        selectedOrder.paymentStatus === 'paid' ? 'bg-green-400' :
                        selectedOrder.paymentStatus === 'unpaid' ? 'bg-orange-400' : 'bg-red-400'
                      }`}></span>
                      {getPaymentText(selectedOrder.paymentStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Information */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Customer Name</label>
                <p className="text-xs text-gray-900">{selectedOrder.customerName}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Customer Phone</label>
                <p className="text-xs text-gray-900">{selectedOrder.customerPhone}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Delivery Address</label>
                <p className="text-xs text-gray-900">{selectedOrder.customerAddress}</p>
              </div>
              
              {/* Order Information */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                <p className="text-xs text-gray-900">{selectedOrder.paymentMethod}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Order Time</label>
                <p className="text-xs text-gray-900">{selectedOrder.timestamp}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Delivery Time</label>
                <p className="text-xs text-gray-900">{selectedOrder.deliveryTime}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Total Amount</label>
                <p className="text-xs font-semibold text-gray-900">SAR {selectedOrder.total}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Order Items</label>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × SAR {item.price}</p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-900">SAR {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <p className="text-xs font-medium text-gray-900">Total</p>
                  <p className="text-sm font-bold text-gray-900">SAR {selectedOrder.total}</p>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {selectedOrder.specialInstructions && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Special Instructions</label>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">{selectedOrder.specialInstructions}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowOrderDetails(false)}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xs transition-colors"
              >
                Close
              </button>
              {selectedOrder.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleAccept(selectedOrder.id)
                      setShowOrderDetails(false)
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs transition-colors"
                  >
                    Accept Order
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedOrder.id)
                      setShowOrderDetails(false)
                    }}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs transition-colors"
                  >
                    Reject Order
                  </button>
                </>
              )}
              {selectedOrder.status === 'accepted' && (
                <button
                  onClick={() => {
                    handleDeliver(selectedOrder.id)
                    setShowOrderDetails(false)
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs transition-colors"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Header Buttons */}
        <div className="flex items-center justify-end gap-2 mb-4 py-4">
          <button 
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
          <button 
            className="inline-flex items-center gap-1.5 text-xs text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors"
            onClick={handleExport}
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {statsCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-lg font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className="p-2 rounded-md bg-gray-50">
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <input 
                    placeholder="Search by Order ID, Customer, or Phone..." 
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs" 
                    type="text" 
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  value={filters.payment}
                  onChange={(e) => handleFilterChange('payment', e.target.value)}
                >
                  <option value="all">All Payment</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="refunded">Refunded</option>
                </select>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">In Progress</option>
                  <option value="delivered">Completed</option>
                  <option value="rejected">Cancelled</option>
                </select>
                <button 
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => setShowMoreFilters(!showMoreFilters)}
                >
                  <Funnel className="w-3 h-3" />
                  More
                  {showMoreFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* More Filters Section */}
            {showMoreFilters && (
              <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200">
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  value={filters.paymentMethod}
                  onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                >
                  <option value="all">All Payment Methods</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Digital Wallet">Digital Wallet</option>
                </select>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  value={filters.timeRange}
                  onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="orderDate">Sort by Date</option>
                  <option value="totalAmount">Sort by Amount</option>
                  <option value="customerName">Sort by Customer</option>
                  <option value="status">Sort by Status</option>
                </select>
                <button 
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={toggleSortOrder}
                >
                  {filters.sortOrder === 'ASC' ? '↑ ASC' : '↓ DESC'}
                </button>
                <button 
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
                  onClick={clearAllFilters}
                >
                  <X className="w-3 h-3" />
                  Clear All
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div>Showing {filteredOrders.length} of {orders.length} orders</div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Last updated: {currentTime}
              </div>
            </div>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Show:</label>
            <select className="border border-gray-300 rounded px-2 py-1 text-xs">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-xs text-gray-600">entries</span>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                        <span className="text-xs">No orders found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2">
                        <span className="text-xs font-medium text-red-600">{order.orderId}</span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-700">
                            {order.customerName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900">{order.customerName}</p>
                            <p className="text-xs text-gray-500">{order.customerPhone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <p className="text-xs text-gray-600 max-w-32 truncate">
                          {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                        </p>
                      </td>
                      <td className="px-4 py-2">
                        <p className="text-xs font-semibold text-gray-900">SAR {order.total}</p>
                      </td>
                      <td className="px-4 py-2">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.paymentStatus)}`}>
                            {getPaymentText(order.paymentStatus)}
                          </span>
                          <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <p className="text-xs text-gray-500">{order.timestamp}</p>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Order Details"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAccept(order.id)}
                                className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Accept Order"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleReject(order.id)}
                                className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Reject Order"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          )}
                          {order.status === 'accepted' && (
                            <button
                              onClick={() => handleDeliver(order.id)}
                              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Mark as Delivered"
                            >
                              <Truck className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && <OrderDetailsModal />}
    </div>
  )
}

export default OrderManagement