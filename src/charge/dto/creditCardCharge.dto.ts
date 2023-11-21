import { BaseChargeDto } from './baseCharge.dto';

export class CreditCardChargeDto extends BaseChargeDto {
  tokenId: string;
  authentication: boolean;
}
