import axios from 'axios';
import { IPaymentStrategy } from '../interfaces/payment.interface';

export class CreditCardPaymentStrategy implements IPaymentStrategy {
  constructor(private config: any) {}

  async processPayment(orderId: string, paymentData: any): Promise<any> {
    const serverKeyFinal = btoa(this.config.midtransServerKey) + ':';
    try {
      const midtransResponse = await axios.post(
        `${this.config.midtransUrl}/v2/charge`,
        {
          payment_type: paymentData.paymentMethod,
          transaction_details: {
            order_id: orderId,
            gross_amount: paymentData.grossAmount,
          },
          credit_card: {
            token_id: paymentData.tokenId,
            authentication: true,
          },
          customer_details: {
            first_name: paymentData.firstName,
            last_name: paymentData.lastName,
            email: paymentData.email,
            phone: paymentData.phone,
          },
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: serverKeyFinal,
          },
        },
      );

      return midtransResponse.data;
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching data');
    }
  }
}
