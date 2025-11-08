import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Regra 1: Email único
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Regra 2: Hash de senha com bcrypt (min 10 rounds)
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Normalizações de entrada
    const normalizePhone = (phone?: string) =>
      phone ? phone.replace(/\D/g, '') : undefined;
    const normalizeBirthDate = (birth?: string) => {
      if (!birth) return undefined;
      // Aceita formatos dd/mm/aaaa ou yyyy-mm-dd
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(birth)) {
        const [d, m, y] = birth.split('/');
        return `${y}-${m}-${d}`; // ISO
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(birth)) return birth; // já ISO
      return undefined; // formato inválido é ignorado
    };

    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      phone: normalizePhone(registerDto.phone),
      birthDate: normalizeBirthDate(registerDto.birth_date),
    });

    await this.userRepository.save(user);

    // Não retornar senha
    const { password, ...result } = user;
    return {
      ...result,
      access_token: this.generateToken(user),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Regra 3: Validar senha com bcrypt
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { password, ...result } = user;
    return {
      ...result,
      access_token: this.generateToken(user),
    };
  }

  private generateToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
