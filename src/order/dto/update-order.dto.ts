import { IsEnum } from 'class-validator';
import { OrderStatus } from '../../utils/constants';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, { message: 'Status must be a valid OrderStatus value' })
  status: OrderStatus;
}
