import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { Services } from '../utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), ProductsModule, UsersModule],
  controllers: [WishlistController],
  providers: [{ provide: Services.WISHLIST, useClass: WishlistService }],
  exports: [{ provide: Services.WISHLIST, useClass: WishlistService }],
})
export class WishlistModule { }
