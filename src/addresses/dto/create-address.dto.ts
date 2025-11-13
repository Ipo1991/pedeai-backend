import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  Length,
  IsInt,
  Matches,
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

  @IsString()
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  city: string;

  @IsString()
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres (UF)' })
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  state: string;

  @IsString()
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @Matches(/^\d{8}$/, { message: 'CEP deve ter 8 dígitos numéricos' })
  zip: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
