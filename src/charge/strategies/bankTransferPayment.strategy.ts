import axios from 'axios';
import {
  BankTransferPostBody,
  IPaymentStrategy,
} from '../interfaces/payment.interface';

export class BankTransferPaymentStrategy implements IPaymentStrategy {
  constructor(private config: any) {}

  async processPayment(orderId: string, paymentData: any): Promise<any> {
    const serverKeyFinal = btoa(this.config.midtransServerKey) + ':';
    try {
      const postBody: BankTransferPostBody = {
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
        payment_type: this.determinePaymentType(paymentData),
      };

      switch (paymentData.bankName) {
        case 'mandiri_bill':
          postBody.echannel = {
            bill_info1: 'Payment:',
            bill_info2: 'Online purchase',
          };
          break;
        case 'bca':
        case 'bni':
        case 'bri':
        case 'permata':
          postBody.bank_transfer = {
            bank: paymentData.bankName,
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
        console.error('Axios error in BankTransferPaymentStrategy:', error);
      } else {
        console.error('Non-Axios error in BankTransferPaymentStrategy:', error);
      }
      throw new Error('Error fetching data');
    }
  }

  private determinePaymentType(paymentData: any): string {
    switch (paymentData.bankName) {
      case 'mandiri_bill':
        return 'echannel';
      case 'permata':
        return 'permata';
      default:
        return 'bank_transfer';
    }
  }
}
