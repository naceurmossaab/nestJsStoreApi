import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';

const routes: Routes = [
  { path: 'auth', module: AuthModule },
  { path: 'users', module: UsersModule },
  { path: 'products', module: ProductsModule },
  { path: 'cart', module: CartModule },
];

@Module({
  imports: [RouterModule.register(routes)]
})

export class AppRoutingModule { }