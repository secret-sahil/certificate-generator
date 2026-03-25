import {
  IsArray,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CertificateDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  course: string;

  @IsString()
  template: string;

  @IsOptional()
  @IsDateString()
  issuedAt?: string;
}

export class CreateCertificateDto {
  @IsString()
  template: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificateDto)
  certificates: CertificateDto[];
}
