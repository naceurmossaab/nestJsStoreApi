import { Product } from "../products/products.entity"
import { User } from "../users/users.entity"
import { OrderStatus } from "../utils/constants";
import { OrderItem } from "./order-item.entity";
import { Order } from "./order.entity";

export interface IOrderService {
  createOrder(user: User): Promise<Order>;
  placeOrder(order: Order, product: Product, item: { quantity: number }): Promise<OrderItem>;
  updateOrderStatus(order: Order, status: OrderStatus): Promise<Order>;
  getUserOrders(userId: number): Promise<Order[]>;
  getOrderDetails(orderId: number): Promise<Order | null>;
}
