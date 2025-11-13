import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    // Validar nome único
    const existing = await this.restaurantRepository.findOne({
      where: { name: createRestaurantDto.name },
    });

    if (existing) {
      throw new ConflictException('Restaurante com este nome já existe');
    }

    const restaurant = this.restaurantRepository.create(createRestaurantDto);
    return this.restaurantRepository.save(restaurant);
  }

  async findAll(): Promise<Restaurant[]> {
    // Listar apenas restaurantes ativos
    return this.restaurantRepository.find({
      where: { isActive: true },
      relations: ['products'],
      order: { rating: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurante não encontrado');
    }

    return restaurant;
  }

  async update(
    id: number,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    // Se alterar nome, validar unicidade
    if (
      updateRestaurantDto.name &&
      updateRestaurantDto.name !== restaurant.name
    ) {
      const existing = await this.restaurantRepository.findOne({
        where: { name: updateRestaurantDto.name },
      });

      if (existing) {
        throw new ConflictException('Restaurante com este nome já existe');
      }
    }

    Object.assign(restaurant, updateRestaurantDto);
    return this.restaurantRepository.save(restaurant);
  }

  async remove(id: number): Promise<void> {
    const restaurant = await this.findOne(id);
    await this.restaurantRepository.remove(restaurant);
  }
}
