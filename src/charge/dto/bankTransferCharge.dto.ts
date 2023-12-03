import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { BaseChargeDto } from './baseCharge.dto';

export class BankTransferChargeDto extends BaseChargeDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['bca', 'bni', 'bri', 'mandiri_bill', 'permata', 'cimb'])
  bankName: string;
}
