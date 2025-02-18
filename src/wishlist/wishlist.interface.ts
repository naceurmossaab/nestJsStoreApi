import { Product } from "../products/products.entity";
import { User } from "../users/users.entity";
import { Wishlist } from "./wishlist.entity";

export interface IWishlistService {
  addToWishlist(user: User, product: Product): Promise<any>;
  getWishlistProduct(user: User, product: Product): Promise<any>;
  getWishlist(userId: number): Promise<any>;
  removeFromWishlist(wishlist: Wishlist): Promise<any>;
}
