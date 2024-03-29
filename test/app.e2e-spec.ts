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

    describe('BankTransferDirectDebitPaymentStrategy', () => {
      it('[BCA KlikPay] should initialize bank transfer DIRECT DEBIT payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: 201,
            status_message: 'OK, BCA KlikPay transaction is successful',
            transaction_id: 'd4ff8fc1-02fa-4056-afdc-534e20874904',
            order_id: 'FWsa03ZVe4HUlpu',
            redirect_url:
              'https://api.sandbox.midtrans.com/v3/bca/klikpay/redirect/d4ff8fc1-02fa-4056-afdc-534e20874904',
            merchant_id: 'G095877066',
            gross_amount: '265000.00',
            currency: 'IDR',
            payment_type: 'bca_klikpay',
            transaction_time: '2023-12-03 22:35:49',
            transaction_status: 'pending',
            fraud_status: 'accept',
            redirect_data: {
              url: 'https://simulator.sandbox.midtrans.com/bca/klikpay/index',
              method: 'post',
              params: {
                klikPayCode: '03KHAN95877066',
                transactionNo: '329752',
                totalAmount: '265000',
                currency: 'IDR',
                payType: '01',
                callback:
                  'https://staging-client.allstars.id/home/campaign/setup/finish?id=d4ff8fc1-02fa-4056-afdc-534e20874904',
                transactionDate: '03/12/2023 22:35:49',
                descp: 'Pembalian Barang',
                miscFee: '0.00',
                signature: '2612319681',
              },
            },
            expiry_time: '2023-12-04 00:35:49',
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'direct_debit',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
            source: 'bca_klikpay',
          })
          .expectStatus(201);
      });

      it('[KlikBCA] should initialize bank transfer DIRECT DEBIT payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: '201',
            status_message: 'Success, KlikBCA transaction is successful',
            redirect_url: 'https://www.klikbca.com',
            transaction_id: 'c0ba3583-5111-45a5-9f1c-84c9de7cb2f6',
            order_id: '3176440',
            gross_amount: '50000.00',
            payment_type: 'bca_klikbca',
            transaction_time: '2016-06-19 15:53:25',
            transaction_status: 'pending',
            approval_code: 'tes01',
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'direct_debit',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
            source: 'bca_klikbca',
          })
          .expectStatus(201);
      });

      it('[BRIMO] should initialize bank transfer DIRECT DEBIT payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: '201',
            status_message: 'Success, BRI E-Pay transaction is successful',
            transaction_id: 'f7af5b19-5ad5-4267-8fe3-647eb7ce7e6e',
            order_id: 'nHKZJ6zUDQCa01t',
            redirect_url:
              'https://api.sandbox.midtrans.com/v3/bri/epay/redirect/f7af5b19-5ad5-4267-8fe3-647eb7ce7e6e',
            merchant_id: 'G095877066',
            gross_amount: '265000.00',
            currency: 'IDR',
            payment_type: 'bri_epay',
            transaction_time: '2023-12-03 22:44:13',
            transaction_status: 'pending',
            fraud_status: 'accept',
            expiry_time: '2023-12-04 00:44:13',
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'direct_debit',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
            source: 'bri_epay',
          })
          .expectStatus(201);
      });

      it('[CIMB Clicks] should initialize bank transfer DIRECT DEBIT payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: '201',
            status_message: 'Success, CIMB Clicks transaction is successful',
            redirect_url:
              'https://api.midtrans.com/cimb-clicks/request?id=226f042f-020e-4829-8bd7-2de64b8673ce',
            transaction_id: '226f042f-020e-4829-8bd7-2de64b8673ce',
            order_id: '1000156414164125',
            gross_amount: '392127.00',
            payment_type: 'cimb_clicks',
            transaction_time: '2016-06-19 16:41:25',
            transaction_status: 'pending',
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'direct_debit',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
            source: 'cimb_clicks',
          })
          .expectStatus(201);
      });

      it('[Danamon Online] should initialize bank transfer DIRECT DEBIT payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: '201',
            status_message: 'Success, Danamon Online transaction is successful',
            transaction_id: '8e1b4e2f-ebd2-4bb6-bccf-f18eac3107c7',
            order_id: 't7qz8T2iio80uRc',
            redirect_url:
              'https://api.sandbox.midtrans.com/v2/danamon/online/redirect/8e1b4e2f-ebd2-4bb6-bccf-f18eac3107c7',
            merchant_id: 'G095877066',
            gross_amount: '265000.00',
            currency: 'IDR',
            payment_type: 'danamon_online',
            transaction_time: '2023-12-03 22:49:24',
            transaction_status: 'pending',
            fraud_status: 'accept',
            expiry_time: '2023-12-04 00:49:24',
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'direct_debit',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
            source: 'danamon_online',
          })
          .expectStatus(201);
      });

      it('[UOB Ezpay] should initialize bank transfer DIRECT DEBIT payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: '201',
            status_message: 'Success, UOB Ez Pay transaction is successful',
            transaction_id: '226f042f-020e-4829-8bd7-2de64b8673ce',
            order_id: '1000156414164125',
            gross_amount: '392127.00',
            payment_type: 'uob_ezpay',
            transaction_time: '2016-06-19 16:41:25',
            transaction_status: 'pending',
            fraud_status: 'accept',
            actions: [
              {
                name: 'web-deeplink-redirect',
                method: 'GET',
                url: 'https://u-payment.uob.co.id/startup/ezpay?clientId=107b9f3e-7399-4983-8342-a3350e7b8ce0&type=JWT&signature=Jpc3MiOiIxMDdiOWYzZS03Mzk5LTQ5ODMtODM0Mi1hMzM1MGU3YjhjZTAiLCJpYXQiOjE1NjE1NUBQl',
              },
              {
                name: 'mobile-deeplink-redirect',
                method: 'GET',
                url: 'https://digitalbankid.page.link/?link=https://www.tmrwbyuob.com?clientId%3D107b9f3e-7399-4983-8342-a3350e7b8ce0%26signature%3DJpc3MiOiIxMDdiOWYzZS03Mzk5LTQ5ODMtODM0Mi1hMzM1MGU3YjhjZTAiLCJpYXQiOjE1NjE1NUBQl-5gvMiOqzSq-lroACwpf83vpj2NYlExcrYckyV7Oc&type=JWT&apn=com.uob.id.digitalbank.dev&isi=1472320289&ibi=com.uob.id.digitalbank.uat',
              },
            ],
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'direct_debit',
            grossAmount: 165000,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '6234738473874',
            source: 'uob_ezpay',
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

    describe('KredivoPaymentStrategy', () => {
      it('should initialize kredivo payment successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            status_code: '201',
            status_message: 'Kredivo transaction is created',
            transaction_id: 'c1b4e32c-fd32-4ce3-98ed-130a6faf0fef',
            order_id: 'orderid-01',
            redirect_url:
              'https://api.sandbox.veritrans.co.id/v2/oms/redirect/c1b4e32c-fd32-4ce3-98ed-130a6faf0fef',
            merchant_id: 'M099098',
            gross_amount: '40000.00',
            currency: 'IDR',
            payment_type: 'kredivo',
            transaction_time: '2022-04-12 13:55:34',
            transaction_status: 'pending',
            fraud_status: 'accept',
            channel_response_code: 'OK',
            channel_response_message: 'Success Create Transaction',
          },
        });

        await pactum
          .spec()
          .post('/v1/charge')
          .withBody({
            paymentMethod: 'kredivo',
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
