import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
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
    console.log('🍽️ CREATE PRODUCT - DTO recebido:', JSON.stringify(createProductDto, null, 2));

    // Normalizar nome: remover espaços no início e fim
    createProductDto.name = createProductDto.name.trim();
    console.log('📝 Nome normalizado:', createProductDto.name);

    // Validar que o restaurante existe
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: createProductDto.restaurant_id },
    });

    if (!restaurant) {
      console.error('❌ Restaurante não encontrado:', createProductDto.restaurant_id);
      throw new NotFoundException('Restaurante não encontrado');
    }
    console.log('✅ Restaurante encontrado:', restaurant.id, restaurant.name);

    // Regra 13: Produtos não podem ter o mesmo nome (dentro do restaurante)
    const existing = await this.productRepository.findOne({
      where: {
        name: createProductDto.name,
        restaurant: { id: createProductDto.restaurant_id },
      },
    });

    if (existing) {
      console.error('❌ Produto com nome duplicado:', createProductDto.name);
      throw new ConflictException(
        'Produto com este nome já existe neste restaurante',
      );
    }
    console.log('✅ Nome do produto único');

    // Regra 14: Não pode cadastrar produto por menos de R$ 10,00
    console.log('💰 Validando preço mínimo. Preço:', createProductDto.price);
    if (createProductDto.price < 10) {
      console.error('❌ Preço abaixo do mínimo:', createProductDto.price);
      throw new BadRequestException(
        'O preço mínimo do produto é R$ 10,00',
      );
    }
    console.log('✅ Preço válido');

    // Regra 15: Máximo de 3 cadastros de produtos por restaurante por dia
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const productsCreatedToday = await this.productRepository
      .createQueryBuilder('product')
      .where('product.restaurant_id = :restaurantId', { restaurantId: restaurant.id })
      .andWhere('product.created_at >= :today', { today })
      .andWhere('product.created_at < :tomorrow', { tomorrow })
      .getCount();

    console.log('📅 Produtos criados hoje neste restaurante:', productsCreatedToday, '/ 3');
    if (productsCreatedToday >= 3) {
      console.error('❌ Limite de 3 produtos por dia atingido');
      throw new BadRequestException(
        'Você atingiu o limite de 3 cadastros de produtos por dia para este restaurante. Tente novamente amanhã.',
      );
    }
    console.log('✅ Limite de cadastros diário OK');

    const product = this.productRepository.create({
      ...createProductDto,
      restaurant,
    });
    
    const savedProduct = await this.productRepository.save(product);
    console.log('✅ Produto criado com sucesso:', savedProduct.id, savedProduct.name);
    return savedProduct;
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

    // Normalizar nome se fornecido
    if (updateProductDto.name) {
      updateProductDto.name = updateProductDto.name.trim();
    }

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
