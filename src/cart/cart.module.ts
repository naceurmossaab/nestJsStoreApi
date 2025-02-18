import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { ProductsModule } from '../products/products.module';
import { CartItem } from './cart-items.entity';
import { Services } from '../utils/constants';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), ProductsModule, UsersModule],
  controllers: [CartController],
  providers: [{ provide: Services.CART, useClass: CartService }],
})
export class CartModule { }
