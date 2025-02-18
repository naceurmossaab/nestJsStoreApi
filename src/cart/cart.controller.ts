import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards, UseFilters, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../utils/http-exception.filter';
import { Services } from '../utils/constants';
import { ICartService } from './cart.interface';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { IUserService } from '../users/users.interface';
import { IProductService } from '../products/products.interface';

@ApiTags()
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@UseFilters(new HttpExceptionFilter())
@Controller()
export class CartController {
  constructor(
    @Inject(Services.CART) private readonly cartService: ICartService,
    @Inject(Services.USERS) private readonly usersService: IUserService,
    @Inject(Services.PRODUCTS) private readonly productsService: IProductService,

  ) { }

  @Get()
  async getCart(@Req() req): Promise<any> {
    const user = await this.usersService.findOne(req.user.id);
    return await this.cartService.getCart(user!);
  }

  @Post('add')
  async addToCart(@Req() req, @Body() addToCartDto: AddToCartDto): Promise<any> {
    const quantity = addToCartDto.quantity || 1;
    const cart = await this.cartService.getCart(req.user.id);
    const product = await this.productsService.findOne(addToCartDto.productId);
    if (!product) throw new HttpException(`no product with id: ${addToCartDto.productId}`, HttpStatus.BAD_REQUEST);
    return this.cartService.addToCart(cart!, product, quantity);
  }

  @Delete('remove/:productId')
  removeFromCart(@Req() req, @Param('productId') productId: number): Promise<any> {
    return this.cartService.removeFromCart(req.user.id, productId);
  }

  @Delete('clear')
  async clearCart(@Req() req): Promise<void> {
    const cart = await this.cartService.getCart(req.user.id);
    return await this.cartService.clearCart(cart);
  }
}
