import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class InitialChargeDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  grossAmount: number;

  @IsNotEmpty()
  @IsString()
  tokenId: string;

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  authentication: boolean;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
