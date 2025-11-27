import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orders: [
    {
      id: 1,
      customerName: "John Doe",
      orderId: "ORD-001",
      items: [
        { name: "Burger", quantity: 2, price: 8.99 },
        { name: "Fries", quantity: 1, price: 3.99 }
      ],
      total: 25.99,
      status: "pending",
      branch: "Downtown Branch",
      timestamp: "2025-11-25 11:30",
      paymentMethod: "Credit Card",
      paymentStatus: "paid",
      customerPhone: "+1234567890",
      customerAddress: "123 Main St, Downtown",
      specialInstructions: "Extra ketchup please",
      deliveryTime: "30-40 mins"
    },
    {
      id: 2,
      customerName: "Jane Smith",
      orderId: "ORD-002",
      items: [
        { name: "Pizza", quantity: 1, price: 24.99 },
        { name: "Coke", quantity: 2, price: 2.50 }
      ],
      total: 32.50,
      status: "accepted",
      branch: "Downtown Branch",
      timestamp: "2025-11-24 15:20",
      paymentMethod: "Digital Wallet",
      paymentStatus: "paid",
      customerPhone: "+1234567891",
      customerAddress: "456 Oak Ave, City Center",
      specialInstructions: "No onions",
      deliveryTime: "25-35 mins"
    },
    {
      id: 3,
      customerName: "Mike Johnson",
      orderId: "ORD-003",
      items: [
        { name: "Tacos", quantity: 3, price: 4.99 },
        { name: "Salad", quantity: 1, price: 7.99 }
      ],
      total: 18.75,
      status: "delivered",
      branch: "Downtown Branch",
      timestamp: "2025-11-20 13:45",
      paymentMethod: "Cash",
      paymentStatus: "unpaid",
      customerPhone: "+1234567892",
      customerAddress: "789 Pine Rd, Westside",
      specialInstructions: "Extra spicy",
      deliveryTime: "20-30 mins"
    },
    {
      id: 4,
      customerName: "Sarah Wilson",
      orderId: "ORD-004",
      items: [
        { name: "Pasta", quantity: 1, price: 18.99 },
        { name: "Garlic Bread", quantity: 1, price: 4.00 }
      ],
      total: 22.99,
      status: "rejected",
      branch: "Downtown Branch",
      timestamp: "2025-10-30 16:10",
      paymentMethod: "Debit Card",
      paymentStatus: "refunded",
      customerPhone: "+1234567893",
      customerAddress: "321 Elm St, Northgate",
      specialInstructions: "Gluten-free pasta",
      deliveryTime: "35-45 mins"
    },
    {
      id: 5,
      customerName: "Ahmed Hassan",
      orderId: "ORD-005",
      items: [
        { name: "Chicken Burger", quantity: 1, price: 12.99 },
        { name: "Onion Rings", quantity: 1, price: 5.99 },
        { name: "Milkshake", quantity: 1, price: 6.99 }
      ],
      total: 25.97,
      status: "pending",
      branch: "Downtown Branch",
      timestamp: "2025-11-30 14:15",
      paymentMethod: "Credit Card",
      paymentStatus: "paid",
      customerPhone: "+1234567894",
      customerAddress: "654 Maple Dr, South End",
      specialInstructions: "Well done burger",
      deliveryTime: "40-50 mins"
    }
  ],
  stats: {
    total: 150,
    active: 12,
    delivered: 125,
    rejected: 13
  }
}

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    acceptOrder: (state, action) => {
      const order = state.orders.find(order => order.id === action.payload)
      if (order) {
        order.status = 'accepted'
      }
    },
    rejectOrder: (state, action) => {
      const order = state.orders.find(order => order.id === action.payload)
      if (order) {
        order.status = 'rejected'
        order.paymentStatus = 'refunded'
      }
    },
    deliverOrder: (state, action) => {
      const order = state.orders.find(order => order.id === action.payload)
      if (order) {
        order.status = 'delivered'
      }
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload)
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload
      const order = state.orders.find(order => order.id === orderId)
      if (order) {
        order.status = status
        if (status === 'rejected') {
          order.paymentStatus = 'refunded'
        }
      }
    }
  }
})

export const { acceptOrder, rejectOrder, deliverOrder, addOrder, updateOrderStatus } = orderSlice.actions
export default orderSlice.reducer