import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { User } from '../users/users.entity';
import { Product } from '../products/products.entity';
import { IOrderService } from './order.interface';
import { OrderStatus } from '../utils/constants';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>
  ) { }

  async createOrder(user: User): Promise<Order> {
    const order = this.orderRepository.create({ user, items: [] });
    return await this.orderRepository.save(order);
  }

  async placeOrder(order: Order, product: Product, item: { quantity: number }): Promise<OrderItem> {
    const orderItem = this.orderItemRepository.create({
      order,
      product,
      quantity: item.quantity,
      price: product.price * item.quantity,
    });

    return await this.orderItemRepository.save(orderItem);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
  }

  async getOrderDetails(orderId: number): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'user'],
    });
  }

  async updateOrderStatus(order: Order, status: OrderStatus): Promise<Order> {
    order.status = status;
    return await this.orderRepository.save(order);
  }

}
