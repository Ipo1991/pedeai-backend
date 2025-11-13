import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async findAllByUser(userId: number): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async create(userId: number, createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const existingPayments = await this.paymentsRepository.find({
      where: { userId },
    });

    // REGRA 1: Não pode ter a mesma numeração de cartão
    if (createPaymentDto.cardNumber) {
      const cardExists = existingPayments.some(p => p.cardNumber === createPaymentDto.cardNumber);
      if (cardExists) {
        throw new ConflictException('Já existe um cartão cadastrado com esta numeração');
      }
    }

    // REGRA 2: Validade tem que ser maior que 1 ano do mês atual
    if (createPaymentDto.expiry) {
      const [month, year] = createPaymentDto.expiry.split('/').map(Number);
      const expiryDate = new Date(2000 + year, month - 1); // MM/AA
      const today = new Date();
      const oneYearFromNow = new Date(today.getFullYear(), today.getMonth() + 12);
      
      if (expiryDate <= oneYearFromNow) {
        throw new BadRequestException('A validade do cartão deve ser maior que 1 ano a partir da data atual');
      }
    }

    // REGRA 3: Não pode ter 2 cartões de crédito ou 2 de débito, tem que ser um de cada
    if (createPaymentDto.type === 'credit' || createPaymentDto.type === 'debit') {
      const sameTypeCount = existingPayments.filter(p => p.type === createPaymentDto.type).length;
      if (sameTypeCount >= 1) {
        throw new BadRequestException(`Você já possui um cartão de ${createPaymentDto.type === 'credit' ? 'crédito' : 'débito'} cadastrado. Só é permitido um cartão de cada tipo.`);
      }
    }

    // Se isDefault = true, remove default dos outros pagamentos
    if (createPaymentDto.isDefault) {
      await this.paymentsRepository.update(
        { userId, isDefault: true },
        { isDefault: false },
      );
    }

    const payment = this.paymentsRepository.create({
      ...createPaymentDto,
      userId,
    });

    return this.paymentsRepository.save(payment);
  }

  async findOne(id: number, userId: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id, userId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(
    id: number,
    userId: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id, userId);

    const userPayments = await this.paymentsRepository.find({
      where: { userId },
    });

    // REGRA 1: Não pode ter a mesma numeração de cartão
    if (updatePaymentDto.cardNumber && updatePaymentDto.cardNumber !== payment.cardNumber) {
      const cardExists = userPayments.some(
        p => p.id !== id && p.cardNumber === updatePaymentDto.cardNumber
      );
      if (cardExists) {
        throw new ConflictException('Já existe um cartão cadastrado com esta numeração');
      }
    }

    // REGRA 2: Validade tem que ser maior que 1 ano do mês atual
    if (updatePaymentDto.expiry) {
      const [month, year] = updatePaymentDto.expiry.split('/').map(Number);
      const expiryDate = new Date(2000 + year, month - 1);
      const today = new Date();
      const oneYearFromNow = new Date(today.getFullYear(), today.getMonth() + 12);
      
      if (expiryDate <= oneYearFromNow) {
        throw new BadRequestException('A validade do cartão deve ser maior que 1 ano a partir da data atual');
      }
    }

    // REGRA 3: Não pode ter 2 cartões de crédito ou 2 de débito
    if (updatePaymentDto.type && updatePaymentDto.type !== payment.type) {
      if (updatePaymentDto.type === 'credit' || updatePaymentDto.type === 'debit') {
        const sameTypeCount = userPayments.filter(
          p => p.id !== id && p.type === updatePaymentDto.type
        ).length;
        if (sameTypeCount >= 1) {
          throw new BadRequestException(`Você já possui um cartão de ${updatePaymentDto.type === 'credit' ? 'crédito' : 'débito'} cadastrado. Só é permitido um cartão de cada tipo.`);
        }
      }
    }

    // Se está marcando como default, remove default dos outros
    if (updatePaymentDto.isDefault === true) {
      // Busca todos os outros pagamentos do usuário que são default
      const otherPayments = await this.paymentsRepository.find({
        where: { userId, isDefault: true },
      });
      
      // Remove o default de todos exceto o atual
      for (const otherPayment of otherPayments) {
        if (otherPayment.id !== id) {
          otherPayment.isDefault = false;
          await this.paymentsRepository.save(otherPayment);
        }
      }
    }

    Object.assign(payment, updatePaymentDto);
    return this.paymentsRepository.save(payment);
  }

  async remove(id: number, userId: number): Promise<void> {
    const payment = await this.findOne(id, userId);
    await this.paymentsRepository.remove(payment);
  }
}
