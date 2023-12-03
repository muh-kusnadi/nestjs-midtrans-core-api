import axios from 'axios';
import { IPaymentStrategy } from '../interfaces/payment.interface';

export class AkulakuPaymentStrategy implements IPaymentStrategy {
  constructor(private config: any) {}

  async processPayment(orderId: string, paymentData: any): Promise<any> {
    const serverKeyFinal = btoa(this.config.midtransServerKey) + ':';
    try {
      const postBody = {
        payment_type: paymentData.paymentMethod,
        item_details: [
          {
            id: '1',
            price: paymentData.grossAmount,
            quantity: 1,
            name: 'Sepatu ',
          },
        ],
        transaction_details: {
          order_id: orderId,
          gross_amount: paymentData.grossAmount,
        },
        customer_details: {
          first_name: paymentData.firstName,
          last_name: paymentData.lastName,
          email: paymentData.email,
          phone: paymentData.phone,
        },
      };

      const midtransResponse = await axios.post(
        `${this.config.midtransUrl}/v2/charge`,
        postBody,
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
      if (axios.isAxiosError(error)) {
        console.error('Axios error in BankTransferPaymentStrategy:', error);
      } else {
        console.error('Non-Axios error in BankTransferPaymentStrategy:', error);
      }
      throw new Error('Error fetching data');
    }
  }
}
