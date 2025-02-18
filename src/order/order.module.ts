import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { Services } from '../utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), UsersModule, ProductsModule],
  controllers: [OrderController],
  providers: [{ provide: Services.ORDER, useClass: OrderService }],
})
export class OrderModule { }
