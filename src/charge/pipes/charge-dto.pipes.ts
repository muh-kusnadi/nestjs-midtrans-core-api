import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { CreditCardChargeDto } from '../dto/creditCardCharge.dto';
import { BankTransferChargeDto } from '../dto/bankTransferCharge.dto';
import { QRISChargeDto } from '../dto/qRISCharge.dto';
import { GopayChargeDto } from '../dto/gopayCharge.dto';
import { ShopeePayChargeDto } from '../dto/shopeePayCharge.dto';
import { IndomaretChargeDto } from '../dto/indomaretCharge.dto';
import { AlfamartChargeDto } from '../dto/alfamartCharge.dto';
import { AkulakuChargeDto } from '../dto/akulakuCharge.dto';

@Injectable()
export class ChargeDtoPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    let dtoClass;

    // Determine which DTO to use based on the paymentMethod
    switch (value.paymentMethod) {
      case 'credit_card':
        dtoClass = CreditCardChargeDto;
        break;
      case 'bank_transfer':
        dtoClass = BankTransferChargeDto;
        break;
      case 'qris':
        dtoClass = QRISChargeDto;
        break;
      case 'gopay':
        dtoClass = GopayChargeDto;
        break;
      case 'shopeepay':
        dtoClass = ShopeePayChargeDto;
        break;
      case 'indomaret':
        dtoClass = IndomaretChargeDto;
        break;
      case 'alfamart':
        dtoClass = AlfamartChargeDto;
        break;
      case 'akulaku':
        dtoClass = AkulakuChargeDto;
        break;
      default:
        throw new BadRequestException('Invalid payment method or data');
    }

    const object = plainToInstance(dtoClass, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const validationErrors = this.formatValidationErrors(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    return object;
  }

  private formatValidationErrors(errors: ValidationError[]): any {
    return errors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints);
      return acc;
    }, {});
  }
}
