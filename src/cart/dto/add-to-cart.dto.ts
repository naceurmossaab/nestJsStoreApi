import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AddToCartDto {
  @ApiProperty()
  @IsNotEmpty()
  productId: number;
  
  @ApiProperty()
  @IsNotEmpty()
  quantity: number;
}