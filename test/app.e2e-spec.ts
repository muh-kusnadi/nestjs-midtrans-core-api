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
          data: { success: true, message: 'Payment processed' },
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
          .expectStatus(200);
      });
    });
  });
});
