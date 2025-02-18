import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-items.entity';
import { ICartService } from './cart.interface';
import { User } from '../users/users.entity';
import { Product } from '../products/products.entity';

@Injectable()
export class CartService implements ICartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>
  ) { }

  async createCart(user: User): Promise<Cart> {
    const cart = this.cartRepository.create({ user, items: [] });
    await this.cartRepository.save(cart);
    return cart;
  }

  async getCart(user: User): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ where: { user }, relations: ['items', 'items.product'] });
    if (!cart) return await this.createCart(user);
    return cart;
  }

  async addToCart(cart: Cart, product: Product, quantity: number): Promise<Cart> {
    let cartItem = await this.cartItemRepository.findOne({ where: { cart, product } });
    if (cartItem) cartItem.quantity += quantity;
    else cartItem = this.cartItemRepository.create({ cart, product, quantity });
    await this.cartItemRepository.save(cartItem);
    return this.getCart(cart.user);
  }

  async removeFromCart(user: User, productId: number): Promise<Cart> {
    const cart = await this.getCart(user);
    const cartItem = await this.cartItemRepository.findOne({ where: { cart, product: { id: productId } } });
    if (!cartItem) throw new HttpException('Item not found in cart', HttpStatus.NOT_FOUND);
    await this.cartItemRepository.remove(cartItem);
    return this.getCart(user);
  }

  async clearCart(cart: Cart): Promise<void> {
    await this.cartItemRepository.delete({ cart });
  }
}
