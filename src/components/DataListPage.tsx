import React, { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import { DataItem } from '../types';
import DataTable from './DataTable';
import Pagination from './Pagination';

const DataListPage: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      console.log('DataListPage: Loading data for page', page);
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetchData(page, pageSize);
        console.log('DataListPage: Data loaded successfully', response);
        
        const items = Array.isArray(response.items) ? response.items : [];
        setData(items);
        setTotalItems(response.total || 0);
      } catch (error) {
        console.error('DataListPage: Error loading data:', error);
        setError('Failed to load data. Please try again later.');
        setData([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, pageSize]);

  const handlePageChange = (newPage: number) => {
    console.log('DataListPage: Changing page to', newPage);
    setPage(newPage);
  };

  const dataLength = Array.isArray(data) ? data.length : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  console.log('DataListPage: Rendering with', dataLength, 'items, page', page, 'of', totalPages);

  return (
    <div className="container main-content">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Data List</h1>
          <p className="card-subtitle">
            A list of all data items from the database.
          </p>
        </div>
        <div className="card-body">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <DataTable data={data || []} loading={loading} />
          {!loading && !error && totalPages > 0 && (
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataListPage; 