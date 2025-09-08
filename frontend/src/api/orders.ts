import { api } from "./axios";
import type { Product } from "./products";

// Define a estrutura da resposta paginada que esperamos do backend.
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Define a estrutura de um item dentro de um pedido.
interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: Product;
}

// Define a estrutura de um Pedido (Order).
export interface Order {
  id: string;
  status: 'placed' | 'paid' | 'shipped' | 'cancelled';
  createdAt: string;
  items: OrderItem[];
  user?: { id: string; name: string; email: string; }; // `user` é opcional, pois só virá para admins
}

// Parâmetros que a nossa função de busca de pedidos pode aceitar.
interface GetOrdersParams {
  page?: number;
  limit?: number;
}

// Função para buscar os pedidos. O backend irá filtrar automaticamente com base no utilizador.
export const getOrders = async (params: GetOrdersParams = {}): Promise<PaginatedResponse<Order>> => {
  const { data } = await api.get<PaginatedResponse<Order>>('/orders', { params });
  return data;
}

// Função para atualizar o status de um pedido (ação de administrador).
export const updateOrderStatus = async ({ orderId, status }: { orderId: string, status: string }): Promise<Order> => {
  const { data } = await api.patch<Order>(`/orders/${orderId}/status`, { status });
  return data;
}

