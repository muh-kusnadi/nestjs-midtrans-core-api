import { Body, Controller, Post, Res } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { BaseChargeDto } from './dto/baseCharge.dto';
import { Response } from 'express';

@Controller('charge')
export class ChargeController {
  constructor(private chargeService: ChargeService) {}

  @Post()
  async createCharge(
    @Body() baseChargeDto: BaseChargeDto,
    @Res() response: Response,
  ) {
    const result = await this.chargeService.executeCharge(
      baseChargeDto.paymentMethod,
      baseChargeDto,
    );

    response.status(result.status_code).send(result);
  }
}
