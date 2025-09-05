import { AppDataSource } from "../../database/data-source";
import { OrderItem } from "../../entities/OrdemItem";
import { Order, OrderStatus } from "../../entities/Order";
import { Product } from "../../entities/Product";
import { User } from "../../entities/User";
import { AppError } from "../../shared/AppError";

type CreateOrderPayload = {
  userId: string;
  items: { productId: string; quantity: number }[];
};

type ListOrdersPayload = {
  user: { id: string; role: string };
  status?: OrderStatus;
};

const orderRepository = AppDataSource.getRepository(Order);

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  const { userId, items } = payload;

  return AppDataSource.transaction(async (transactionalEntityManager) => {
    const user = await transactionalEntityManager.findOneBy(User, {
      id: userId,
    });
    if (!user) throw new AppError("User not found", 404);

    const newOrder = transactionalEntityManager.create(Order, {
      user,
      items: [],
    });

    for (const item of items) {
      const product = await transactionalEntityManager.findOneBy(Product, {
        id: item.productId,
      });

      if (!product) {
        throw new AppError(`Product with ID ${item.productId} not found`, 404);
      }
      if (product.stock < item.quantity) {
        throw new AppError(
          `Not enough stock for product: ${product.name}`,
          400
        );
      }

      product.stock -= item.quantity;
      await transactionalEntityManager.save(product);

      const orderItem = transactionalEntityManager.create(OrderItem, {
        product,
        quantity: item.quantity,
        price: product.price,
      });
      newOrder.items.push(orderItem);
    }

    return await transactionalEntityManager.save(newOrder);
  });
};

export const listOrders = async (
  payload: ListOrdersPayload
): Promise<Order[]> => {
  const { user, status } = payload;

  const queryOptions: any = {
    relations: ["user", "items", "items.product"],
    order: { createdAt: "DESC" },
    where: {},
  };

  if (user.role === "admin") {
    if (status) {
      queryOptions.where.status = status;
    }
  } else {
    queryOptions.where.user = { id: user.id };
  }

  return orderRepository.find(queryOptions);
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<Order> => {
  const order = await orderRepository.findOneBy({ id: orderId });
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  order.status = status;
  await orderRepository.save(order);
  return order;
};
