import { IsEnum, IsOptional } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: 'Status inválido',
  })
  status?: OrderStatus;
}
