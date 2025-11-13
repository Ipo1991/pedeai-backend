import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
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
    // Validar que o restaurante existe
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: createProductDto.restaurant_id },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurante não encontrado');
    }

    // Validar nome único dentro do restaurante
    const existing = await this.productRepository.findOne({
      where: {
        name: createProductDto.name,
        restaurant: { id: createProductDto.restaurant_id },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Produto com este nome já existe neste restaurante',
      );
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
    // Listar apenas produtos disponíveis
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

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Se alterar nome, validar unicidade dentro do restaurante
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const existing = await this.productRepository.findOne({
        where: {
          name: updateProductDto.name,
          restaurant: { id: product.restaurant.id },
        },
      });

      if (existing) {
        throw new ConflictException(
          'Produto com este nome já existe neste restaurante',
        );
      }
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
