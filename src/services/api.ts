import axios from 'axios';
import { DataResponse } from '../types';
import { mockData } from '../mockServer';

const API_URL = 'http://localhost:3000/api'; // Updated to match the development server port

export const fetchData = async (page = 1, pageSize = 10): Promise<DataResponse> => {
  try {
    console.log(`Fetching data from ${API_URL}/data with page=${page} and pageSize=${pageSize}`);
    
    const response = await axios.get(`${API_URL}/data`, {
      params: {
        page,
        pageSize,
      },
    });
    
    console.log('API response:', response.data);
    
    // Validate response data
    if (!response.data || !Array.isArray(response.data.items)) {
      console.warn('Invalid response format, using fallback data');
      return createMockResponse(page, pageSize);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }
    
    return createMockResponse(page, pageSize);
  }
};

// Helper function to create a mock response
function createMockResponse(page: number, pageSize: number): DataResponse {
  console.log('Creating mock response with imported mockData');
  
  // Use the imported mockData if available, otherwise create new mock data
  const dataSource = Array.isArray(mockData) && mockData.length > 0 
    ? mockData 
    : Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Mock Item ${i + 1}`,
        description: `This is a mock description for item ${i + 1}`,
        category: ['Analytics', 'Database', 'Visualization'][i % 3],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = dataSource.slice(startIndex, endIndex);
  
  return {
    items: paginatedItems,
    total: dataSource.length,
    page,
    pageSize,
  };
} 