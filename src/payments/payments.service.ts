import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
