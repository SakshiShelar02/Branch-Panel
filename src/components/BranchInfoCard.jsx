import React from 'react';
import { useSelector } from 'react-redux';

const BranchInfoCard = () => {
  const { branchInfo } = useSelector((state) => state.branch);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Branch Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Branch Name</label>
            <p className="text-lg text-gray-900">{branchInfo.name}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Location</label>
            <p className="text-lg text-gray-900">{branchInfo.location}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Admin Name</label>
            <p className="text-lg text-gray-900">{branchInfo.adminName}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Contact</label>
            <p className="text-lg text-gray-900">{branchInfo.contact}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg text-gray-900">{branchInfo.email}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Total Staff</label>
            <p className="text-lg text-gray-900">{branchInfo.totalStaff} members</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Established Year</label>
            <p className="text-lg text-gray-900">{branchInfo.establishedYear}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Deliverable Areas</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {branchInfo.deliverableAreas.map((area, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchInfoCard;