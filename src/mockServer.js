const { createServer, Model } = require('miragejs');

// Generate random data
function generateMockData(count) {
  const data = [];
  const categories = ['Analytics', 'Database', 'Visualization', 'Report', 'Dashboard'];
  
  for (let i = 1; i <= count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    data.push({
      id: i,
      name: `Item ${i}`,
      description: `This is a description for item ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      createdAt: date.toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  return data;
}

// Create a simple mock data array for direct use if MirageJS fails
export const mockData = generateMockData(100);

export function startMockServer() {
  try {
    console.log('Starting mock server...');
    
    return createServer({
      models: {
        datum: Model,
      },
      
      seeds(server) {
        try {
          console.log('Seeding mock data...');
          const mockData = generateMockData(100);
          mockData.forEach(item => {
            server.create('datum', item);
          });
          console.log('Successfully seeded mock data');
        } catch (error) {
          console.error('Error seeding mock data:', error);
        }
      },
      
      routes() {
        this.namespace = 'api';
        
        this.get('/data', (schema, request) => {
          try {
            console.log('Mirage: Received request for /api/data');
            
            const { page = 1, pageSize = 10 } = request.queryParams;
            const pageNum = parseInt(page, 10);
            const pageSizeNum = parseInt(pageSize, 10);
            
            // If schema.datum is undefined, use the mockData directly
            let items = [];
            let total = 0;
            
            try {
              const allItems = schema.datum.all();
              if (allItems && allItems.models) {
                items = allItems.models;
                total = items.length;
              }
            } catch (error) {
              console.error('Error accessing schema.datum:', error);
              // Fallback to direct mockData
              items = mockData;
              total = mockData.length;
            }
            
            if (items.length === 0) {
              console.log('No items found, using fallback data');
              items = mockData;
              total = mockData.length;
            }
            
            const startIndex = (pageNum - 1) * pageSizeNum;
            const endIndex = startIndex + pageSizeNum;
            const paginatedItems = items.slice(startIndex, endIndex);
            
            console.log(`Mirage: Returning ${paginatedItems.length} items for page ${pageNum}`);
            
            return {
              items: paginatedItems,
              total: total,
              page: pageNum,
              pageSize: pageSizeNum,
            };
          } catch (error) {
            console.error('Mirage: Error in /api/data route handler:', error);
            
            // Return fallback data on error
            const { page = 1, pageSize = 10 } = request.queryParams;
            const pageNum = parseInt(page, 10);
            const pageSizeNum = parseInt(pageSize, 10);
            
            const startIndex = (pageNum - 1) * pageSizeNum;
            const endIndex = startIndex + pageSizeNum;
            const paginatedItems = mockData.slice(startIndex, endIndex);
            
            return {
              items: paginatedItems,
              total: mockData.length,
              page: pageNum,
              pageSize: pageSizeNum,
            };
          }
        });
        
        // Add a passthrough for all other requests
        this.passthrough();
      },
    });
  } catch (error) {
    console.error('Error starting mock server:', error);
    return null;
  }
} 