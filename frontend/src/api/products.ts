import { api } from "./axios";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  name?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
}

export type CreateProductPayload = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
>;

export const getProducts = async (
  params: GetProductsParams = {}
): Promise<PaginatedResponse<Product>> => {
  const { data } = await api.get<PaginatedResponse<Product>>("/products", {
    params: {
      page: 1,
      limit: 10,
      ...params,
    },
  });
  return data;
};

export const createProduct = async (
  productData: CreateProductPayload
): Promise<Product> => {
  const { data } = await api.post<Product>("/products", productData);
  return data;
};
