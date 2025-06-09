import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wallet } from '../../core/wallet/entities/wallet.entity';

@Injectable()
export default class WalletRepository extends Repository<Wallet> {}
