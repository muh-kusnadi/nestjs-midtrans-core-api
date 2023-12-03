import { CreditCardChargeDto } from '../charge/dto/creditCardCharge.dto';
import { BankTransferChargeDto } from '../charge/dto/bankTransferCharge.dto';

export class UtilityService {
  static generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static isCreditCardChargeDto(body: any): body is CreditCardChargeDto {
    return body.paymentMethod === 'credit_card';
  }

  static isBankTransferChargeDto(body: any): body is BankTransferChargeDto {
    return body.paymentMethod === 'bank_transfer';
  }
}
