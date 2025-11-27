import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp,
  Download,
  Calendar,
  GripVertical,
  Clock,
  Star,
  ChevronDown
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const Dashboard = () => {
  const { orders } = useSelector(state => state.orders)
  const [timeRange, setTimeRange] = useState('30days')
  const [revenuePeriod, setRevenuePeriod] = useState('monthly')
  const [orderPeriod, setOrderPeriod] = useState('weekly')
  const dashboardRef = useRef()

  // Calculate statistics from real orders data
  const calculateStats = () => {
    const now = new Date()
    let filteredOrders = [...orders] // Create a copy to avoid mutating Redux state

    // Filter orders based on selected time range
    if (timeRange === '7days') {
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      filteredOrders = filteredOrders.filter(order => new Date(order.timestamp) >= sevenDaysAgo)
    } else if (timeRange === '30days') {
      const thirtyDaysAgo = new Date(now)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      filteredOrders = filteredOrders.filter(order => new Date(order.timestamp) >= thirtyDaysAgo)
    }

    const totalOrders = filteredOrders.length
    const completedOrders = filteredOrders.filter(order => order.status === 'delivered').length
    const pendingOrders = filteredOrders.filter(order => order.status === 'pending' || order.status === 'accepted').length
    const totalRevenue = filteredOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + parseFloat(order.total), 0)
    const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0

    // Get unique customers
    const uniqueCustomers = [...new Set(filteredOrders.map(order => order.customerPhone))].length

    return {
      totalOrders,
      totalRevenue,
      uniqueCustomers,
      avgOrderValue,
      completedOrders,
      pendingOrders
    }
  }

  const stats = calculateStats()

  // Generate revenue data based on period
  const generateRevenueData = () => {
    const now = new Date()
    let data = []

    if (revenuePeriod === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      data = months.map(month => ({
        name: month,
        income: Math.floor(Math.random() * 20000) + 10000,
        expenses: Math.floor(Math.random() * 12000) + 6000
      }))
    } else if (revenuePeriod === 'weekly') {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now)
        date.setDate(date.getDate() - (6 - i))
        return date.toLocaleDateString('en-US', { weekday: 'short' })
      })
      data = last7Days.map(day => ({
        name: day,
        income: Math.floor(Math.random() * 5000) + 2000,
        expenses: Math.floor(Math.random() * 3000) + 1000
      }))
    } else { // today
      const hours = Array.from({ length: 12 }, (_, i) => {
        const hour = i + 8 // 8 AM to 7 PM
        return `${hour}:00`
      })
      data = hours.map(hour => ({
        name: hour,
        income: Math.floor(Math.random() * 800) + 200,
        expenses: Math.floor(Math.random() * 400) + 100
      }))
    }

    return data
  }

  // Generate order data based on period
  const generateOrderData = () => {
    const now = new Date()
    let data = []

    if (orderPeriod === 'weekly') {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now)
        date.setDate(date.getDate() - (6 - i))
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })
      data = last7Days.map(day => ({
        name: day,
        completed: Math.floor(Math.random() * 50) + 20,
        pending: Math.floor(Math.random() * 15) + 5
      }))
    } else { // monthly
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      data = months.map(month => ({
        name: month,
        completed: Math.floor(Math.random() * 200) + 100,
        pending: Math.floor(Math.random() * 50) + 20
      }))
    }

    return data
  }

  // Get recent orders from actual data
  const getRecentOrders = () => {
    return [...orders] // Create a copy to avoid mutating Redux state
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 6)
      .map(order => ({
        id: order.orderId,
        customer: order.customerName,
        initials: order.customerName.split(' ').map(n => n[0]).join(''),
        items: order.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
        amount: `SAR ${order.total}`,
        status: order.status === 'delivered' ? 'Completed' : 
                order.status === 'accepted' ? 'Preparing' : 
                order.status === 'pending' ? 'Pending' : 'Cancelled',
        statusColor: order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                    order.status === 'accepted' ? 'bg-blue-50 text-blue-700' :
                    order.status === 'pending' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700',
        time: new Date(order.timestamp).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }))
  }

  // Get top dishes from actual orders
  const getTopDishes = () => {
    const dishSales = {}
    
    orders.forEach(order => {
      if (order.status === 'delivered') {
        order.items.forEach(item => {
          if (!dishSales[item.name]) {
            dishSales[item.name] = {
              orders: 0,
              revenue: 0
            }
          }
          dishSales[item.name].orders += item.quantity
          dishSales[item.name].revenue += item.price * item.quantity
        })
      }
    })

    return Object.entries(dishSales)
      .map(([name, data]) => ({
        name,
        orders: data.orders,
        revenue: `SAR ${data.revenue.toFixed(2)}`,
        rank: 0 // Will be set after sorting
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)
      .map((dish, index) => ({
        ...dish,
        rank: index + 1
      }))
  }

  const revenueData = generateRevenueData()
  const orderData = generateOrderData()
  const recentOrders = getRecentOrders()
  const topDishes = getTopDishes()

  // Downtown delivery staff only
  const deliveryStaff = [
    { name: 'Ahmed Al Mansouri', initials: 'AAM', area: 'Downtown', orders: 48, rating: 4.9, status: 'Active', statusColor: 'bg-green-50 text-green-700' },
    { name: 'Omar Hassan', initials: 'OH', area: 'Downtown', orders: 42, rating: 4.8, status: 'Active', statusColor: 'bg-green-50 text-green-700' },
    { name: 'Mohammed Ali', initials: 'MA', area: 'Downtown', orders: 38, rating: 4.7, status: 'Busy', statusColor: 'bg-orange-50 text-orange-700' },
    { name: 'Khalid Ibrahim', initials: 'KI', area: 'Downtown', orders: 35, rating: 4.9, status: 'Active', statusColor: 'bg-green-50 text-green-700' },
    { name: 'Rashid Saeed', initials: 'RS', area: 'Downtown', orders: 31, rating: 4.6, status: 'Offline', statusColor: 'bg-gray-100 text-gray-600' },
  ]

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: 'text-red-600'
    },
    {
      title: 'Revenue',
      value: `SAR ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-red-600'
    },
    {
      title: 'Customers',
      value: stats.uniqueCustomers.toLocaleString(),
      icon: Users,
      color: 'text-red-600'
    },
    {
      title: 'Avg Order Value',
      value: `SAR ${stats.avgOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-red-600'
    }
  ]

  const handleResetLayout = () => {
    setTimeRange('30days')
    setRevenuePeriod('monthly')
    setOrderPeriod('weekly')
  }

  const handleTimeRangeChange = (value) => {
    setTimeRange(value)
  }

  const handleExport = async () => {
    const element = dashboardRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      pdf.setFontSize(20);
      pdf.text('Dashboard Report', pdfWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
      pdf.text(`Time Range: ${timeRange === '7days' ? 'Last 7 Days' : timeRange === '30days' ? 'Last 30 Days' : 'All Time'}`, 20, 45);
      
      const imgWidth = pdfWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 20, 60, imgWidth, imgHeight);
      pdf.save(`dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen" ref={dashboardRef}>
      <div className="flex items-center justify-end gap-2 py-4">
        <button 
          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={handleResetLayout}
        >
          Reset Layout
        </button>
        <div className="relative">
          <select 
            className="appearance-none inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 bg-white pr-8"
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="all">All Time</option>
          </select>
          <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>
        <button 
          onClick={handleExport}
          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center gap-1 text-xs transition-colors"
        >
          <Download className="w-3 h-3" />
          Export Report
        </button>
      </div>

      <div className="py-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Charts */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 min-h-[320px]">
            {/* Revenue Chart */}
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Revenue</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Income vs Expenses analysis</p>
                  </div>
                </div>
                <div className="flex rounded-md border border-gray-200 p-0.5 bg-gray-50">
                  <button 
                    className={`px-2 py-1 text-xs font-medium capitalize rounded-sm transition-all ${
                      revenuePeriod === 'monthly' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                    onClick={() => setRevenuePeriod('monthly')}
                  >
                    monthly
                  </button>
                  <button 
                    className={`px-2 py-1 text-xs font-medium capitalize rounded-sm transition-all ${
                      revenuePeriod === 'weekly' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                    onClick={() => setRevenuePeriod('weekly')}
                  >
                    weekly
                  </button>
                  <button 
                    className={`px-2 py-1 text-xs font-medium capitalize rounded-sm transition-all ${
                      revenuePeriod === 'today' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                    onClick={() => setRevenuePeriod('today')}
                  >
                    today
                  </button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#f87171" strokeWidth={2} />
                    <Line type="monotone" dataKey="expenses" stroke="#9ca3af" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                  <span className="text-xs font-medium text-gray-700">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                  <span className="text-xs font-medium text-gray-700">Expenses</span>
                </div>
              </div>
            </div>

            {/* Order Summary Chart */}
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Order Summary</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Completed vs Pending orders</p>
                  </div>
                </div>
                <div className="flex rounded-md border border-gray-200 p-0.5 bg-gray-50">
                  <button 
                    className={`px-2 py-1 text-xs font-medium capitalize rounded-sm transition-all ${
                      orderPeriod === 'weekly' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                    onClick={() => setOrderPeriod('weekly')}
                  >
                    weekly
                  </button>
                  <button 
                    className={`px-2 py-1 text-xs font-medium capitalize rounded-sm transition-all ${
                      orderPeriod === 'monthly' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                    onClick={() => setOrderPeriod('monthly')}
                  >
                    monthly
                  </button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#f87171" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="pending" fill="#9ca3af" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                  <span className="text-xs font-medium text-gray-700">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                  <span className="text-xs font-medium text-gray-700">Pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="min-h-[320px]">
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Latest customer orders and status updates</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="pb-3 font-medium text-gray-600">Order ID</th>
                      <th className="pb-3 font-medium text-gray-600">Customer</th>
                      <th className="pb-3 font-medium text-gray-600">Items</th>
                      <th className="pb-3 font-medium text-gray-600">Amount</th>
                      <th className="pb-3 font-medium text-gray-600">Status</th>
                      <th className="pb-3 font-medium text-gray-600">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-25 transition-colors">
                        <td className="py-3 font-medium text-red-700">{order.id}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-700">
                              {order.initials}
                            </div>
                            <span className="font-medium text-gray-900">{order.customer}</span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-600 max-w-48 truncate">{order.items}</td>
                        <td className="py-3 font-semibold text-gray-900">{order.amount}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.time}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[400px]">
            {/* Top Selling Dishes */}
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Top Selling Dishes</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Best performing menu items this month</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {topDishes.map((dish, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs bg-red-400">
                          {dish.rank}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">{dish.name}</p>
                          <p className="text-xs text-gray-500">{dish.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-900">{dish.revenue}</p>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 bg-gray-600" 
                        style={{ width: `${100 - (index * 15)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Staff */}
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Delivery Staff</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Today's delivery team performance</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {deliveryStaff.map((staff, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm">
                          {staff.initials}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          staff.status === 'Active' ? 'bg-green-500' : 
                          staff.status === 'Busy' ? 'bg-orange-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-900">{staff.name}</p>
                        <p className="text-xs text-gray-500">{staff.area}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900">{staff.orders}</p>
                        <p className="text-xs text-gray-500">Orders</p>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 rounded-md">
                        <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                        <span className="text-xs font-semibold text-gray-900">{staff.rating}</span>
                      </div>
                      <div className={`w-16 text-center px-2 py-1 rounded-md text-xs font-semibold ${staff.statusColor}`}>
                        {staff.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard