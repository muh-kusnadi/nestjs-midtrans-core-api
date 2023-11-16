import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { InitialChargeDto } from './dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}
  @Post('initial-charge')
  @HttpCode(200)
  initialCharge(@Body() dto: InitialChargeDto) {
    return this.checkoutService.initialCharge(dto);
  }
}
