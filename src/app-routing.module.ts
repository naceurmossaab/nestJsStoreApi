import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

const routes: Routes = [
  // { path: 'auth', module: 'AuthModule' },
  // { path: 'users', module: 'UsersModule' },
];

@Module({
  imports: [
    RouterModule.register([])
  ]
})

export class AppRoutingModule { }