export interface DataItem {
  id: number;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface DataResponse {
  items: DataItem[];
  total: number;
  page: number;
  pageSize: number;
} 