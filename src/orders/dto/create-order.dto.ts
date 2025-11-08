import {
  IsNotEmpty,
  IsInt,
  IsArray,
  IsString,
  IsNumber,
  ArrayMinSize,
  ValidateNested,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  user_id: number;

  @IsInt()
  @IsNotEmpty({ message: 'ID do restaurante é obrigatório' })
  restaurant_id: number;

  @IsString()
  @IsNotEmpty({ message: 'Nome do restaurante é obrigatório' })
  restaurant_name: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Pedido deve conter pelo menos 1 item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: 'Total é obrigatório' })
  total: number;

  @IsOptional()
  @IsInt()
  address_id?: number;

  @IsString()
  @IsNotEmpty({ message: 'Endereço de entrega é obrigatório' })
  address: string;

  @IsString()
  @IsNotEmpty({ message: 'Tipo de pagamento é obrigatório' })
  payment_type: string;
}
