import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class BaseChargeDto {
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  grossAmount: number;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
