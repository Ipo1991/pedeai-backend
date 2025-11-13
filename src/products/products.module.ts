import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Restaurant]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretjwt',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
