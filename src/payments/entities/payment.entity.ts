import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  type: string; // 'credit' | 'debit' | 'cash' | 'pix'

  @Column({ name: 'card_number', nullable: true })
  cardNumber: string; // Armazenado com últimos 4 dígitos visíveis

  @Column({ nullable: true })
  expiry: string; // MM/AA

  @Column({ nullable: true })
  cvv: string; // Não deve ser armazenado em produção, mas mantendo por simplicidade

  @Column({ nullable: true })
  name: string; // Nome no cartão

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
