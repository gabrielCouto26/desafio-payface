import { Body, Controller, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TransactionDto } from '../../core/transaction/dto/transaction.dto';
import TransactionValidator from '../shared/transaction.validator';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('send')
  async sendMoney(@Body() event: TransactionDto) {
    TransactionValidator.validate(event);
    return this.walletService.sendMoney(event);
  }
}
