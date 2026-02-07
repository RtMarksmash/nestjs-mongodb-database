import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, QueryFilter } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Product } from './../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';
import { FilterProductsDto } from '../dtos/products.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly modelProducts: Model<Product>,
  ) {}
  private counterId = 1;

  findAll(params?: FilterProductsDto) {
    if (params) {
      const filters: QueryFilter<Product> = {};
      const { limit, offset, minPrice, maxPrice } = params;
      if ((minPrice && maxPrice) || (offset && limit)) {
        filters.price = { $gte: minPrice, $lte: maxPrice };
      }
      return this.modelProducts.find().limit(limit).skip(offset).exec();
    }
    return this.modelProducts.find().exec();
  }

  async findOne(id: string) {
    const product = await this.modelProducts.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  create(data: CreateProductDto) {
    const newProduct = new this.modelProducts(data);
    return newProduct.save();
  }

  update(id: string, changes: UpdateProductDto) {
    const product = this.modelProducts
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  remove(id: string) {
    return this.modelProducts.findByIdAndDelete(id).exec();
  }
}
