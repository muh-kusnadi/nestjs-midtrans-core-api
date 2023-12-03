import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UtilityService } from '../utility/utility.service';
import { IPaymentStrategy } from './interfaces/payment.interface';
import { CreditCardPaymentStrategy } from './strategies/creditCardPayment.strategy';
import { BankTransferPaymentStrategy } from './strategies/bankTransferPayment.strategy';
import { QRISPaymentStrategy } from './strategies/qRISPayment.strategy';

@Injectable()
export class ChargeService {
  private strategy: IPaymentStrategy;

  constructor(private configService: ConfigService) {}

  setStrategy(paymentMethod: string) {
    const config = {
      midtransUrl:
        this.configService.get('APP_ENV') == 'production'
          ? this.configService.get('MIDTRANS_PRODUCTION_URL')
          : this.configService.get('MIDTRANS_SANDBOX_URL'),
      midtransServerKey:
        this.configService.get('APP_ENV') == 'production'
          ? this.configService.get('MIDTRANS_PRODUCTION_SERVER_KEY')
          : this.configService.get('MIDTRANS_SANDBOX_SERVER_KEY'),
    };

    switch (paymentMethod) {
      case 'credit_card':
        this.strategy = new CreditCardPaymentStrategy(config);
        break;
      case 'bank_transfer':
        this.strategy = new BankTransferPaymentStrategy(config);
        break;
      case 'qris':
        this.strategy = new QRISPaymentStrategy(config);
        break;
      default:
        throw new Error('Invalid payment method');
    }
  }

  async executeCharge(paymentMethod: string, paymentData: any) {
    const orderId = UtilityService.generateRandomString(15);
    this.setStrategy(paymentMethod);
    return this.strategy.processPayment(orderId, paymentData);
  }
}
