import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Regra 9: Produto deve pertencer a restaurante existente
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: createProductDto.restaurant_id },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurante não encontrado');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      restaurant,
    });

    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['restaurant'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByRestaurant(restaurantId: number): Promise<Product[]> {
    // Regra 10: Listar apenas produtos disponíveis por padrão
    return this.productRepository.find({
      where: { restaurant: { id: restaurantId }, isAvailable: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Regra 11: Validar restaurante se alterado
    if (updateProductDto.restaurant_id) {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id: updateProductDto.restaurant_id },
      });

      if (!restaurant) {
        throw new NotFoundException('Restaurante não encontrado');
      }

      product.restaurant = restaurant;
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
