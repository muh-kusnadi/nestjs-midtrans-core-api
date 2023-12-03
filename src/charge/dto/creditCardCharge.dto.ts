import { IsNotEmpty, IsString } from 'class-validator';
import { BaseChargeDto } from './baseCharge.dto';

export class CreditCardChargeDto extends BaseChargeDto {
  @IsNotEmpty()
  @IsString()
  tokenId: string;
}
