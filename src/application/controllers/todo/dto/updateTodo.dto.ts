import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTodoDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  readonly isDone: boolean;
}
