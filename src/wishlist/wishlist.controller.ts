import { Controller, Post, Delete, Get, Param, Inject, HttpException, HttpStatus, UseFilters, UseGuards } from '@nestjs/common';
import { Role, Services } from '../utils/constants';
import { IUserService } from '../users/users.interface';
import { IProductService } from '../products/products.interface';
import { IWishlistService } from './wishlist.interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from '../utils/http-exception.filter';

@ApiTags()
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@UseFilters(new HttpExceptionFilter())
@Controller()
export class WishlistController {
  constructor(
    @Inject(Services.WISHLIST) private readonly wishlistService: IWishlistService,
    @Inject(Services.USERS) private readonly userService: IUserService,
    @Inject(Services.PRODUCTS) private readonly productService: IProductService
  ) { }

  @Post(':userId/:productId')
  async addToWishlist(@Param('userId') userId: number, @Param('productId') productId: number) {
    const user = await this.userService.findOne(userId);
    const product = await this.productService.findOne(productId);
    if (!user || !product) throw new HttpException('User or Product not found', HttpStatus.NOT_FOUND);

    const existingWishlist = await this.wishlistService.getWishlistProduct(user, product);
    if (existingWishlist) throw new HttpException('Product already in wishlist', HttpStatus.FORBIDDEN);

    return this.wishlistService.addToWishlist(user, product);
  }

  @Get(':userId')
  async getWishlist(@Param('userId') userId: number) {
    return this.wishlistService.getWishlist(userId);
  }

  @Delete(':userId/:productId')
  async removeFromWishlist(@Param('userId') userId: number, @Param('productId') productId: number) {
    const user = await this.userService.findOne(userId);
    const product = await this.productService.findOne(productId);
    if (!user || !product) throw new HttpException('User or Product not found', HttpStatus.NOT_FOUND);

    const wishlist = await this.wishlistService.getWishlistProduct(user, product);
    if (!wishlist) throw new HttpException('Product is not in wishlist', HttpStatus.NOT_FOUND);

    return this.wishlistService.removeFromWishlist(wishlist);
  }
}
