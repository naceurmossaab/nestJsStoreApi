import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { CartItem } from './cart-items.entity';


@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];
}
