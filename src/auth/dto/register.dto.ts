import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Matches, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

// Regra de negócio número 1: Validador customizado para senha com 3 caracteres iguais seguidos
@ValidatorConstraint({ name: 'NoThreeConsecutive', async: false })
export class NoThreeConsecutiveValidator implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (!password) return true;

    return !/(.)\1{2,}/.test(password);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Senha não pode ter 3 caracteres iguais consecutivos';
  }
}

// Regra de negócio número 2: Validador customizado para idade mínima de 18 anos
@ValidatorConstraint({ name: 'MinimumAge', async: false })
export class MinimumAgeValidator implements ValidatorConstraintInterface {
  validate(birthDate: string, args: ValidationArguments) {
    if (!birthDate) return true;


    let year: number, month: number, day: number;

    if (birthDate.includes('-')) {

      [year, month, day] = birthDate.split('-').map(Number);
    } else if (birthDate.includes('/')) {

      const parts = birthDate.split('/');
      day = Number(parts[0]);
      month = Number(parts[1]);
      year = Number(parts[2]);
    } else {
      return false;
    }

    const birth = new Date(year, month - 1, day);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Você deve ter no mínimo 18 anos';
  }
}

//Regra de negócio número 3: Validador customizado para DDD 48
@ValidatorConstraint({ name: 'DDD48Only', async: false })
export class DDD48Validator implements ValidatorConstraintInterface {
  validate(phone: string, args: ValidationArguments) {
    if (!phone) return true;

    const digits = phone.replace(/\D/g, '');

    return digits.startsWith('48');
  }

  defaultMessage(args: ValidationArguments) {
    return 'Apenas telefones com DDD 48 são aceitos';
  }
}

export class RegisterDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @Matches(/[A-Z]/, { message: 'Senha deve conter ao menos uma letra maiúscula' })
  @Matches(/[a-z]/, { message: 'Senha deve conter ao menos uma letra minúscula' })
  @Matches(/[0-9]/, { message: 'Senha deve conter ao menos um número' })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Senha deve conter ao menos um caractere especial' })
  @Validate(NoThreeConsecutiveValidator)
  password: string;

  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsOptional()
  @IsString()
  @Validate(DDD48Validator)
  phone?: string;

  @IsOptional()
  @IsString()
  @Validate(MinimumAgeValidator)
  birth_date?: string;
}
