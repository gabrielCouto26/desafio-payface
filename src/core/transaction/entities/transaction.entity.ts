import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'from_wallet_id', type: 'uuid' })
  fromWalletId: string;

  @Column({ name: 'to_wallet_id', type: 'uuid', nullable: true })
  toWalletId: string;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'from_wallet_id' })
  fromWallet: Wallet;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'to_wallet_id' })
  toWallet: Wallet;
}
