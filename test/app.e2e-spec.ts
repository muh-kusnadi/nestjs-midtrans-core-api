import { Test } from '@nestjs/testing';
import axios from 'axios';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('App e2e', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Charge Payment', () => {
    describe('CreditCardPaymentStrategy', () => {
      it('should process credit card payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: 201,
            status_message: 'Success, Credit Card transaction is successful',
            channel_response_code: '00',
            channel_response_message: 'Approved',
            bank: 'bni',
            eci: '05',
            transaction_id: '405d27d5-5ad9-43ac-bdd6-0ccbde7d7dda',
            order_id: 'test-transaction-54321',
            merchant_id: 'G490526303',
            gross_amount: '789000.00',
            currency: 'IDR',
            payment_type: 'credit_card',
            transaction_time: '2023-12-12 15:50:54',
            transaction_status: 'capture',
            fraud_status: 'accept',
            approval_code: '1597223068747',
            masked_card: '48111111-1114',
            card_type: 'credit',
            three_ds_version: '2',
            challenge_completion: true,
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'credit_card',
            grossAmount: 50000,
            tokenId: '1123233535345',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
          })
          .expectStatus(201);
      });
    });
  });
});
