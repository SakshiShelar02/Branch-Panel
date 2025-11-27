import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBranchInfo } from '../redux/slices/branchSlice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const BranchAdminInfo = () => {
  const { branchInfo } = useSelector((state) => state.branch);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({ ...branchInfo });
  const pageRef = useRef();

  // Handlers
  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo({ ...branchInfo });
  };

  const handleSave = () => {
    dispatch(updateBranchInfo(editedInfo));
    setIsEditing(false);
    alert('Branch information updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo({ ...branchInfo });
  };

  const handleChange = (field, value) => {
    setEditedInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      alert('Branch information refreshed!');
    }, 1500);
  };

  const handleExport = async () => {
    const element = pageRef.current;
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
      pdf.text('Branch Information Report', pdfWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
      pdf.text(`Branch: ${branchInfo.name}`, 20, 45);
      
      const imgWidth = pdfWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 20, 60, imgWidth, imgHeight);
      pdf.save(`branch-info-${branchInfo.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Data
  const staffMembers = [
    { id: 1, name: 'John Smith', role: 'Manager', email: 'john.smith@restaurant.com', status: 'Active' },
    { id: 2, name: 'Sarah Johnson', role: 'Assistant Manager', email: 'sarah.j@restaurant.com', status: 'Active' },
    { id: 3, name: 'Mike Chen', role: 'Head Chef', email: 'mike.chen@restaurant.com', status: 'Active' },
    { id: 4, name: 'Emily Davis', role: 'Cashier', email: 'emily.d@restaurant.com', status: 'On Leave' },
  ];

  const equipment = [
    { name: 'POS Systems', count: 3, status: 'Operational', lastMaintenance: '2024-01-10' },
    { name: 'Delivery Vehicles', count: 2, status: 'Operational', lastMaintenance: '2024-01-15' },
    { name: 'Kitchen Equipment', count: 15, status: 'Needs Check', lastMaintenance: '2023-12-20' },
  ];

  const operatingHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 10:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 11:00 PM' },
    { day: 'Sunday', hours: '10:00 AM - 9:00 PM' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      case 'Operational': return 'bg-green-100 text-green-800';
      case 'Needs Check': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" ref={pageRef}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            {/* <h1 className="text-2xl font-bold text-gray-900">Branch Information</h1>
            <p className="text-gray-600">Manage your branch details</p> */}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isRefreshing ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                  <path d="M8 16H3v5"></path>
                </svg>
              )}
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button 
              onClick={handleExport}
              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center gap-1 text-xs transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15V3"></path>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <path d="m7 10 5 5 5-5"></path>
              </svg>
              Export PDF
            </button>

            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField 
                label="Branch Name"
                value={isEditing ? editedInfo.name : branchInfo.name}
                editing={isEditing}
                onChange={(value) => handleChange('name', value)}
              />
              
              <InfoField 
                label="Established Year"
                value={isEditing ? editedInfo.establishedYear : branchInfo.establishedYear}
                editing={isEditing}
                onChange={(value) => handleChange('establishedYear', value)}
                type="number"
              />
              
              <div className="md:col-span-2">
                <InfoField 
                  label="Location"
                  value={isEditing ? editedInfo.location : branchInfo.location}
                  editing={isEditing}
                  onChange={(value) => handleChange('location', value)}
                  type="textarea"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField 
                label="Admin Name"
                value={isEditing ? editedInfo.adminName : branchInfo.adminName}
                editing={isEditing}
                onChange={(value) => handleChange('adminName', value)}
              />
              
              <InfoField 
                label="Contact Number"
                value={isEditing ? editedInfo.contact : branchInfo.contact}
                editing={isEditing}
                onChange={(value) => handleChange('contact', value)}
                type="tel"
              />
              
              <div className="md:col-span-2">
                <InfoField 
                  label="Email Address"
                  value={isEditing ? editedInfo.email : branchInfo.email}
                  editing={isEditing}
                  onChange={(value) => handleChange('email', value)}
                  type="email"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Staff Summary */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Staff Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Staff</span>
                <span className="font-medium text-gray-900">{branchInfo.totalStaff} members</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active</span>
                <span className="font-medium text-green-600">14 members</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">On Leave</span>
                <span className="font-medium text-yellow-600">1 member</span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Operating Hours</h2>
            <div className="space-y-3">
              {operatingHours.map((schedule, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{schedule.day}</span>
                  <span className="font-medium text-gray-900">{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Areas */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Service Areas</h2>
            <div>
              <label className="block text-gray-600 mb-2">
                Deliverable Areas ({branchInfo.deliverableAreas.length} areas)
              </label>
              {isEditing ? (
                <textarea
                  value={editedInfo.deliverableAreas.join(', ')}
                  onChange={(e) => handleChange('deliverableAreas', e.target.value.split(', '))}
                  rows="3"
                  placeholder="Enter areas separated by commas"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {branchInfo.deliverableAreas.map((area, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm border border-blue-200"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Staff Members */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Staff Members</h2>
          <div className="space-y-3">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-medium">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{staff.name}</div>
                    <div className="text-sm text-gray-500">{staff.role}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(staff.status)}`}>
                  {staff.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Equipment Status</h2>
          <div className="space-y-3">
            {equipment.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.count} units</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(item.status).replace('100', '600').replace('800', '600')}`}>
                    {item.status}
                  </div>
                  <div className="text-xs text-gray-500">Maintained: {item.lastMaintenance}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple InfoField Component
const InfoField = ({ label, value, editing, onChange, type = 'text' }) => {
  if (editing) {
    if (type === 'textarea') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      );
    }
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <p className="p-2 text-gray-900 bg-gray-50 rounded border border-gray-300">{value}</p>
    </div>
  );
};

export default BranchAdminInfo;