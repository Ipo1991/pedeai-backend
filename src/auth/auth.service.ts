import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
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

    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

  
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

  
    const normalizePhone = (phone?: string) => {
      if (!phone) return undefined;
      const cleaned = phone.replace(/\D/g, '');
      
      // Validar formato do telefone (deve ter 10 ou 11 dígitos)
      if (cleaned.length < 10 || cleaned.length > 11) {
        throw new BadRequestException('Telefone deve ter 10 ou 11 dígitos');
      }
      
      // Validar DDD (deve ser 48)
      if (!cleaned.startsWith('48')) {
        throw new BadRequestException('Apenas telefones com DDD 48 são aceitos');
      }
      
      return cleaned;
    };
    
    const normalizeBirthDate = (birth?: string) => {
      if (!birth) return undefined;
      
      let birthDate: Date | null = null;
      let isoDate: string | undefined = undefined;
      
      // Se vier no formato dd/MM/yyyy
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(birth)) {
        const [d, m, y] = birth.split('/');
        isoDate = `${y}-${m}-${d}`;
        birthDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      }
      // Se vier no formato yyyy-MM-dd
      else if (/^\d{4}-\d{2}-\d{2}$/.test(birth)) {
        isoDate = birth;
        const [y, m, d] = birth.split('-');
        birthDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      }
      
      // Validar idade mínima de 18 anos
      if (birthDate) {
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        
        const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
        
        if (actualAge < 18) {
          throw new BadRequestException('Você deve ter no mínimo 18 anos');
        }
      }
      
      return isoDate;
    };

    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      phone: normalizePhone(registerDto.phone),
      birthDate: normalizeBirthDate(registerDto.birth_date),
    });

    await this.userRepository.save(user);

  
    const { password, ...result } = user;
    return {
      ...result,
      access_token: this.generateToken(user),
      isAdmin: user.isAdmin,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }


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
      isAdmin: user.isAdmin,
    };
  }

  private generateToken(user: User): string {
    const payload = { 
      email: user.email, 
      sub: user.id,
      isAdmin: user.isAdmin 
    };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
