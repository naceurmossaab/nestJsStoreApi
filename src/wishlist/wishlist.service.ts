import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { IWishlistService } from './wishlist.interface';
import { User } from '../users/users.entity';
import { Product } from '../products/products.entity';

@Injectable()
export class WishlistService implements IWishlistService {
  constructor(@InjectRepository(Wishlist) private wishlistRepository: Repository<Wishlist>) { }

  async addToWishlist(user: User, product: Product) {
    const wishlist = this.wishlistRepository.create({ user, product });
    return this.wishlistRepository.save(wishlist);
  }

  async getWishlistProduct(user: User, product: Product) {
    return await this.wishlistRepository.findOne({ where: { user, product } });
  }

  async getWishlist(userId: number) {
    return this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async removeFromWishlist(wishlist: Wishlist) {
    return await this.wishlistRepository.remove(wishlist);
  }
}
