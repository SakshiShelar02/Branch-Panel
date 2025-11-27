import { createSlice } from '@reduxjs/toolkit';

const branchSlice = createSlice({
  name: 'branch',
  initialState: {
    branchInfo: {
      name: 'Downtown Branch',
      location: '123 Main Street, City Center',
      adminName: 'Robert Brown',
      contact: '+1 (555) 123-4567',
      email: 'robert.brown@restaurant.com',
      totalStaff: 15,
      establishedYear: 2018,
      deliverableAreas: ['City Center', 'East Side', 'West Park', 'North Hills']
    },
    stats: {
      activeOrders: 12,
      delivered: 45,
      rejected: 3,
      totalOrders: 60
    }
  },
  reducers: {
    updateBranchInfo: (state, action) => {
      state.branchInfo = { ...state.branchInfo, ...action.payload };
    }
  },
});

export const { updateBranchInfo } = branchSlice.actions;
export default branchSlice.reducer;