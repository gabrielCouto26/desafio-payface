import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;
}
