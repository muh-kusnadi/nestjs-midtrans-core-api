import { Injectable } from '@nestjs/common';
import { InitialChargeDto } from './dto';
import axios from 'axios';
import { UtilityService } from '../utility/utility.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CheckoutService {
  constructor(private config: ConfigService) {}
  async initialCharge(dto: InitialChargeDto): Promise<any> {
    const serverKey = btoa(
      this.config.get('MIDTRANS_SANDBOX_SERVER_KEY') + ':',
    );
    const paymentType = 'credit_card';
    const randomString = UtilityService.generateRandomString(15);
    const midtransUrl = this.config.get('MIDTRANS_SANDBOX_URL');
    try {
      const midtransResponse = await axios.post(
        `${midtransUrl}/v2/charge`,
        {
          payment_type: paymentType,
          transaction_details: {
            order_id: randomString,
            gross_amount: dto.grossAmount,
          },
          credit_card: {
            token_id: dto.tokenId,
            authentication: dto.authentication,
          },
          customer_details: {
            first_name: dto.firstName,
            last_name: dto.lastName,
            email: dto.email,
            phone: dto.phone,
          },
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: serverKey,
          },
        },
      );

      return midtransResponse.data;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching data');
    }
  }
}
