import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

const routes: Routes = [
  { path: 'auth', module: AuthModule },
  { path: 'users', module: UsersModule },
];

@Module({
  imports: [
    RouterModule.register([]),
    AuthModule,
    UsersModule
  ]
})

export class AppRoutingModule { }