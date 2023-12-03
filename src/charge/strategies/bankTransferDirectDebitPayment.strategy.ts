import axios from 'axios';
import {
  BankTransferDirectDebitBody,
  IPaymentStrategy,
} from '../interfaces/payment.interface';

export class BankTransferDirectDebitPaymentStrategy
  implements IPaymentStrategy
{
  constructor(private config: any) {}

  async processPayment(orderId: string, paymentData: any): Promise<any> {
    const serverKeyFinal = btoa(this.config.midtransServerKey) + ':';
    try {
      const postBody: BankTransferDirectDebitBody = {
        payment_type: paymentData.source,
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
        item_details: [
          {
            id: '1',
            price: paymentData.grossAmount,
            quantity: 1,
            name: 'Mobil ',
          },
        ],
      };

      switch (paymentData.source) {
        case 'bca_klikpay':
          postBody.bca_klikpay = {
            description: 'Pembalian Barang',
          };
          break;
        case 'bca_klikbca':
          postBody.bca_klikbca = {
            description: 'testing transaction',
            user_id: 'midtrans1012',
          };
          break;
        case 'cimb_clicks':
          postBody.cimb_clicks = {
            description: 'Purchase of a special event item',
          };
          break;
        case 'uob_ezpay':
          postBody.uob_ezpay = {
            callback_url: 'http://example.com/uobezpay?order_id=sample-001',
          };
          break;
      }

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
        console.error(
          'Axios error in BankTransferPaymentStrategy:',
          error.response.data,
        );
      } else {
        console.error('Non-Axios error in BankTransferPaymentStrategy:', error);
      }
      throw new Error('Error fetching data');
    }
  }
}
