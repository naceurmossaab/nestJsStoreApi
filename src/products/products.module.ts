import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { Services } from '../utils/constants';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), NotificationsModule],
  controllers: [ProductsController],
  providers: [{ provide: Services.PRODUCTS, useClass: ProductsService }],
  exports: [{ provide: Services.PRODUCTS, useClass: ProductsService }],
})
export class ProductsModule { }
