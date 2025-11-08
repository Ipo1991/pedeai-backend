import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Categoria é obrigatória' })
  category: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsNotEmpty({ message: 'Tempo de entrega é obrigatório' })
  delivery_time: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: 'Taxa de entrega é obrigatória' })
  delivery_fee: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
