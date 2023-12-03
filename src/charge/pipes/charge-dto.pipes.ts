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

@Injectable()
export class ChargeDtoPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    let dtoClass;

    // Determine which DTO to use based on the paymentMethod
    if (value.paymentMethod === 'credit_card') {
      dtoClass = CreditCardChargeDto;
    } else if (value.paymentMethod === 'bank_transfer') {
      dtoClass = BankTransferChargeDto;
    } else if (value.paymentMethod === 'qris') {
      dtoClass = QRISChargeDto;
    } else if (value.paymentMethod === 'gopay') {
      dtoClass = GopayChargeDto;
    } else {
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
