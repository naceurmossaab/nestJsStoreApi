import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./products.entity";

export interface IProductService {
  create(createProductDto: CreateProductDto): Promise<Product>;
  findAll(query: any): Promise<{ data: Product[]; total: number; page: number; limit: number }>;
  findOne(id: number): Promise<Product | null>;
  update(id: number, updateProductDto: UpdateProductDto): Promise<any>;
  remove(id: number): Promise<any>;
}
