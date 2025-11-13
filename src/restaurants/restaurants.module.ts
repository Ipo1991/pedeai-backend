import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { Restaurant } from './entities/restaurant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretjwt',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
