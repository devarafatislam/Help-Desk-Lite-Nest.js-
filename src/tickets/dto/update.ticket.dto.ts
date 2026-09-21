import { IsEmpty, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateTicketDto {

    @IsOptional()
    @IsString()
    @IsEmpty()
    subject?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsOptional()
    @IsIn(['low', 'medium', 'high'])
    priority?: 'low' | 'medium' | 'high';

}
