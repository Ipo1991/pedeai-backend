import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  Length,
  IsInt,
} from 'class-validator';

export class CreateAddressDto {
  // Preenchido pelo controller a partir do JWT; não exigir no body
  @IsInt()
  @IsOptional()
  user_id?: number;

  @IsString()
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  street: string;

  @IsString()
  @IsNotEmpty({ message: 'Número é obrigatório' })
  number: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsString()
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  neighborhood: string;

  @IsString()
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  city: string;

  @IsString()
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres (UF)' })
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  state: string;

  @IsString()
  @Length(8, 8, { message: 'CEP deve ter 8 dígitos' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  zip: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
