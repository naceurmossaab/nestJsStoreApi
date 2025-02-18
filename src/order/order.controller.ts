import { Controller, Post, Get, Param, Body, Inject, Req, HttpException, HttpStatus, UseFilters, UseGuards } from '@nestjs/common';
import { Services } from '../utils/constants';
import { IUserService } from '../users/users.interface';
import { IProductService } from '../products/products.interface';
import { IOrderService } from './order.interface';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from '../utils/http-exception.filter';

@ApiTags()
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@UseFilters(new HttpExceptionFilter())
@Controller()
export class OrderController {
  constructor(
    @Inject(Services.ORDER) private readonly orderService: IOrderService,
    @Inject(Services.USERS) private readonly userService: IUserService,
    @Inject(Services.PRODUCTS) private readonly productService: IProductService,
  ) { }

  @Post()
  async placeOrder(@Req() req, @Body('cartItems') cartItems: CreateOrderItemDto[]) {
    const user = await this.userService.findOne(req.user.id);
    const order = await this.orderService.createOrder(user!);

    let totalPrice = 0;
    for (const item of cartItems) {
      const product = await this.productService.findOne(item.productId);
      if (!product) throw new HttpException(`Product with ID ${item.productId} not found`, HttpStatus.NOT_FOUND);

      const orderItem = await this.orderService.placeOrder(order, product, item);
      totalPrice += orderItem.price;
    }

    return { message: 'Order placed successfully', orderId: order.id, total: totalPrice };
  }

  @Get('user/:userId')
  async getUserOrders(@Param('userId') userId: number) {
    return this.orderService.getUserOrders(userId);
  }

  @Get(':orderId')
  async getOrderDetails(@Param('orderId') orderId: number) {
    return this.orderService.getOrderDetails(orderId);
  }
}
