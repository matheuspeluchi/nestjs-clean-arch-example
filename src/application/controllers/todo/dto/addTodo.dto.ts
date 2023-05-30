import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddTodoDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
