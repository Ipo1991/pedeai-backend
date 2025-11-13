import { IsString, IsBoolean, IsOptional, Matches, MinLength, ValidateIf } from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  @IsString({ message: 'Tipo deve ser uma string' })
  type?: string;

  @IsOptional()
  @ValidateIf(o => o.type === 'credit' || o.type === 'debit')
  @IsString({ message: 'Número do cartão deve ser uma string' })
  @Matches(/^\d{4} \d{4} \d{4} \d{4}$/, { message: 'Formato do cartão: 0000 0000 0000 0000' })
  cardNumber?: string;

  @IsOptional()
  @ValidateIf(o => o.type === 'credit' || o.type === 'debit')
  @IsString({ message: 'Validade deve ser uma string' })
  @Matches(/^\d{2}\/\d{2}$/, { message: 'Formato da validade: MM/AA' })
  expiry?: string;

  @IsOptional()
  @ValidateIf(o => o.type === 'credit' || o.type === 'debit')
  @IsString({ message: 'CVV deve ser uma string' })
  @Matches(/^\d{3,4}$/, { message: 'CVV deve ter 3 ou 4 dígitos' })
  cvv?: string;

  @IsOptional()
  @ValidateIf(o => o.type === 'credit' || o.type === 'debit')
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  name?: string;

  @IsOptional()
  @IsBoolean({ message: 'isDefault deve ser boolean' })
  isDefault?: boolean;
}
