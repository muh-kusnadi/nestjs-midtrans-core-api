import { Module } from '@nestjs/common';
import { CheckoutModule } from './checkout/checkout.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CheckoutModule,
  ],
})
export class AppModule {}
