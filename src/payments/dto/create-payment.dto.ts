import { IsString, IsNotEmpty, IsBoolean, IsOptional, Matches, MinLength, ValidateIf } from 'class-validator';

export class CreatePaymentDto {
  @IsString({ message: 'Tipo deve ser uma string' })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  type: string; // 'credit' | 'debit' | 'cash' | 'pix'

  @ValidateIf(o => o.type === 'credit' || o.type === 'debit')
  @IsString({ message: 'Número do cartão deve ser uma string' })
  @IsNotEmpty({ message: 'Número do cartão é obrigatório' })
  @Matches(/^\d{4} \d{4} \d{4} \d{4}$/, { message: 'Formato do cartão: 0000 0000 0000 0000' })
  cardNumber?: string;

  @ValidateIf(o => o.type === 'credit' || o.type === 'debit')
  @IsString({ message: 'Validade deve ser uma string' })
  @IsNotEmpty({ message: 'Validade é obrigatória' })
  @Matches(/^\d{2}\/\d{2}$/, { message: 'Formato da validade: MM/AA' })
  expiry?: string;

  @ValidateIf(o => o.type === 'credit' || o.type === 'debit')
  @IsString({ message: 'CVV deve ser uma string' })
  @IsNotEmpty({ message: 'CVV é obrigatório' })
  @Matches(/^\d{3,4}$/, { message: 'CVV deve ter 3 ou 4 dígitos' })
  cvv?: string;

  @ValidateIf(o => o.type === 'credit' || o.type === 'debit')
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  name?: string;

  @IsBoolean({ message: 'isDefault deve ser boolean' })
  isDefault: boolean;
}
