import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  description: string;

  @IsNumber()
  @Min(0, { message: 'Preço deve ser maior ou igual a zero' })
  @IsNotEmpty({ message: 'Preço é obrigatório' })
  price: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  is_available?: boolean;

  @IsInt()
  @IsNotEmpty({ message: 'ID do restaurante é obrigatório' })
  restaurant_id: number;
}
