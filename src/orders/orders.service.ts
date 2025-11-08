import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, OrderStatus } from './dto/update-order.dto';
import { User } from '../users/entities/user.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Regra 14: Validar usuário existe
    const user = await this.userRepository.findOne({
      where: { id: createOrderDto.user_id },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Regra 15: Validar restaurante existe e está ativo
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: createOrderDto.restaurant_id },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurante não encontrado');
    }
    if (!restaurant.isActive) {
      throw new BadRequestException('Restaurante não está disponível');
    }

    // Regra 16: Validar todos produtos existem e pertencem ao restaurante
    const productIds = createOrderDto.items.map((item) => item.product_id);
    const products = await this.productRepository.find({
      where: productIds.map(id => ({ id })),
      relations: ['restaurant'],
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('Um ou mais produtos não encontrados');
    }

    for (const product of products) {
      if (product.restaurant.id !== restaurant.id) {
        throw new BadRequestException(
          `Produto ${product.name} não pertence ao restaurante ${restaurant.name}`,
        );
      }
      if (!product.isAvailable) {
        throw new BadRequestException(
          `Produto ${product.name} não está disponível`,
        );
      }
    }

    // Regra 17: Validar total do pedido (recalcular)
    const calculatedTotal = createOrderDto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (Math.abs(calculatedTotal - createOrderDto.total) > 0.01) {
      throw new BadRequestException(
        `Total informado (${createOrderDto.total}) não corresponde ao calculado (${calculatedTotal})`,
      );
    }

    const order = this.orderRepository.create({
      user,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      items: createOrderDto.items,
      total: createOrderDto.total,
      addressId: createOrderDto.address_id,
      address: createOrderDto.address,
      paymentType: createOrderDto.payment_type,
      status: OrderStatus.PENDING,
    });

    return this.orderRepository.save(order);
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    // Regra 18: Validar transições de status permitidas
    if (updateOrderDto.status) {
      const validTransitions: Record<OrderStatus, OrderStatus[]> = {
        [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
        [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
        [OrderStatus.PREPARING]: [OrderStatus.DELIVERING, OrderStatus.CANCELLED],
        [OrderStatus.DELIVERING]: [OrderStatus.DELIVERED],
        [OrderStatus.DELIVERED]: [],
        [OrderStatus.CANCELLED]: [],
      };

      const allowedStatuses = validTransitions[order.status as OrderStatus];

      if (!allowedStatuses.includes(updateOrderDto.status)) {
        throw new BadRequestException(
          `Não é possível alterar status de ${order.status} para ${updateOrderDto.status}`,
        );
      }

      order.status = updateOrderDto.status;
    }

    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);

    // Regra 19: Não permitir deletar pedidos finalizados ou em andamento
    if (
      [
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
        OrderStatus.DELIVERING,
        OrderStatus.DELIVERED,
      ].includes(order.status as OrderStatus)
    ) {
      throw new BadRequestException(
        'Não é possível deletar pedidos confirmados ou finalizados',
      );
    }

    await this.orderRepository.remove(order);
  }
}
