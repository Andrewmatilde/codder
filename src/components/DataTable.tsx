import React from 'react';
import { DataItem } from '../types';

interface DataTableProps {
  data: DataItem[];
  loading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ data = [], loading }) => {
  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];
  
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (safeData.length === 0) {
    return (
      <div className="empty-state">
        No data available
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {safeData.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
              <td>{new Date(item.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 