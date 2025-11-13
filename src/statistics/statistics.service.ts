import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class StatisticsService {
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

  async getDashboardStats() {
    // Total de usuários
    const totalUsers = await this.userRepository.count();

    // Total de restaurantes ativos
    const totalRestaurants = await this.restaurantRepository.count({
      where: { isActive: true },
    });

    // Total de produtos disponíveis
    const totalProducts = await this.productRepository.count({
      where: { isAvailable: true },
    });

    // Total de pedidos
    const totalOrders = await this.orderRepository.count();

    // Pedidos por status
    const ordersByStatus = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    // Receita total
    const revenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(CAST(order.total AS DECIMAL))', 'total')
      .where("order.status IN ('delivered', 'confirmed', 'preparing', 'delivering')")
      .getRawOne();

    const totalRevenue = parseFloat(revenueResult?.total || '0');

    // Pedidos de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ordersToday = await this.orderRepository.count({
      where: {
        createdAt: today as any,
      },
    });

    return {
      totalUsers,
      totalRestaurants,
      totalProducts,
      totalOrders,
      ordersByStatus,
      totalRevenue,
      ordersToday,
    };
  }

  async getOrdersByPeriod(days: number = 7) {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select("TO_CHAR(order.created_at, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(CAST(order.total AS DECIMAL))', 'revenue')
      .where(`order.created_at >= NOW() - INTERVAL '${days} days'`)
      .groupBy("TO_CHAR(order.created_at, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC')
      .getRawMany();

    return result.map((item) => ({
      date: item.date,
      count: parseInt(item.count),
      revenue: parseFloat(item.revenue || '0'),
    }));
  }

  async getTopRestaurants(limit: number = 5) {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.restaurant_name', 'restaurantName')
      .addSelect('order.restaurant_id', 'restaurantId')
      .addSelect('COUNT(*)', 'orderCount')
      .addSelect('SUM(CAST(order.total AS DECIMAL))', 'totalRevenue')
      .groupBy('order.restaurant_name, order.restaurant_id')
      .orderBy('COUNT(*)', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map((item) => ({
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
      orderCount: parseInt(item.orderCount),
      totalRevenue: parseFloat(item.totalRevenue || '0'),
    }));
  }

  async getTopProducts(limit: number = 5) {
    // Buscar todos os pedidos com items
    const orders = await this.orderRepository.find();

    // Agregar produtos de todos os pedidos
    const productMap = new Map<
      number,
      { id: number; name: string; quantity: number; revenue: number }
    >();

    orders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          const productId = item.product_id || item.id;
          const existing = productMap.get(productId) || {
            id: productId,
            name: item.name,
            quantity: 0,
            revenue: 0,
          };

          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;

          productMap.set(productId, existing);
        });
      }
    });

    // Converter para array e ordenar
    const products = Array.from(productMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);

    return products;
  }

  async getRevenueByPeriod(period: 'day' | 'week' | 'month' = 'day') {
    let dateFormat = 'YYYY-MM-DD';
    let interval = '7 days';

    if (period === 'week') {
      dateFormat = 'YYYY-IW';
      interval = '8 weeks';
    } else if (period === 'month') {
      dateFormat = 'YYYY-MM';
      interval = '12 months';
    }

    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select(`TO_CHAR(order.created_at, '${dateFormat}')`, 'period')
      .addSelect('SUM(CAST(order.total AS DECIMAL))', 'revenue')
      .addSelect('COUNT(*)', 'orderCount')
      .where(`order.created_at >= NOW() - INTERVAL '${interval}'`)
      .andWhere("order.status != 'cancelled'")
      .groupBy(`TO_CHAR(order.created_at, '${dateFormat}')`)
      .orderBy('period', 'ASC')
      .getRawMany();

    return result.map((item) => ({
      period: item.period,
      revenue: parseFloat(item.revenue || '0'),
      orderCount: parseInt(item.orderCount),
    }));
  }
}
