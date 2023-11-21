import { IPaymentStrategy } from '../interfaces/payment.interface';

export class BankTransferPaymentStrategy implements IPaymentStrategy {
  constructor(private config: any) {}

  async processPayment(orderId: string, paymentData: string): Promise<string> {
    console.log(paymentData);
    return `Bank transfer payment processed for order ${orderId}`;
  }
}
