export interface IPaymentStrategy {
  processPayment(orderId: string, paymentData: any): Promise<any>;
}

export interface BankTransferPostBody {
  transaction_details: {
    order_id: string;
    gross_amount: any;
  };
  customer_details: {
    first_name: any;
    last_name: any;
    email: any;
    phone: any;
  };
  payment_type?: string;
  bank_transfer?: object;
  echannel?: object;
}
