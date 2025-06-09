import { Body, Controller, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TransactionDto } from '@core/wallet/dto/transaction.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('send')
  async sendMoney(@Body() event: TransactionDto) {
    const { fromWalletId, toWalletId, amount } = event;
    return this.walletService.sendMoney({ fromWalletId, toWalletId, amount });
  }
}
