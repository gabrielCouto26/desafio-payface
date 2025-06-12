import { Body, Controller, Header, HttpCode, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TransactionDto } from '../../core/transaction/dto/transaction.dto';
import TransactionValidator from '../shared/transaction.validator';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('send')
  @HttpCode(201)
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  @Header('Access-Control-Allow-Methods', 'POST')
  async sendMoney(@Body() event: TransactionDto) {
    TransactionValidator.validate(event);
    return this.walletService.sendMoney(event);
  }
}
