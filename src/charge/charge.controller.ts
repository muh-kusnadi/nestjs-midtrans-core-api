import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { BaseChargeDto } from './dto/baseCharge.dto';

@Controller('charge')
export class ChargeController {
  constructor(private chargeService: ChargeService) {}

  @Post()
  @HttpCode(200)
  async createCharge(@Body() baseChargeDto: BaseChargeDto) {
    return this.chargeService.executeCharge(
      baseChargeDto.paymentMethod,
      baseChargeDto,
    );
  }
}
