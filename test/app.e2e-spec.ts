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
            status_code: 201,
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
            status_code: 201,
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

    describe('QRISPaymentStrategy', () => {
      it('should initialize qris payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: 201,
            status_message: 'QRIS transaction is created',
            transaction_id: '0d8178e1-c6c7-4ab4-81a6-893be9d924ab',
            order_id: 'order03',
            merchant_id: 'M099098',
            gross_amount: '275000.00',
            currency: 'IDR',
            payment_type: 'qris',
            transaction_time: '2020-09-29 11:46:13',
            transaction_status: 'pending',
            fraud_status: 'accept',
            acquirer: 'gopay',
            actions: [
              {
                name: 'generate-qr-code',
                method: 'GET',
                url: 'https://api.midtrans.com/v2/qris/0d8178e1-c6c7-4ab4-81a6-893be9d924ab/qr-code',
              },
            ],
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'qris',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
          })
          .expectStatus(201);
      });
    });

    describe('GopayPaymentStrategy', () => {
      it('should initialize gopay (qris / deep-link) payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: '201',
            status_message: 'GoPay transaction is created',
            transaction_id: '8ab2c445-7058-4a45-83c0-4ece8671c276',
            order_id: 'gV6oDFPbPHqjzTK',
            merchant_id: 'G095877066',
            gross_amount: '265000.00',
            currency: 'IDR',
            payment_type: 'gopay',
            transaction_time: '2023-12-03 20:18:34',
            transaction_status: 'pending',
            fraud_status: 'accept',
            actions: [
              {
                name: 'generate-qr-code',
                method: 'GET',
                url: 'https://api.sandbox.midtrans.com/v2/gopay/8ab2c445-7058-4a45-83c0-4ece8671c276/qr-code',
              },
              {
                name: 'deeplink-redirect',
                method: 'GET',
                url: 'https://simulator.sandbox.midtrans.com/gopay/partner/app/payment-pin?id=ef27c425-63f4-4e6d-9982-1781ed3fff08',
              },
              {
                name: 'get-status',
                method: 'GET',
                url: 'https://api.sandbox.midtrans.com/v2/8ab2c445-7058-4a45-83c0-4ece8671c276/status',
              },
              {
                name: 'cancel',
                method: 'POST',
                url: 'https://api.sandbox.midtrans.com/v2/8ab2c445-7058-4a45-83c0-4ece8671c276/cancel',
              },
            ],
            expiry_time: '2023-12-03 20:33:34',
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'gopay',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
          })
          .expectStatus(201);
      });
    });

    describe('ShopeePayPaymentStrategy', () => {
      it('should initialize shopee pay payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: '201',
            status_message: 'ShopeePay transaction is created',
            channel_response_code: '0',
            channel_response_message: 'success',
            transaction_id: 'bb379c3a-218b-47c7-9b0b-25f71f0f1231',
            order_id: 'test-order-shopeepay-001',
            merchant_id: 'YON001',
            gross_amount: '25000.00',
            currency: 'IDR',
            payment_type: 'shopeepay',
            transaction_time: '2020-09-29 11:16:23',
            transaction_status: 'pending',
            fraud_status: 'accept',
            actions: [
              {
                name: 'deeplink-redirect',
                method: 'GET',
                url: 'https://wsa.uat.wallet.airpay.co.id/universal-link/wallet/pay?deep_and_deferred=1&token=dFhkbmR1bTBIamhW5n7WPz2OrczCvb8_XiHliB9nROFMVByjtwKMAl6G0Ax0cMr79M4hwjs',
              },
            ],
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'shopeepay',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
          })
          .expectStatus(201);
      });
    });

    describe('IndomaretPaymentStrategy', () => {
      it('should initialize indomaret payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: '201',
            status_message: 'Success, cstore transaction is successful',
            transaction_id: '92ecde38-ac91-498b-a28c-34d36141c4d8',
            order_id: 'SILDL6pdNPkwcPS',
            merchant_id: 'G095877066',
            gross_amount: '265000.00',
            currency: 'IDR',
            payment_type: 'cstore',
            transaction_time: '2023-12-03 21:08:29',
            transaction_status: 'pending',
            fraud_status: 'accept',
            expiry_time: '2023-12-04 21:08:29',
            payment_code: '406922486389',
            store: 'indomaret',
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'indomaret',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
          })
          .expectStatus(201);
      });
    });

    describe('AlfamartPaymentStrategy', () => {
      it('should initialize alfamart payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: '201',
            status_message: 'Success, cstore transaction is successful',
            transaction_id: 'ef0c3930-a075-4a0c-8dfd-62d318a8f77f',
            order_id: 'sdMgY0LGKlcQTaB',
            merchant_id: 'G095877066',
            gross_amount: '265000.00',
            currency: 'IDR',
            payment_type: 'cstore',
            transaction_time: '2023-12-03 21:20:58',
            transaction_status: 'pending',
            fraud_status: 'accept',
            expiry_time: '2023-12-04 21:20:58',
            payment_code: '9587231008792034',
            store: 'alfamart',
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'alfamart',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
          })
          .expectStatus(201);
      });
    });

    describe('AkulakuPaymentStrategy', () => {
      it('should initialize akulaku payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: '201',
            status_message: 'Success, Akulaku transaction is created',
            transaction_id: '803914af-bd02-4cec-90fd-e11ead1d800a',
            order_id: 'xaNEIgyxh0pTuFB',
            redirect_url:
              'https://api.sandbox.midtrans.com/v2/akulaku/redirect/803914af-bd02-4cec-90fd-e11ead1d800a',
            merchant_id: 'G095877066',
            gross_amount: '265000.00',
            currency: 'IDR',
            payment_type: 'akulaku',
            transaction_time: '2023-12-03 21:59:47',
            transaction_status: 'pending',
            fraud_status: 'accept',
            expiry_time: '2023-12-03 23:59:47',
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'akulaku',
            grossAmount: 165000,
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
