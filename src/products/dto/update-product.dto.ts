import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./create-product.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  price: number;

  @ApiPropertyOptional()
  category: string;

  @ApiPropertyOptional()
  stock: number;

  @ApiPropertyOptional()
  description: string;
}
