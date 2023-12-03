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
      it('should initialize credit card payment successfully', async () => {
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
            gross_amount: '50000.00',
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

    describe('BankTransferPaymentStrategy', () => {
      it('[BCA / BRI / BNI / CIMB VA] should initialize bank transfer payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: 201,
            status_message: 'Success, Bank Transfer transaction is created',
            transaction_id: '6781e61d-32f4-4baa-9572-8e5f53648a80',
            order_id: '4zJE9QgO0EAtIvp',
            merchant_id: 'G095877066',
            gross_amount: '165000.00',
            currency: 'IDR',
            payment_type: 'bank_transfer',
            transaction_time: '2023-12-03 13:33:33',
            transaction_status: 'pending',
            fraud_status: 'accept',
            va_numbers: [
              {
                bank: 'bca',
                va_number: '95877066508568',
              },
            ],
            expiry_time: '2023-12-04 13:33:33',
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'bank_transfer',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
            bankName: 'bca',
          })
          .expectStatus(201);
      });

      it('[Mandiri VA] should initialize bank transfer payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: '201',
            status_message: 'OK, Mandiri Bill transaction is successful',
            transaction_id: '51e7bc1a-306e-4762-8c3e-66766d3c40c3',
            order_id: 'SdBtvDrwzczAw9T',
            merchant_id: 'G095877066',
            gross_amount: '265000.00',
            currency: 'IDR',
            payment_type: 'echannel',
            transaction_time: '2023-12-03 15:22:13',
            transaction_status: 'pending',
            fraud_status: 'accept',
            bill_key: '931781085855',
            biller_code: '70012',
            expiry_time: '2023-12-04 15:22:13',
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'bank_transfer',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
            bankName: 'mandiri_bill',
          })
          .expectStatus(201);
      });

      it('[Permata VA] should initialize bank transfer payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: '201',
            status_message: 'Success, PERMATA VA transaction is successful',
            transaction_id: 'b9bba999-5732-4f65-9285-60009f44135e',
            order_id: 'ISW64yFvLLeMEYW',
            merchant_id: 'G095877066',
            gross_amount: '265000.00',
            currency: 'IDR',
            payment_type: 'bank_transfer',
            transaction_time: '2023-12-03 15:25:02',
            transaction_status: 'pending',
            fraud_status: 'accept',
            permata_va_number: '7700063865339399',
            expiry_time: '2023-12-04 15:25:02',
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'bank_transfer',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
            bankName: 'permata',
          })
          .expectStatus(201);
      });
    });
  });
});
