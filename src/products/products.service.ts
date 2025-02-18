import { Injectable } from '@nestjs/common';
import { IProductService } from './products.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ProductsService implements IProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly notificationsGateway: NotificationsGateway
  ) { }

  create(createProductDto: CreateProductDto) {
    const newProduct = this.productRepository.create(createProductDto);
    this.notificationsGateway.sendNotification('product_created', { message: `New product added: ${newProduct.name}` });
    return this.productRepository.save(newProduct);
  }

  async findAll(query: any): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const { name, category, minPrice, maxPrice, stock, page = 1, limit = 10 } = query;
    const qb = this.productRepository.createQueryBuilder('product');

    if (name) qb.andWhere('product.name LIKE :name', { name: `%${name}%` });
    if (category) qb.andWhere('product.category = :category', { category });
    if (minPrice) qb.andWhere('product.price >= :minPrice', { minPrice: Number(minPrice) });
    if (maxPrice) qb.andWhere('product.price <= :maxPrice', { maxPrice: Number(maxPrice) });
    if (stock) qb.andWhere('product.stock >= :stock', { stock: Number(stock) });

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total, page: Number(page), limit: Number(limit) };
  }

  findOne(id: number) {
    return this.productRepository.findOne({ where: { id } });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    this.notificationsGateway.sendNotification('product_updated', { message: `Product updated: ${updateProductDto.name}` });
    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    this.notificationsGateway.sendNotification('product_deleted', { message: `Product deleted: ${product?.name}` });
    return this.productRepository.delete(id);
  }

  async checkStock(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (product!.stock < 5) {
      this.notificationsGateway.sendNotification('low_stock', { message: `Low stock: ${product!.name} (Only ${product!.stock} left)` });
    }
  }
}
