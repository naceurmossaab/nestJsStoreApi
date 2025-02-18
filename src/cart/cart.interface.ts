import { Product } from "../products/products.entity";
import { User } from "../users/users.entity";
import { Cart } from "./cart.entity";

export interface ICartService {
  createCart(user: User): Promise<Cart>;
  getCart(user: User): Promise<Cart>;
  addToCart(cart: Cart, product: Product, quantity: number): Promise<Cart>;
  removeFromCart(user: User, productId: number): Promise<Cart>;
  clearCart(cart: Cart): Promise<void>;
}

