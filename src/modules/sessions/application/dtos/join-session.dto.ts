import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JoinSessionDto {
  @ApiProperty({ description: 'UUID generated and persisted client-side (localStorage)' })
  @IsUUID()
  deviceToken: string;

  @ApiPropertyOptional({ description: 'Required when tenant orderMode is per_client' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  displayName?: string;
}
