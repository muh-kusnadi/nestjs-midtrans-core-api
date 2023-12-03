import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { BaseChargeDto } from './baseCharge.dto';

export class BankTransferDirectDebitChargeDto extends BaseChargeDto {
  @IsNotEmpty()
  @IsString()
  @IsIn([
    'bca_klikpay',
    'bca_klikbca',
    'bri_epay',
    'cimb_clicks',
    'danamon_online',
    'uob_ezpay',
  ])
  source: string;
}
