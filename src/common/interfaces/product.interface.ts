export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  storeId: number;
  createdAt: Date;
  updatedAt: Date;
}
