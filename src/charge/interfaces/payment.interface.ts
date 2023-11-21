export interface IPaymentStrategy {
  processPayment(orderId: string, paymentData: any): Promise<any>;
}
