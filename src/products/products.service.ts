import { Injectable } from '@nestjs/common';
import { IProductService } from './products.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService implements IProductService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) { }

  create(createProductDto: CreateProductDto) {
    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  async findAll(query: any): Promise<Product[]> {
    const { name, category, minPrice, maxPrice, stock } = query;
    const qb = this.productRepository.createQueryBuilder('product');

    if (name) qb.andWhere('product.name LIKE :name', { name: `%${name}%` });
    if (category) qb.andWhere('product.category = :category', { category });
    if (minPrice) qb.andWhere('product.price >= :minPrice', { minPrice: Number(minPrice) });
    if (maxPrice) qb.andWhere('product.price <= :maxPrice', { maxPrice: Number(maxPrice) });
    if (stock) qb.andWhere('product.stock >= :stock', { stock: Number(stock) });

    return qb.getMany();
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
