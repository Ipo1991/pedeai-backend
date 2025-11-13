import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['addresses', 'orders'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    console.log('=== UPDATE USER ===');
    console.log('ID:', id);
    console.log('UpdateUserDto:', updateUserDto);

    // Regra 4: Se alterar email, validar unicidade
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Regra 5: Se alterar senha, aplicar hash
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Normalizar telefone - remover caracteres não numéricos
    if (updateUserDto.phone) {
      const cleanPhone = updateUserDto.phone.replace(/\D/g, '');
      
      // Validar formato do telefone (deve ter 10 ou 11 dígitos)
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        throw new BadRequestException('Telefone deve ter 10 ou 11 dígitos');
      }
      
      // Validar DDD (deve ser 48)
      if (!cleanPhone.startsWith('48')) {
        throw new BadRequestException('Apenas telefones com DDD 48 são aceitos');
      }
      
      user.phone = cleanPhone;
      delete updateUserDto.phone;
    }

    // Normalizar data de nascimento - converter dd/MM/yyyy para yyyy-MM-dd
    if (updateUserDto.birth_date) {
      const birth = updateUserDto.birth_date;
      let birthDate: Date | null = null;
      
      // Se vier no formato dd/MM/yyyy
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(birth)) {
        const [d, m, y] = birth.split('/');
        user.birthDate = `${y}-${m}-${d}`;
        birthDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      }
      // Se vier no formato yyyy-MM-dd, usar direto
      else if (/^\d{4}-\d{2}-\d{2}$/.test(birth)) {
        user.birthDate = birth;
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
      
      delete updateUserDto.birth_date;
      console.log('Data convertida:', user.birthDate);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    if (!currentPassword || !newPassword) {
      throw new BadRequestException('Senha atual e nova senha são obrigatórias');
    }

    if (newPassword.length < 8) {
      throw new BadRequestException('A nova senha deve ter no mínimo 8 caracteres');
    }

    const user = await this.findOne(userId);

    // Verifica se a senha atual está correta
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Hash da nova senha
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
  }
}
