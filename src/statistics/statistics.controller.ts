import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('statistics')
@UseGuards(JwtAuthGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.statisticsService.getDashboardStats();
  }

  @Get('orders-by-period')
  getOrdersByPeriod(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days) : 7;
    return this.statisticsService.getOrdersByPeriod(daysNum);
  }

  @Get('top-restaurants')
  getTopRestaurants(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 5;
    return this.statisticsService.getTopRestaurants(limitNum);
  }

  @Get('top-products')
  getTopProducts(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 5;
    return this.statisticsService.getTopProducts(limitNum);
  }

  @Get('revenue')
  getRevenue(@Query('period') period?: 'day' | 'week' | 'month') {
    return this.statisticsService.getRevenueByPeriod(period || 'day');
  }
}
