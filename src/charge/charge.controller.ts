import { Body, Controller, Post, Res } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { Response } from 'express';
import { ChargeDtoPipe } from './pipes/charge-dto.pipes';

@Controller('charge')
export class ChargeController {
  constructor(private chargeService: ChargeService) {}

  @Post()
  async createCharge(
    @Body(new ChargeDtoPipe()) chargeDto: any,
    @Res() response: Response,
  ) {
    const result = await this.chargeService.executeCharge(
      chargeDto.paymentMethod,
      chargeDto,
    );
    const statusCode = Number(result.status_code);

    response.status(statusCode).send(result);
  }
}
