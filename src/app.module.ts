import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChargeModule } from './charge/charge.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChargeModule,
  ],
})
export class AppModule {}
